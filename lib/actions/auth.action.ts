/* eslint-disable @typescript-eslint/no-explicit-any */

//Server Side Rendering
"use server";

//Imports
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { sendMail } from "../nodemailer";
import redis from "../redisConfig";

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
    //Store it in the redis db which expires in 5m:
    await redis.set(
      email,
      JSON.stringify({
        name,
        email,
        password,
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
      ...userRecord.data(),
      id: userRecord.id,
    };
  } catch (e) {
    console.error(`Error While Fetching The Cookie! Error: ${e}`);
    return null;
  }
};

//This will help to fetch the generated interviews for the current user:
export async function fetchGeneratedInterviews(
  userId: string
): Promise<any[] | null> {
  try {
    // Validate userId parameter
    if (!userId || userId === undefined || userId === null) {
      console.error("fetchGeneratedInterviews: userId is undefined or null");
      return null;
    }

    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
    //If Interviews are empty then return a friendly message:
    if (interviews.empty || interviews.docs.length == 0) {
      return null;
    }
    //If there is data:
    const interviewData = interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    //Return The Array:
    return interviewData;
  } catch (error: any) {
    console.error("Error fetching interviews:", error.message || error);
    console.error("userId provided:", userId);
    return null;
  }
}

//This will help to fetch the generated interviews by the other users["Community"]:
export async function fetchLatestGeneratedInterviews(params: {
  userId: string;
  limit: number;
}): Promise<any[] | null> {
  try {
    //Get The Values From Params:
    const { userId, limit = 20 } = params;

    // Validate userId parameter
    if (!userId || userId === undefined || userId === null) {
      console.error(
        "fetchLatestGeneratedInterviews: userId is undefined or null"
      );
      return null;
    }

    const interviews = await db
      .collection("interviews")
      .orderBy("createdAt", "desc")
      .where("finalized", "==", true)
      .where("userId", "!=", userId)
      .limit(limit)
      .get();
    //Check For The Fetched Interviews:
    if (interviews.docs.length === 0 || interviews.empty) {
      return null;
    }
    //If There Is Interview Data:
    const interviewData = interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    //Return the array:
    return interviewData;
  } catch (error: any) {
    console.error("Error Fetching Interviews:", error.message || error);
    console.error("userId provided:", params?.userId);
    console.error("limit provided:", params?.limit);
    return null;
  }
}

//Confirm The User Has Been Authenticated:
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user; //If Data Returns -> True Else False, If True then only get the value!
};
