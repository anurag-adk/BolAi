//Lint Fixes:
/* eslint-disable @typescript-eslint/no-explicit-any */
//Server Side Rendering
"use server";
//Imports:
import { db } from "@/firebase/admin";
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
    //Fetching the interviews from the datbase
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
  limit?: number; //optional
}): Promise<any[] | null> {
  try {
    //Get The Values From Params:
    const { userId, limit } = params;

    // Validate userId parameter
    if (!userId || userId === undefined || userId === null) {
      console.error(
        "fetchLatestGeneratedInterviews: userId is undefined or null"
      );
      return null;
    }

    //If the user has provided the limit explictly then only the limit is applied:
    let query = db
      .collection("interviews")
      .orderBy("createdAt", "desc")
      .where("finalized", "==", true)
      .where("userId", "!=", userId);

    if (limit && limit > 0) {
      query = query.limit(limit);
    }

    //Execute the query:
    const interviews = await query.get();

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
//This will help to fetch the specific interview details:
export const fetchInterviewsById = async (interviewId: string) => {
  try {
    //1. Check whether the interview id provided is valid:
    if (
      !interviewId ||
      !interviewId.trim() ||
      interviewId === null ||
      interviewId === undefined
    ) {
      console.error(
        "The provided interview id is invalid. Interview Id:",
        interviewId
      );
    }
    //2. Fetch the specific data from the database:
    const interview = await db.collection("interviews").doc(interviewId).get();
    //3. Check the fetched value:
    if (!interview) {
      return null;
    }
    //4.Return the value:
    return interview.data();
  } catch (error: any) {
    console.error("Error fetching the interviews: ", error.message || error);
    console.error(
      "The provided interview Id is invalid. InterviewId:",
      interviewId
    );
    return null;
  }
};
