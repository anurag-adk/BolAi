/* eslint-disable @typescript-eslint/no-explicit-any */
//Server Side Rendering
"use server";
//Imports
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { sendMail } from "../nodemailer";
import redis from "../redisConfig";
import { encryptPassword } from "../encryptDecrypt";
import cloudinary from "../cloudinary";

interface signUpParams {
  name: string;
  email: string;
  password: string;
  otp: number;
}

interface signInParams {
  email: string;
  idToken: string;
}

interface updateParams {
  id: string;
  name: string;
  profilePic?: File; //Optional
}

//Exporting the user value:
export type User = {
  id: string;
  name: string;
  profilePic?: string; //optional can't be available all the time.
  createdAt: string;
  email: string;
};

export const signup = async (params: signUpParams) => {
  const { name, email, password, otp } = params;
  try {
    //Check If The User Already Exists In The Platform
    const userDBRecord = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (!userDBRecord.empty) {
      return {
        success: false,
        message: "The provided info already exists for an user",
      };
    }
    //Check If The User Already Exists In The Redis
    const userRecord = await redis.get(email);
    if (userRecord) {
      return {
        success: false,
        message:
          "You have already created an account but have left to validate it.",
      };
    }
    //Encrypt The Password And Store It In Redis:
    const encryptedPassword = encryptPassword(password);
    //Store it in the redis db which expires in 5m:
    await redis.set(
      email,
      JSON.stringify({
        name,
        email,
        password: encryptedPassword,
        otp,
        rate: 5,
      }),
      { ex: 300 }
    );
    //Send The Mail:
    await sendMail({
      type: "otp",
      receiver: email,
      otp,
    });
    //Return Success Message
    return {
      success: true,
      message: "Verify your email to access the account.",
    };
  } catch (error: any) {
    console.error(`Error while creating a new user: ${error}`);

    //Firebase Specific Errors:
    if (error.code === "auth/email-already-exists") {
      return {
        message: "This email is already used!",
        success: false,
      };
    }

    //DB or Server Error:
    return {
      success: false,
      message: "Failed to create a new account for the user!",
    };
  }
};

export const signIn = async (params: signInParams) => {
  const { email, idToken } = params;
  try {
    //Check Whether The User Exists Or Not
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "The user not found in the system!",
      };
    }

    // Query your database to get user data
    const user = await db.collection("users").where("email", "==", email).get();
    if (user.empty) {
      return {
        success: false,
        message: "User not found in database",
      };
    }

    //Generate A Login Token:
    await setSessionCookie(idToken);

    //Send The Success Message
    return {
      success: true,
      message: "Login successful!",
    };
  } catch (error) {
    console.error(`Unable to authenticate the user. Error: ${error}`);
    return {
      success: false,
      message: "Failed to authenticate the user.",
    };
  }
};

export const setSessionCookie = async (idToken: string) => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: 1000 * 60 * 60 * 24 * 3, // 3-Day Duration in ms for firebase
    });
    cookieStore.set("session", sessionCookie, {
      httpOnly: true, //Http-Only Cookie
      sameSite: "lax",
      path: "/",
      secure: false, //Development
      maxAge: 60 * 60 * 24 * 3, // 3-Day Duration in secs
    });
  } catch (error) {
    console.error(`Error While Creating The Session: ${error}`);
  }
};

export const clearSessionCookie = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.set("session", "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: false,
      maxAge: 0,
    });
  } catch (e) {
    console.error(`There was error while logging out! ${e}`);
  }
};

//This will provide the currentLoggedIn User To The FrontEnd So That we can protect the routes:
export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  //Check If There is no sessionCookie
  if (!sessionCookie) return null;
  //Cookie Exists:
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    //Check whether userRecord Exists:
    if (!userRecord.exists) return null;
    //If userRecord Exists:
    return {
      ...(userRecord.data() as Omit<User, "id">),
      id: userRecord.id,
    };
  } catch (e) {
    console.error(`Error While Fetching The Cookie! Error: ${e}`);
    return null;
  }
};

//Confirm The User Has Been Authenticated:
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user; //If Data Returns -> True Else False, If True then only get the value!
};

//This function will help the users to update their profile info:
export const updateUserProfile = async (params: updateParams) => {
  try {
    //Check Whether The User Exists:
    const userExists = await auth.getUser(params.id);
    if (!userExists) {
      return {
        success: false,
        message: "The loggedIn user doesn't exist in the platform.",
      };
    }
    //Validate the provided params:
    const nameRegex = /^(?=.{2,100}$)([A-Z][a-z]{1,})([ '-][A-Z][a-z]{1,})*$/;
    if (!params.name.trim() || !nameRegex.test(params.name)) {
      return {
        success: false,
        message:
          "Invalid fullname. Use letters, spaces, hyphens or apostrophes. Start with capital letters.",
      };
    }
    if (!params.id.trim()) {
      return {
        success: false,
        message: "A valid user ID is required to perform the update operation.",
      };
    }
    //Check If The Data Provided Matches The Previous Data:
    const userDoc = await db.collection("users").doc(params.id).get();
    const currentUserData = userDoc.data();
    if (!currentUserData || !userDoc) {
      return {
        success: false,
        message:
          "We were unable to retrieve user information using the provided login credentials",
      };
    }
    //Early Exit Logic:
    const nameChanged = params.name !== currentUserData.name;
    const imageProvided = params.profilePic && params.profilePic.size > 0;
    if (!nameChanged && !imageProvided) {
      return {
        success: false,
        message:
          "No changes detected. Please provide new information to update your profile.",
      };
    }
    //Build an object or change object:
    const updatedData: any = {};
    //If a new profilePic is provided:
    if (params.profilePic && params.profilePic.size > 0) {
      try {
        // Convert File to Buffer for Cloudinary
        const bytes = await params.profilePic.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64String = `data:${
          params.profilePic.type
        };base64,${buffer.toString("base64")}`;
        //Defining The Function To Extract The PublicId From The Secure_Url:
        function getPublicIdFromUrl(url: string): string {
          const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
          return match ? match[1] : "";
        }
        //First Time Uploading a pic in the cloudinary:
        if (!currentUserData?.profilePic) {
          const result = await cloudinary.uploader.upload(base64String, {
            resource_type: "auto",
            folder: "bolai_profile_pics",
            public_id: `user_${params.id}_${Date.now()}`,
          });
          updatedData.profilePic = result.secure_url;
        } else {
          //If Changing The Existing Profile Pic:
          //1. Delete The Existing Picture
          const publicId = getPublicIdFromUrl(currentUserData.profilePic);
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
          });
          //2. Upload The New Image:
          const result = await cloudinary.uploader.upload(base64String, {
            resource_type: "auto",
            folder: "bolai_profile_pics",
            public_id: `user_${params.id}_${Date.now()}`,
          });
          updatedData.profilePic = result.secure_url;
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          message:
            "Unable to update profile picture. An error occurred during upload.",
        };
      }
    }
    //Update The New Name If Provided:
    if (currentUserData.name !== params.name) {
      updatedData.name = params.name;
    }
    //Now Finally Updating The Data In The DB:
    await db.collection("users").doc(params.id).update(updatedData);
    //Send Response After Successful Update:
    return {
      success: true,
      message: "User profile updated successfully.",
    };
  } catch (error: any) {
    console.error(error.message || error);
    return {
      success: false,
      message:
        "Something went wrong while updating the profile. Please try again shortly.",
    };
  }
};
