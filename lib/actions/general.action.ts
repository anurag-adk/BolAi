//Lint Fixes:
/* eslint-disable @typescript-eslint/no-explicit-any */

//Server Side Rendering
"use server";

//Imports:
import { db } from "@/firebase/admin";
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { Feedback, feedbackSchema, FeedbackWithId } from "@/constants/index";

//Types:
type CreateFeedbackParams = {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
};

//This will help to fetch the generated interviews for the current user:
export async function fetchGeneratedInterviews(params: {
  userId: string;
  limit?: number;
}): Promise<any[] | null> {
  //Access the data:
  const { userId, limit } = params;
  try {
    // Validate userId parameter
    if (!userId || userId === undefined || userId === null) {
      console.error("fetchGeneratedInterviews: userId is undefined or null");
      return null;
    }
    //Fetching the interviews from the datbase
    let query = db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc");
    //If there is a limit fetching the interview:
    if (limit && limit > 0) {
      query = query.limit(limit);
    }
    //Execute the query:
    const interviews = await query.get();
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
    //4.Return the value with ID:
    return {
      id: interview.id,
      ...interview.data(),
    };
  } catch (error: any) {
    console.error("Error fetching the interviews: ", error.message || error);
    console.error(
      "The provided interview Id is invalid. InterviewId:",
      interviewId
    );
    return null;
  }
};
//This will create a feedback for the interview done:
export const createFeedback = async (params: CreateFeedbackParams) => {
  try {
    const { interviewId, userId, transcript } = params;
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content} \n`
      )
      .join("");
    const { text: feedbackText } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.

      Return the feedback as a valid JSON object matching this exact structure:

      {
        "totalScore": number,
        "categoryScores": [
          { "name": "Understanding & Relevance", "score": number, "comment": string },
          { "name": "Depth of Knowledge & Accuracy", "score": number, "comment": string },
          { "name": "Problem-Solving & Reasoning Ability", "score": number, "comment": string },
          { "name": "Communication & Articulation", "score": number, "comment": string },
          { "name": "Professionalism & Attitude", "score": number, "comment": string }
        ],
        "strengths": [string],
        "areasForImprovement": [string],
        "finalAssessment": string
      }
      
      Transcript:
      ${formattedTranscript}

      Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Understanding & Relevance**: How well the candidate comprehends the question and provides a relevant answer.
        - **Depth of Knowledge & Accuracy**: The correctness, precision, and completeness of the information or logic provided.
        - **Problem-Solving & Reasoning Ability**: How effectively the candidate applies logical thinking or creativity to find and justify solutions.
        - **Communication & Articulation**: How clearly, confidently, and fluently the candidate communicates.
        - **Professionalism & Attitude**: How the candidate conducts themselves politeness, tone, patience, and enthusiasm.

      `,
    });
    // Clean and parse JSON safely
    let data: Feedback | null = null;
    try {
      const cleaned = feedbackText
        .trim()
        .replace(/```json/g, "")
        .replace(/```/g, "");
      data = feedbackSchema.parse(JSON.parse(cleaned));
    } catch (error) {
      console.error("Failed to parse AI feedback:", error);
      return {
        success: false,
        message:
          "There was error generating the feedback for the user's interview.",
      };
    }
    //Adding the data or object into db:
    const feedback = await db.collection("feedback").add({
      interviewId,
      userId,
      totalScore: data.totalScore,
      categoryScores: data.categoryScores,
      strengths: data.strengths,
      areasForImprovement: data.areasForImprovement,
      finalAssessment: data.finalAssessment,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      feedbackId: feedback.id,
    };
  } catch (error: any) {
    console.error(
      "Error saving the feedback for the interview: ",
      error.message || error
    );
    return {
      success: false,
      message: "Error saving the feedback for the interview.",
    };
  }
};
//This will fetch the feedback info from db and render to the user:
export async function fetchFeedbackById(params: {
  interviewId: string;
  userId: string;
  feedbackId?: string;
}) {
  try {
    const { interviewId, userId, feedbackId } = params;
    let feedbackDoc: FeedbackWithId | null = null;

    if (feedbackId) {
      const docSnap = await db.collection("feedback").doc(feedbackId).get();

      if (!docSnap.exists) {
        return {
          success: false,
          message: "The feedback doesn't exist in the db.",
        };
      }

      feedbackDoc = {
        id: docSnap.id,
        ...(docSnap.data() as Omit<FeedbackWithId, "id">),
      };
    } else {
      const querySnap = await db
        .collection("feedback")
        .where("userId", "==", userId)
        .where("interviewId", "==", interviewId)
        .limit(1)
        .get();

      if (querySnap.empty) {
        return {
          success: false,
          message: "No feedback found for this user and interview.",
        };
      }

      const doc = querySnap.docs[0];
      feedbackDoc = {
        id: doc.id,
        ...(doc.data() as Omit<FeedbackWithId, "id">),
      };
    }

    if (feedbackDoc.interviewId !== interviewId) {
      return {
        success: false,
        message: "Feedback does not belong to this interview.",
      };
    }

    if (feedbackDoc.userId !== userId) {
      return {
        success: false,
        message: "Feedback does not belong to this user.",
      };
    }

    return feedbackDoc;
  } catch (error) {
    console.error("Error while fetching feedback info.", error);
    return {
      success: false,
      message: "Error while fetching the feedback info.",
    };
  }
}

//This will help to fetch all the necessary feedbacks for the user, so if user wants to access his feedbacks can easily do it.
export async function fetchFeedbacksForUser(userId: string) {
  try {
    // Validate userId parameter:
    if (!userId || userId === undefined || userId === null) {
      console.error("fetchGeneratedInterviews: userId is undefined or null");
      return {
        success: false,
        message: "Error, the userId provided was invalid.",
      };
    }
    //Fetching the interview feedbacks from the db:
    const feedbacks = await db
      .collection("feedback")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
    //If the feedbacks are empty then send a proper message:
    if (feedbacks.docs.length <= 0 || feedbacks.empty) {
      return {
        success: false,
        message: "Problem, while fetching the feedbacks.",
      };
    }
    //Now, I want a populated data I want to get the interview information also from each of the feedbacks fetched for the user where both of them have a common field called userId.
    const feedbacksWithInterviewsInfo = await Promise.all(
      feedbacks.docs.map(async (doc) => {
        const feedbackData = doc.data();
        const interviewId = feedbackData.interviewId;
        //Fetch the interview documents
        const interviews = await db
          .collection("interviews")
          .doc(interviewId)
          .get();
        const interviewData = interviews.data();
        //Return the mixed data:
        return {
          id: doc.id,
          interviewId,
          ...feedbackData,
          interview: interviewData,
        };
      })
    );
    if (!feedbacksWithInterviewsInfo) {
      return {
        success: false,
        message: "Error merging the feedbacks with interview information.",
      };
    }
    //Return the data:
    return {
      success: true,
      message: "Feedbacks with interview data fetched successfully.",
      data: feedbacksWithInterviewsInfo,
    };
  } catch (error) {
    console.error("Error while fetching the feedbacks.", error);
    return {
      success: false,
      message: "Error while fetching the feedbacks.",
    };
  }
}
