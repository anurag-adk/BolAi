import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { db } from "@/firebase/admin";

export async function GET() {
  console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY);
  return Response.json({
    success: true,
    message: "THANK YOU!",
    statusCode: 200,
  });
}

//Defining The Interface For The Interview Object:
interface Interview {
  role: string; //Any As Defined By The User
  type: "Technical" | "Behavioral" | "Mixed"; //Enum Values
  level: "Entry" | "Mid" | "Senior"; //Enum Values
  amount: string; //Alpha Numeric like: '4', '3'
  userid: string; //Object Id coming from the firebase
  imagePath: string; //URL of the image
  techstack: string | string[]; //Array Of The Strings
}

import { rateLimiter } from "@/lib/rateLimiting";

export async function POST(request: Request) {
  const requestData: Interview = await request.json();
  const { type, role, level, techstack, amount, userid, imagePath } =
    requestData;

  // Rate limiting with progressive windows
  const rateKey = `ratelimit:generate:${userid}`;
  const rateLimitResult = await rateLimiter(rateKey);

  if (!rateLimitResult.allowed) {
    const timeLeftMinutes = Math.ceil((rateLimitResult.timeLeft || 0) / 60);
    const tier = rateLimitResult.tierLevel;

    return Response.json(
      {
        success: false,
        message: `Too many requests. You're in ${tier} tier. Please try again in ${timeLeftMinutes} minutes.`,
      },
      { status: 429 }
    );
  }
  try {
    const { text: questions } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `Prepare interview questions for a job.

        Job Role: ${role}
        Experience Level: ${level}
        Tech Stack: ${techstack}
        Question Type Focus: ${type}
        Number of Questions: ${amount}

        Guidelines:
        - Do NOT wrap the output in triple backticks (like \`\`\`json or \`\`\`)
        - Do NOT include any explanation, title, or extra formatting.
        - Output ONLY valid raw JSON (JavaScript array of strings).
        - Example format: ["Question 1", "Question 2", "Question 3"]
        - Do NOT include special characters like "/" or "*" or code symbols that could break a voice assistant.

        Your output must be **only** the raw array.

        Thank you!`,
    });

    const interview = {
      role,
      type,
      level,
      techstack: Array.isArray(techstack)
        ? techstack
        : techstack.startsWith("[")
        ? JSON.parse(techstack)
        : String(techstack)
            .split(",")
            .map((item) => item.trim()),
      questions: (() => {
        try {
          const cleaned = questions
            .trim()
            .replace(/```json/g, "")
            .replace(/```/g, "");
          return JSON.parse(cleaned);
        } catch {
          return [
            `What interests you most about the ${role} position?`,
            `Describe your experience with ${techstack}.`,
          ];
        }
      })(),
      userId: userid,
      finalized: true,
      imagePath: imagePath
        ? imagePath
        : "https://placehold.co/150x150/ffffff/28a745?text=BolAi",
      createdAt: new Date().toISOString(),
    };

    const newInterview = await db.collection("interviews").add(interview);
    if (!newInterview) {
      return Response.json({
        success: false,
        message: "Failed to create a new interview!",
        statusCode: 500,
      });
    }
    return Response.json({
      success: true,
      message: "Successfully Created!",
      statusCode: 200,
    });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return Response.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
