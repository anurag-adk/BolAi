/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
//Server Side Rendering
"use server";

//Imports:
import { db } from "@/firebase/admin";
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import {
  AIFeedback,
  aiFeedbackSchema,
  DBFeedback,
  FeedbackWithId,
} from "@/constants/index";
import { logger } from "@/lib/logger";

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
      logger.error("fetchGeneratedInterviews: invalid user ID");
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
    console.error("Error fetching interviews");
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
    console.error("Error fetching interviews");
    return null;
  }
}
//This will help to fetch the specific interview details:
import { InterviewResponse } from "@/types/api";
import { InterviewData, QuestionData } from "@/types/interview";

interface FirebaseInterviewData
  extends Omit<InterviewData, "id" | "questions"> {
  userId: string;
  finalized?: boolean;
  createdAt: string;
  questions?: QuestionData[];
}

export const fetchInterviewsById = async (
  interviewId: string,
  userId: string, // Making userId required for security
  includeQuestions: boolean = false
): Promise<InterviewResponse> => {
  try {
    // 1. Validate input parameters
    if (!interviewId?.trim() || !userId?.trim()) {
      console.error("Invalid request parameters");
      return {
        success: false,
        message: "Invalid request parameters",
      };
    }

    // 2. Fetch interview with owner check
    const interview = await db.collection("interviews").doc(interviewId).get();

    if (!interview.exists) {
      return {
        success: false,
        message: "Interview not found",
      };
    }

    const interviewData = interview.data() as FirebaseInterviewData | undefined;
    if (!interviewData) {
      return {
        success: false,
        message: "Interview data not found",
      };
    }

    // 3. Authorization check
    if (interviewData.userId !== userId && !interviewData.finalized) {
      console.error("Unauthorized access attempt");
      return {
        success: false,
        message: "Unauthorized access",
      };
    }

    // 4. Transform data to match InterviewData type
    const transformedData: InterviewData = {
      id: interview.id,
      role: interviewData.role,
      type: interviewData.type,
      imagePath: interviewData.imagePath,
      techstack: interviewData.techstack,
      questions: includeQuestions ? interviewData.questions || [] : [],
    };

    // 5. Return full data
    return {
      success: true,
      data: transformedData,
    };
  } catch (error: any) {
    console.error("Error fetching the interviews: ", error.message || error);
    console.error(
      "The provided interview Id is invalid. InterviewId:",
      interviewId
    );
    return {
      success: false,
      message: "Error fetching interview data",
    };
  }
};
//This will create a feedback for the interview done:
export const createFeedback = async (params: CreateFeedbackParams) => {
  try {
    const { interviewId, userId, transcript } = params;

    // Validate transcript
    if (!transcript || transcript.length === 0) {
      console.error("Empty transcript provided");
      return {
        success: false,
        message: "Cannot generate feedback from empty transcript",
      };
    }

    // Enhanced transcript formatting with clear role separation
    const formattedTranscript = transcript
      .map((sentence: { role: string; content: string }, index) => {
        const rolePrefix =
          sentence.role === "assistant" ? "Interviewer" : "Candidate";
        return `${rolePrefix} [Turn ${index + 1}]: ${sentence.content}\n`;
      })
      .join("\n");

    // Generate feedback from AI (single attempt, no retry)
    let feedbackText = "";
    try {
      const { text } = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        prompt: `You are an expert AI interviewer conducting a comprehensive analysis of a mock interview. Your task is to provide detailed, constructive feedback based on the candidate's performance. Be objective and thorough in your evaluation.

        Analyze the following interview transcript and provide a detailed evaluation in JSON format.

        === Interview Context ===
          ${formattedTranscript}

        === Evaluation Guidelines ===
          1. Score each category from 0-100 based on specific criteria
          2. Provide detailed comments with examples from the transcript
          3. List concrete strengths and areas for improvement
          4. Give actionable recommendations in the final assessment

        Return a valid JSON object with this exact structure:
          {
            "totalScore": number (0-100),
            "categoryScores": [
              {
                "name": "Understanding & Relevance",
                "score": number (0-100),
                "comment": "Detailed analysis with specific examples from the interview"
              },
              {
                "name": "Depth of Knowledge & Accuracy",
                "score": number (0-100),
                "comment": "Evaluate technical accuracy and depth of responses"
              },
              {
                "name": "Problem-Solving & Reasoning Ability",
                "score": number (0-100),
                "comment": "Assess logical thinking and solution approach"
              },
              {
                "name": "Communication & Articulation",
                "score": number (0-100),
                "comment": "Evaluate clarity and effectiveness of communication"
              },
              {
                "name": "Professionalism & Attitude",
                "score": number (0-100),
                "comment": "Assess professional conduct and demeanor"
              }
            ],
            "strengths": ["Clear, specific strengths with examples"],
            "areasForImprovement": ["Actionable improvement points"],
            "finalAssessment": "Comprehensive evaluation summary with specific recommendations"
          }

          Scoring Criteria:
            - Understanding & Relevance (0-100): Comprehension of questions and relevance of answers
            - Depth of Knowledge & Accuracy (0-100): Technical accuracy and completeness
            - Problem-Solving & Reasoning (0-100): Logical thinking and solution quality
            - Communication & Articulation (0-100): Clarity and fluency
            - Professionalism & Attitude (0-100): Professional conduct and engagement

          Ensure all scores and feedback are justified with specific examples from the transcript.
        `,
      });
      feedbackText = text;
    } catch (error) {
      console.error("Feedback generation failed:", error);
      return {
        success: false,
        message: "Failed to generate feedback. Please try again.",
      };
    }

    // Clean and parse JSON safely with enhanced error handling
    let aiFeedback: AIFeedback;
    try {
      // Clean the response text
      const cleaned = feedbackText
        .trim()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/^\s*{\s*/, "{")
        .replace(/\s*}\s*$/, "}");

      // Parse and validate the JSON structure
      let parsedData;
      try {
        parsedData = JSON.parse(cleaned);
      } catch (parseError) {
        console.error("Invalid JSON format:", parseError);
        return {
          success: false,
          message:
            "The AI generated an invalid response format. Please try again.",
        };
      }

      // Validate categoryScores structure
      if (
        !Array.isArray(parsedData.categoryScores) ||
        parsedData.categoryScores.length !== 5
      ) {
        console.error(
          "Invalid categoryScores structure:",
          parsedData.categoryScores
        );
        return {
          success: false,
          message: "The feedback generation was incomplete. Please try again.",
        };
      }

      // Validate score ranges
      if (parsedData.totalScore < 0 || parsedData.totalScore > 100) {
        console.error("Invalid total score:", parsedData.totalScore);
        return {
          success: false,
          message: "Invalid feedback score range.",
        };
      }

      // Validate using Zod schema (ONLY validates AI response)
      aiFeedback = aiFeedbackSchema.parse(parsedData);

      // Additional validation for meaningful content
      if (
        aiFeedback.strengths.length === 0 ||
        aiFeedback.areasForImprovement.length === 0
      ) {
        console.error("Empty strengths or areas for improvement");
        return {
          success: false,
          message: "Incomplete feedback analysis.",
        };
      }
    } catch (error) {
      console.error("Failed to parse AI feedback:", error);
      return {
        success: false,
        message: "Error processing the interview feedback.",
      };
    }

    try {
      // Prepare feedback data for database
      const feedbackData: DBFeedback = {
        interviewId,
        userId,
        totalScore: aiFeedback.totalScore,
        categoryScores: aiFeedback.categoryScores,
        strengths: aiFeedback.strengths,
        areasForImprovement: aiFeedback.areasForImprovement,
        finalAssessment: aiFeedback.finalAssessment,
        createdAt: new Date().toISOString(),
      };

      // Store in database (Firebase auto-generates id)
      const feedback = await db.collection("feedback").add(feedbackData);

      return {
        success: true,
        message: "Feedback generated and stored successfully",
        data: {
          id: feedback.id, // This is what Agent.tsx expects
        },
      };
    } catch (error) {
      console.error("Failed to store feedback in database:", error);
      return {
        success: false,
        message: "Error saving the feedback to database.",
      };
    }
  } catch (error: any) {
    console.error(
      "Error saving the feedback for the interview:",
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

//SECURITY FIX: New function to fetch interview questions only when user starts the interview
export const fetchInterviewQuestions = async (
  interviewId: string,
  userId: string
) => {
  try {
    // Validate inputs
    if (!interviewId || !userId) {
      console.error("Invalid interviewId or userId provided");
      return {
        success: false,
        message: "Invalid request parameters",
      };
    }

    // Fetch the interview
    const interview = await db.collection("interviews").doc(interviewId).get();

    if (!interview.exists) {
      return {
        success: false,
        message: "Interview not found",
      };
    }

    const interviewData = interview.data() as FirebaseInterviewData | undefined;

    if (!interviewData) {
      return {
        success: false,
        message: "Interview data not found",
      };
    }

    // AUTHORIZATION CHECK: Allow access to finalized (community) interviews
    if (interviewData.userId !== userId) {
      if (!interviewData.finalized) {
        console.error(
          `Unauthorized: User ${userId} tried to access questions for private interview ${interviewId} owned by ${interviewData.userId}`
        );
        return {
          success: false,
          message:
            "Unauthorized: This interview is not available in the community",
        };
      }

      console.log(
        `Community interview access: User ${userId} accessing interview ${interviewId}`
      );
    }

    // Return only the questions
    return {
      success: true,
      questions: interviewData.questions || [],
    };
  } catch (error: any) {
    console.error(
      "Error fetching interview questions:",
      error.message || error
    );
    return {
      success: false,
      message: "Error fetching interview questions",
    };
  }
};

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
