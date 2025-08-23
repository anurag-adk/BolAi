//Server Component:
"use server";

//Imports For JWT And Crypto:
import jwt from "jsonwebtoken";
import crypto from "crypto";

//Imports For Db:
import { db } from "@/firebase/admin";
import { sendMail } from "./nodemailer";

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
    if (userRecord.empty) {
      return {
        success: false,
        message: "No user found with the provided email",
      };
    }
    //If The Email Is Already Verified:
    const emailAlreadyVerified = await db
      .collection("users")
      .where("email", "==", payload.email)
      .where("isEmailValid", "==", true)
      .limit(1)
      .get();
    if (!emailAlreadyVerified.empty) {
      return {
        success: false,
        message: "Provided email is already verified",
      };
    }
    //Now Generate A New Otp For The User:
    const otp = await generateOtp();
    //Retrieve The UID And Data From The Retrieved User:
    const userDoc = userRecord.docs[0];
    const userData = userDoc.data();
    //Generate The Token:
    const token = await generateToken({
      email: userData.email!,
      name: userData.name!,
    });
    //Update The DB With The New Token Id:
    const newRecord = await db
      .collection("users")
      .doc(userDoc.id)
      .update({ otp });
    //Check If Update Is Successful:
    if (!newRecord) {
      return {
        success: false,
        message: "Unable to update the otp of the existing user!",
      };
    }
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
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error while regenerating the new otp code!",
    };
  }
}

//Function To Check And Verify The Jwt Token And Provided Otp Value:
export async function checkAndVerify(payload: verifyPayload) {
  try {
    //Check Whether The Provided Token Is Valid:
    const decodedData = await verifyToken(payload.token);
    if (
      !decodedData ||
      typeof decodedData === "string" ||
      !("email" in decodedData)
    ) {
      return {
        success: false,
        message:
          "Your token is invalid or expired. Click 'Didn't receive the code?' and enter your email to get a new OTP.",
      };
    }
    //Check Whether The User Exists With The Provided Email And Name:
    const userRecord = await db
      .collection("users")
      .where("email", "==", decodedData.email!)
      .limit(1)
      .get();
    if (userRecord.empty) {
      return {
        success: false,
        message: "No user found with the provided email",
      };
    }
    //Extract The UID and Other Info To Check The Otp Code!
    const otp = parseInt(payload.otpCode, 10); //Provided Otp
    const userDoc = userRecord.docs[0];
    const userData = userDoc.data();
    //Check Whether The Provided Otp Matches The Extracted Otp:
    if (otp !== userData.otp) {
      return {
        success: false,
        message: "The OTP you entered is incorrect. Please try again.",
      };
    }
    //Update The emailVerified and Otp field:
    const newRecord = await db
      .collection("users")
      .doc(userDoc.id)
      .update({ isEmailValid: true, otp: 0 });
    //Check If Update Is Successful:
    if (!newRecord) {
      return {
        success: false,
        message: "Unable to verify the user's email.",
      };
    }
    //Send The Validation Success Mail:
    await sendMail({
      type: "verified",
      receiver: userData.email,
      name: userData.name,
    });
    //Success Response:
    return {
      success: true,
      message: "Email successfully verified.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error while validating your OTP!",
    };
  }
}
