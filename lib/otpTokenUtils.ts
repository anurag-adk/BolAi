/* eslint-disable @typescript-eslint/no-unused-vars */
//Server Component:
"use server";

//Imports For JWT And Crypto:
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { createHash } from "crypto";
import { headers } from "next/headers";

//Imports For Db:
import { db } from "@/firebase/admin";
import { sendMail } from "./nodemailer";
import redis from "./redisConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { auth as adminAuth } from "@/firebase/admin";
import { decryptPassword } from "./encryptDecrypt";
import { rateLimiter } from "./rateLimiting";

//Interface For The Payloads
interface TokenPayload {
  name?: string; //optional
  email: string; //required
}
interface verifyPayload {
  otpCode: string; //required
  token: string; //required
}

//Function To Generate The Random Otp Code:
export async function generateOtp() {
  if (!process.env.OTP_MinValue || !process.env.OTP_MaxValue) {
    throw new Error("OTP env variables are missing!");
  }
  const min = parseInt(process.env.OTP_MinValue, 10);
  const max = parseInt(process.env.OTP_MaxValue, 10);
  if (isNaN(min) || isNaN(max)) {
    throw new Error("OTP_MinValue or OTP_MaxValue is not a valid number.");
  }
  return crypto.randomInt(min, max + 1);
}

//Function To Generate The JWt_Token:
export async function generateToken(payload: TokenPayload) {
  return jwt.sign(payload, process.env.OTP_JWT_SECRET!, { expiresIn: "5m" });
}

//Function To Decode The Jwt Token:
export async function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, process.env.OTP_JWT_SECRET!);
    return payload;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//Function To Regenerate The Jwt Token And Otp:
export async function regenerateToken(payload: TokenPayload) {
  try {
    //Check If The User Already Exists In The System:
    const userRecord = await db
      .collection("users")
      .where("email", "==", payload.email)
      .limit(1)
      .get();
    if (!userRecord.empty) {
      return {
        success: true,
        type: "success",
        message: "The provided user is already verified.",
      };
    }
    //Check If The Redis Values Is Available:
    const userExists = ((await redis.get(payload.email)) as string) || null;
    if (!userExists) {
      return {
        success: false,
        type: "resend",
        message: "Session expired. Sign up again to receive a new OTP.",
      };
    }

    // Handle both string and object cases from Redis
    let userData;
    try {
      if (typeof userExists === "string") {
        userData = JSON.parse(userExists);
      } else {
        // If Redis returned an object directly, use it as-is
        userData = userExists;
      }
    } catch (parseError) {
      console.error("Redis data parsing error occurred");
      return {
        success: false,
        type: "resend",
        message: "Session data corrupted. Sign up again to receive a new OTP.",
      };
    }

    //Now Generate A New Otp For The User:
    const otp = await generateOtp();

    //Generate The Token:
    const token = await generateToken({
      email: userData.email!,
      name: userData.name!,
    });

    //Update The New OTP In Redis:
    userData.otp = otp;
    await redis.set(userData.email, JSON.stringify(userData), { ex: 300 });

    //Send The Mail To The User:
    await sendMail({
      type: "otp",
      receiver: userData.email,
      otp,
    });
    //Send The New Token
    return {
      success: true,
      token,
      message: "Successfully Created The New OTP",
      type: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      type: "stay",
      message: "Error while regenerating the new otp code!",
    };
  }
}

//Function To Check And Verify The Jwt Token And Provided Otp Value:
export async function checkAndVerify(payload: verifyPayload) {
  try {
    // Rate limiting check with progressive windows
    const tokenKey = `ratelimit:otp:${payload.token}`;

    const rateLimitResult = await rateLimiter(tokenKey);

    if (!rateLimitResult.allowed) {
      const timeLeftMinutes = Math.ceil((rateLimitResult.timeLeft || 0) / 60);
      const tier = rateLimitResult.tierLevel;

      return {
        success: false,
        type: "stay",
        message: `Too many verification attempts. You're in ${tier} tier. Please try again in ${timeLeftMinutes} minutes.`,
      };
    }
    //Check Whether The Provided Token Is Valid:
    const decodedData = await verifyToken(payload.token);
    if (
      !decodedData ||
      typeof decodedData === "string" ||
      !("email" in decodedData)
    ) {
      return {
        success: false,
        type: "resend",
        message:
          "Your code expired or is invalid. Please sign up again to get a new one.",
      };
    }

    //Check Whether The User Exists With The Provided Email:
    const userExists = (await redis.get(decodedData.email)) as string | null;

    if (!userExists) {
      return {
        success: false,
        type: "resend",
        message:
          "Your session expired after 5 minutes. Please sign up again to continue.",
      };
    }

    // Handle both string and object cases from Redis:
    let userInfo;
    try {
      if (typeof userExists === "string") {
        userInfo = JSON.parse(userExists);
      } else {
        // If Redis returned an object directly, use it as-is
        userInfo = userExists;
      }
    } catch (parseError) {
      console.error("Redis data parsing error occurred");
      return {
        success: false,
        type: "resend",
        message: "Session data corrupted. Please sign up again.",
      };
    }

    //Check the otp values using hash comparison
    const inputOtpHash = createHash("sha256")
      .update(payload.otpCode)
      .digest("hex");

    if (inputOtpHash !== userInfo.otpHash) {
      //Before Decrementing Check The Rate-Limiting Logic:
      if (userInfo.rate === 1) {
        //This is the last and you have exhausted all of the attempts to verify your account:
        await redis.del(decodedData.email);
        return {
          success: false,
          type: "resend",
          message:
            "Invalid OTP. You've exhausted all attempts. Please sign up again.",
        };
      }
      //Decrease The Attempt:
      userInfo.rate -= 1;
      // Update the rate in Redis
      await redis.set(decodedData.email, JSON.stringify(userInfo), { ex: 300 });
      return {
        success: false,
        type: "stay",
        message: `Invalid OTP. You have ${userInfo.rate} attempt(s) left to verify your account.`,
      };
    }

    //If the otp is valid then generate a new user in the db:
    //Check If The Authentication Is Already Created
    try {
      const isAuthCreated = await adminAuth.getUserByEmail(userInfo.email);
      if (isAuthCreated) {
        return {
          success: false,
          type: "stay",
          message: "Account already exists. Please try logging in instead.",
        };
      }
    } catch (error) {}
    //Decrypt The Password Before Creating The Credentials:
    userInfo.password = decryptPassword(userInfo.password);
    // Using The Firebase In-Built Function
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      userInfo.email,
      userInfo.password
    );
    //Create the new user into the db
    const newUser = await db
      .collection("users")
      .doc(userCredentials.user.uid)
      .set({
        name: userInfo.name,
        email: userInfo.email,
        createdAt: new Date().toISOString(),
      });
    //Check If Creation Was Success
    if (!newUser) {
      return {
        success: false,
        type: "resend",
        message: "Failed to create a new user in the platform!",
      };
    }

    //Send The Validation Success Mail:
    await sendMail({
      type: "verified",
      receiver: userInfo.email,
      name: userInfo.name,
    });

    // Clean up Redis data after successful verification
    await redis.del(userInfo.email);

    //Success Response:
    return {
      success: true,
      type: "success",
      message: "Email successfully verified.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      type: "stay",
      message: "Error while validating your OTP!",
    };
  }
}
