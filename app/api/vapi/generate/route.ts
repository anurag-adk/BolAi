import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";

export async function GET() {
  console.log(
    "GOOGLE_GENERATIVE_AI_API_KEY:",
    process.env.GOOGLE_GENERATIVE_AI_API_KEY
  );
  return Response.json({
    success: true,
    message: "THANK YOU!",
    statusCode: 200,
  });
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid, imagePath } =
    await request.json();
  try {
    const { text: questions } = await generateText({
      model: google("gemini-1.5-pro"),
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
        : "https://placehold.co/150x150/28a745/ffffff?text=BolAi&font=roboto&size=28",
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
