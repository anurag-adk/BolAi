/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

//CSR:
"use client";

import React, { useEffect, useState } from "react";
import { MdCallEnd, MdCall } from "react-icons/md";
import { ImSpinner8 } from "react-icons/im";
import { FiMessageCircle } from "react-icons/fi";
import { RiMicAiLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";
import { toast } from "sonner";
import { GoDotFill } from "react-icons/go";
import { HiSpeakerWave } from "react-icons/hi2";

//ShadCn Components:
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

//Constant:
import { voices } from "@/constants/voices";
import AudioPlayer from "./audioPlayer";
import { createFeedback } from "@/lib/actions/general.action";

interface AiInterviewProps {
  userName: string;
  type: string;
  userId: string;
  profilePic: string;
  interviewId?: string;
  questions?: any[];
}

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

type voiceId =
  | "Rohan"
  | "Neha"
  | "Spencer"
  | "Elliot"
  | "Kylie"
  | "Lily"
  | "Savannah"
  | "Hana"
  | "Cole"
  | "Harry"
  | "Paige";

const Agent = ({
  userName,
  type,
  userId,
  profilePic,
  interviewId,
  questions,
}: AiInterviewProps) => {
  //useState Hook:
  const router = useRouter();
  const [speakingRole, setSpeakingRole] = useState<"user" | "assistant" | null>(
    null
  );
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [speechTimeoutId, setSpeechTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );

  // Constants
  const SPEECH_TIMEOUT_MS = 3500;
  const [voiceId, setVoiceId] = useState<voiceId>("Rohan");
  const [open, setOpen] = useState(false);

  //useEffect Hook executed in the initial mounting:
  useEffect(() => {
    const onCallStart = () => {
      console.log("Vapi call started successfully");
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      console.log("🔴 Vapi call ended - checking why call ended");
      console.log("Call end timestamp:", new Date().toISOString());
      console.log("Messages collected so far:", messages);
      console.log("Current speaking role:", speakingRole);
      setCallStatus(CallStatus.FINISHED);
      // Clear any pending speech timeout
      if (speechTimeoutId) {
        clearTimeout(speechTimeoutId);
        setSpeechTimeoutId(null);
      }
    };

    const onMessage = (message: any) => {
      console.log("📨 Vapi message received:", message);
      console.log("Message timestamp:", new Date().toISOString());
      console.log("Message type:", message.type);
      console.log("Message role:", message.role);
      console.log("Transcript type:", message.transcriptType);

      // Check for model-output to see what assistant is trying to say
      if (message.type === "model-output") {
        console.log("🤖 Assistant model output:", message.output);

        // Handle both string and array outputs
        const output = Array.isArray(message.output)
          ? message.output.join("")
          : message.output?.toLowerCase() || "";

        // Check if this is the confirmation message
        if (output.includes("confirm") && output.includes("role:")) {
          console.log(
            "✅ CONFIRMATION DETECTED: Assistant is confirming collected data"
          );
        }

        // Check if assistant is calling the tool or making API call
        if (
          output.includes("creating") ||
          output.includes("personalized questions")
        ) {
          console.log(
            "🔧 API CALL PREPARATION: Assistant preparing to call generateInterview API"
          );
        }

        // Check for API call indicators
        if (
          output.includes("post") ||
          output.includes("https://bolai.vercel.app")
        ) {
          console.log("🌐 API CALL DETECTED: Assistant making HTTP request");
        }

        // Check for completion indicators
        if (
          output.includes("generating") ||
          output.includes("questions") ||
          output.includes("interview")
        ) {
          console.log("✅ API COMPLETION: Interview generation in progress");
        }

        // Check for error indicators
        if (
          output.includes("oops") ||
          output.includes("error") ||
          output.includes("wrong")
        ) {
          console.log(
            "❌ API ERROR DETECTED: Something went wrong with the API call"
          );
          console.log(
            "🔍 Debug info - Raw output type:",
            typeof message.output
          );
          console.log(
            "🔍 Debug info - Is array:",
            Array.isArray(message.output)
          );
          console.log("🔍 Debug info - Raw content:", message.output);
        }

        // Check for direct API call indicators
        if (
          output.includes("POST") ||
          output.includes("https://bolai.vercel.app")
        ) {
          console.log(
            "🌐 DIRECT API CALL DETECTED: Assistant making HTTP request"
          );
        }

        // Check for API call completion
        if (
          output.includes("interview session is ready") ||
          output.includes("crush this")
        ) {
          console.log(
            "✅ API CALL COMPLETED: Interview questions generated successfully"
          );
        }

        // Check for model-specific issues
        if (output.includes("I recommend 5 to 1")) {
          console.log(
            "⚠️ MODEL ISSUE DETECTED: Output seems truncated - possible GPT-5 configuration problem"
          );
        }

        // Check for incomplete responses after question count
        if (output.includes("How many questions") && output.length < 50) {
          console.log(
            "⚠️ TRUNCATED RESPONSE: GPT-5 might be cutting off responses"
          );
        }
      }

      // Check for function calls or tool usage
      if (message.type === "function-call" || message.type === "tool-calls") {
        console.log("🔧 Function/Tool call detected:", message);
      }

      // Enhanced tool call detection
      if (message.type === "tool-calls" || message.type === "tool-call") {
        console.log("🛠️ TOOL CALL DETECTED:", message);
        console.log("🛠️ This should be the generateInterview tool call");

        // Check if it's the generateInterview tool
        if (message.toolCalls && Array.isArray(message.toolCalls)) {
          message.toolCalls.forEach((tool: any, index: number) => {
            console.log(
              `🛠️ Tool ${index + 1}:`,
              tool.function?.name || tool.name
            );
            console.log(
              `🛠️ Tool arguments:`,
              tool.function?.arguments || tool.arguments
            );
          });
        }
      }

      // Log conversation state when user provides question count
      if (
        message.type === "transcript" &&
        message.role === "user" &&
        message.transcriptType === "final"
      ) {
        const transcript = message.transcript?.toLowerCase() || "";

        // Enhanced detection patterns for question count
        const numberPatterns = [
          /\b(\d+)\s*questions?\b/i,
          /\b(two|three|four|five|six|seven|eight|nine|ten)\s*questions?\b/i,
          /\b(\d+)\b.*questions?/i,
          /questions?.*(\d+)/i,
          /exactly\s*(\d+)/i,
          /around\s*(\d+)/i,
        ];

        const hasQuestionCount = numberPatterns.some((pattern) =>
          pattern.test(transcript)
        );

        if (hasQuestionCount) {
          console.log("🎯 CRITICAL: User provided question count!");
          console.log("🎯 Transcript:", message.transcript);
          console.log("🎯 Enhanced pattern match detected");
          console.log(
            "🎯 Assistant should now IMMEDIATELY confirm all data and proceed to tool call"
          );
          console.log(
            "🎯 VOICE vs CHAT: This works in chat, checking voice processing..."
          );

          // Additional validation logging
          setTimeout(() => {
            console.log(
              "⏰ 3 seconds passed - checking if assistant responded to question count..."
            );
            console.log("📊 Expected: model-output with confirmation message");
            console.log(
              "📊 If no model-output appears, the issue is in Vapi assistant dashboard configuration"
            );
            console.log(
              "💡 COMPARISON: This same input works perfectly in chat interface"
            );
          }, 3000);

          setTimeout(() => {
            console.log(
              "⏰ 10 seconds passed - assistant definitely failed to respond"
            );
            console.log(
              "🚨 DIAGNOSIS: System prompt in Vapi dashboard is not working properly"
            );
            console.log(
              "🚨 ACTION REQUIRED: Update system prompt in Vapi dashboard immediately"
            );
          }, 10000);
        }
      }

      // Detect user speech from any transcript with role "user"
      if (message.type === "transcript" && message.role === "user") {
        // Clear any existing timeout
        if (speechTimeoutId) {
          clearTimeout(speechTimeoutId);
        }

        setSpeakingRole("user");
        console.log("User is speaking (detected from transcript)");

        // Only set timeout for interim transcripts, not final ones
        if (message.transcriptType === "interim") {
          const timeoutId = setTimeout(() => {
            setSpeakingRole(null);
            console.log("User speech timeout - clearing speaking state");
          }, SPEECH_TIMEOUT_MS);
          setSpeechTimeoutId(timeoutId);
        }
      }

      // Detect assistant speech from assistant messages
      if (message.type === "transcript" && message.role === "assistant") {
        // Clear any existing timeout
        if (speechTimeoutId) {
          clearTimeout(speechTimeoutId);
        }

        setSpeakingRole("assistant");
        console.log("Assistant is speaking (detected from transcript)");

        // Only set timeout for interim transcripts
        if (message.transcriptType === "interim") {
          const timeoutId = setTimeout(() => {
            setSpeakingRole(null);
            console.log("Assistant speech timeout - clearing speaking state");
          }, SPEECH_TIMEOUT_MS);
          setSpeechTimeoutId(timeoutId);
        }
      }

      if (message.type === "transcript" && message.transcriptType === "final") {
        // Clear speaking state when we get final transcript
        setSpeakingRole(null);
        if (speechTimeoutId) {
          clearTimeout(speechTimeoutId);
          setSpeechTimeoutId(null);
        }

        const role =
          message.role === "user" || message.role === "assistant"
            ? message.role
            : "system";
        const content = message.transcript || "";

        const newMessage: SavedMessage = {
          role,
          content,
        };

        console.log(
          "💾 Saving final message and clearing speaking state:",
          newMessage
        );
        setMessages((prev) => [...prev, newMessage]);
      }

      // Check for function call messages that might indicate API calls
      if (
        message.type === "function-call" ||
        message.type === "function-call-result" ||
        message.type === "tool-calls" ||
        message.type === "tool-call-result"
      ) {
        console.log("🔧 Function/Tool call detected:", message);

        // Special handling for generateInterview tool
        if (message.type === "tool-calls" || message.type === "function-call") {
          console.log(
            "🎯 GENERATING INTERVIEW: Tool call initiated successfully!"
          );
        }

        if (
          message.type === "tool-call-result" ||
          message.type === "function-call-result"
        ) {
          console.log(
            "✅ INTERVIEW GENERATED: Tool call completed successfully!"
          );
        }
      }
    };

    const onSpeechStart = () => {
      console.log(
        "Speech started - waiting for transcript to determine speaker"
      );
      // Don't set speaking role here, wait for transcript to determine who's speaking
    };

    const onSpeechEnd = () => {
      console.log("Speech ended - immediately clearing speaking role");
      setSpeakingRole(null);
      // Clear any pending timeouts
      if (speechTimeoutId) {
        clearTimeout(speechTimeoutId);
        setSpeechTimeoutId(null);
      }
    };

    const onError = (error: any) => {
      console.log("🚨 Vapi error event received:", error);
      console.log("Error timestamp:", new Date().toISOString());
      console.log("Error type:", error?.type);
      console.log("Error message:", error?.message);
      console.log("Full error object:", JSON.stringify(error, null, 2));

      if (error?.type === "start-method-error") {
        console.log(
          "Start method error detected - this is usually not critical, ignoring..."
        );
        return;
      }

      if (error?.message?.includes("Meeting has ended")) {
        console.log("Meeting ended error - ignoring as this is expected");
        return;
      }

      // Log potential causes of abrupt call ending
      if (error?.type === "function-call-error") {
        console.error(
          "🚨 Function call error - this might cause call to end abruptly:",
          error
        );
      }

      if (error?.type === "assistant-error") {
        console.error(
          "🚨 Assistant error - check your system prompt and assistant configuration:",
          error
        );
      }

      console.error("Critical Vapi error - resetting call status:", error);
      setCallStatus(CallStatus.INACTIVE);
      setSpeakingRole(null);

      // Clear any pending speech timeout on error
      if (speechTimeoutId) {
        clearTimeout(speechTimeoutId);
        setSpeechTimeoutId(null);
      }
    };

    // Register event listeners
    vapi
      .on("call-start", onCallStart)
      .on("call-end", onCallEnd)
      .on("message", onMessage)
      .on("speech-start", onSpeechStart)
      .on("speech-end", onSpeechEnd)
      .on("error", onError);

    // Cleanup event listeners on unmount
    return () => {
      // Clear timeout if exists
      if (speechTimeoutId) {
        clearTimeout(speechTimeoutId);
      }

      vapi
        .off("call-start", onCallStart)
        .off("call-end", onCallEnd)
        .off("message", onMessage)
        .off("speech-start", onSpeechStart)
        .off("speech-end", onSpeechEnd)
        .off("error", onError);
    };
  }, [userId, userName]);

  //Function to generate the feedback of the interview session:
  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    console.log("Generate feedback here.");

    const { success, feedbackId, message } = await createFeedback({
      interviewId: interviewId!,
      userId: userId,
      transcript: messages,
    });

    //If the feedback is generated successfully push into the feedback page:
    if (success && feedbackId) {
      toast.success("Successfully generated the feedback!");
      router.push(`/interview/${interviewId}/feedback/${feedbackId}`);
    } else {
      toast.error(message || "Error generating feedback");
      router.push("/home");
    }
  };

  //useEffect Hook when anything changes:
  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      //After finishing the interview if the type is generate than go to home.
      if (type === "generate") {
        router.push("/home");
      }
      //After finishing the interview if the type is interview than generate the feedbacks.
      else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, type, userId, router, handleGenerateFeedback]);

  const handleCall = async () => {
    // Prevent multiple simultaneous calls
    if (callStatus === CallStatus.CONNECTING) {
      return;
    }

    console.log("Starting Vapi call...");
    setCallStatus(CallStatus.CONNECTING);

    try {
      if (type === "generate") {
        console.log("Call parameters:", {
          assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
          userName,
          userId,
          apiKey: process.env.NEXT_PUBLIC_VAPI_API_KEY ? "Present" : "Missing",
        });

        // Validate required parameters
        if (!userName || userName.trim() === "") {
          throw new Error("userName is required but not provided");
        }
        if (!userId || userId.trim() === "") {
          throw new Error("userId is required but not provided");
        }
        if (!process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID) {
          throw new Error("VAPI Assistant ID is not configured");
        }

        await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID, {
          variableValues: {
            username: userName,
            userid: userId,
          },
          voice: {
            voiceId,
            provider: "vapi",
          },
        });
        toast.success("Vapi call initiated successfully");
      } else {
        console.log("Call parameters:", {
          assistantId: process.env.NEXT_PUBLIC_VAPI_CONVERSATION_ASSISTANT_ID,
          userName,
          userId,
          apiKey: process.env.NEXT_PUBLIC_VAPI_API_KEY ? "Present" : "Missing",
        });

        if (!process.env.NEXT_PUBLIC_VAPI_CONVERSATION_ASSISTANT_ID) {
          throw new Error("VAPI Conversation Assistant ID is not configured");
        }

        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        await vapi.start(
          process.env.NEXT_PUBLIC_VAPI_CONVERSATION_ASSISTANT_ID,
          {
            variableValues: {
              questions: formattedQuestions,
            },
            voice: {
              voiceId,
              provider: "vapi",
            },
          }
        );
        toast.success("Vapi call initiated successfully");
      }
    } catch (error: any) {
      console.error("Call start error:", error);
      setCallStatus(CallStatus.INACTIVE);

      const errorMessage = error?.message || "Unknown error occurred";
      alert(`Failed to start call: ${errorMessage}`);
      toast.error(`Failed to start call: ${errorMessage}`);
    }
  };

  const handleDisconnect = async () => {
    try {
      setCallStatus(CallStatus.FINISHED);
      await vapi.stop();

      // Clear any pending speech timeout
      if (speechTimeoutId) {
        clearTimeout(speechTimeoutId);
        setSpeechTimeoutId(null);
      }
    } catch (error) {
      console.error("Error disconnecting call:", error);
      // Still set status to finished even if stop fails
      setCallStatus(CallStatus.FINISHED);
    }
  };

  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  //Getting The Initials
  const initials = userName
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  // Memoize latest message to prevent unnecessary re-renders
  const memoizedLatestMessage = React.useMemo(() => {
    return messages[messages.length - 1]?.content;
  }, [messages]);

  return (
    <>
      <div className="w-full flex flex-col justify-start items-center gap-y-6">
        {/* Title Of The Component */}
        <div className="w-[95%] flex justify-center lg:justify-start text-3xl md:text-5xl lg:text-4xl font-bold text-white p-2">
          {type === "generate" ? "Preparing Questions" : ""}
        </div>
        {/* The Interview Cards */}
        <div className="w-full flex flex-col lg:flex-row lg:justify-around justify-center items-center md:items-center gap-6 md:gap-8 lg:gap-6 mb-4">
          {/* Ai Interviewer Card */}
          <div
            className={`w-[90%] lg:w-[44%] md:w-[88%] min-h-[42vh] md:min-h-[32vh] lg:min-h-[40vh] bg-gradient-to-b from-slate-800/70 via-[#1e2433]/80 to-slate-900/40 flex flex-col justify-center items-center rounded-2xl transition-all ease-in-out duration-300 border border-white/10 backdrop-blur-md gap-y-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] ${
              speakingRole === "assistant"
                ? "ring-2 ring-emerald-400/60 shadow-emerald-500/20"
                : "ring-0"
            }`}
          >
            {/* Avatar and the role  */}
            <div className="w-[90%] flex justify-start items-center p-2 gap-x-4">
              {/* Motif And Pulse */}
              <div className="relative flex justify-center items-center w-[45%] md:w-[32%] lg:w-[16%] aspect-square mb-4 bg-green-700/20 rounded-full shadow-inner">
                {speakingRole === "assistant" && (
                  <span className="absolute inline-flex h-full w-full rounded-[50%] sm:rounded-full border-6 border-emerald-400/50 opacity-60 animate-ping transition-all ease-in-out duration-150"></span>
                )}
                <div
                  className={`relative w-[75%] h-[75%] rounded-full ${
                    speakingRole === "assistant"
                      ? "opacity-95 animate-pulse"
                      : ""
                  }`}
                  style={{
                    backgroundImage: `url('/motif.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
              </div>
              {/* Title And Designation */}
              <div className="w-full flex flex-col justify-start items-start p-2 gap-y-2">
                <div className="text-2xl md:text-4xl lg:text-2xl font-semibold text-white">
                  AI Interviewer
                </div>
                <div className="text-md md:text-lg lg:text-sm text-slate-400/80 font-semibold">
                  Technical Evaluator
                </div>
              </div>
            </div>
            {/* Label or Tag */}
            <div
              className={`w-[90%] min-h-[3.25rem] md:min-h-[3rem] lg:min-h-[3.25rem] rounded-full flex items-center justify-start gap-x-3 px-5 py-3 backdrop-blur-md border ${
                speakingRole === "assistant"
                  ? "border-emerald-400/30 bg-emerald-400/10 shadow-[0_0_0_1px_rgba(52,211,153,0.15)_inset,0_6px_30px_-10px_rgba(16,185,129,0.45)]"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {speakingRole === "assistant" ? (
                <>
                  <GoDotFill className="text-2xl font-semibold text-emerald-400 animate-pulse" />
                  <img
                    src="/speaking-indicator.svg"
                    alt="Speaking Indicator"
                    width={50}
                    height={50}
                  />
                  <div className="text-md font-semibold text-white">
                    Speaking...
                  </div>
                </>
              ) : (
                <>
                  <GoDotFill className="text-2xl font-semibold text-indigo-300 animate-pulse" />
                  <HiSpeakerWave className="text-2xl font-semibold text-indigo-300" />
                  <div className="text-md font-medium text-gray-100">
                    Listening...
                  </div>
                </>
              )}
            </div>
            {/* Hero Text */}
            {type === "interview" ? (
              <div className="w-[90%] text-md md:text-lg lg:text-sm font-semibold text-slate-500/80 p-2 text-start">
                Evaluating your responses in real-time.
              </div>
            ) : (
              <div className="w-[90%] text-md md:text-lg lg:text-sm font-semibold text-slate-500/80 p-2 text-start">
                Crafting personalized questions.
              </div>
            )}
          </div>
          {/* User Interview Card */}
          <div
            className={`max-sm:hidden w-[90%] lg:w-[44%] md:w-[88%] min-h-[42vh] md:min-h-[32vh] lg:min-h-[40vh] bg-gradient-to-b from-slate-800/70 via-[#1e2433]/80 to-slate-900/40 flex flex-col justify-center items-center rounded-2xl transition-all ease-in-out duration-300 border border-white/10 backdrop-blur-md gap-y-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] ${
              speakingRole === "user"
                ? "ring-2 ring-indigo-400/60 shadow-indigo-500/20"
                : "ring-0"
            }`}
          >
            {/* Avatar and the role  */}
            <div className="w-[90%] flex justify-start items-center p-2 gap-x-4">
              {/* Motif And Pulse */}
              <div className="relative flex justify-center items-center w-[45%] md:w-[32%] lg:w-[16%] aspect-square mb-4 bg-blue-700/30 rounded-full">
                {speakingRole === "user" && (
                  <span className="absolute inline-flex h-full w-full rounded-[50%] sm:rounded-full border-6 border-blue-400/80 opacity-75 animate-ping transition-all ease-in-out duration-150"></span>
                )}
                <div
                  className={`relative w-[75%] h-[75%] rounded-full flex items-center justify-center ${
                    speakingRole === "user" ? "opacity-95 animate-pulse" : ""
                  }`}
                  style={{
                    backgroundImage: profilePic ? `url(${profilePic})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {!profilePic && (
                    <span className="text-white font-bold text-lg md:text-xl lg:text-sm">
                      {initials}
                    </span>
                  )}
                </div>
              </div>
              {/* Title And Designation */}
              <div className="w-full flex flex-col justify-start items-start p-2 gap-y-2">
                <div className="text-2xl md:text-3xl lg:text-xl font-semibold text-white">
                  {userName}
                </div>
                <div className="text-md md:text-lg lg:text-sm text-slate-400/80 font-semibold">
                  BolAi User
                </div>
              </div>
            </div>
            {/* Label or Tag */}
            <div
              className={`w-[90%] min-h-[3.25rem] md:min-h-[3rem] lg:min-h-[3.25rem] rounded-full flex items-center justify-start gap-x-3 px-5 py-3 backdrop-blur-md border ${
                speakingRole === "user"
                  ? "border-indigo-400/30 bg-indigo-400/10 shadow-[0_0_0_1px_rgba(99,102,241,0.15)_inset,0_6px_30px_-10px_rgba(99,102,241,0.45)]"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {speakingRole === "user" ? (
                <>
                  <GoDotFill className="text-2xl font-semibold text-indigo-400 animate-pulse" />
                  <img
                    src="/speaking-indicator.svg"
                    alt="Speaking Indicator"
                    width={50}
                    height={50}
                  />
                  <div className="text-md font-semibold text-white">
                    Speaking...
                  </div>
                </>
              ) : (
                <>
                  <GoDotFill className="text-2xl font-semibold text-indigo-300 animate-pulse" />
                  <HiSpeakerWave className="text-2xl font-semibold text-indigo-300" />
                  <div className="text-md font-medium text-gray-100">
                    Listening...
                  </div>
                </>
              )}
            </div>
            {/* Hero Text */}
            {type === "interview" ? (
              <div className="w-[90%] text-md md:text-lg lg:text-sm font-semibold text-slate-500/80 p-2 text-start">
                Express the ideas confidently to sharpen interview skills.
              </div>
            ) : (
              <div className="w-[90%] text-md md:text-lg lg:text-sm font-semibold text-slate-500/80 p-2 text-start">
                Share the goals to help design perfect interview.
              </div>
            )}
          </div>
        </div>
        {/* Displaying The Transcribed Message From Vapi */}
        {messages.length > 0 && (
          <div className="w-[95%] lg:w-[75%] rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] flex flex-col justify-start items-start lg:flex-row lg:justify-start lg:items-center p-5">
            {/* Bubble For The Convo */}
            <div className="w-[30%] md:w-[14.5%] lg:w-[7.5%] md:h-[8vh] h-[12vh] bg-indigo-600/40 border border-indigo-400/50 aspect-square rounded-xl flex justify-center items-center mr-6 mb-1 lg:mb-0 shadow-inner">
              <FiMessageCircle className="text-4xl lg:text-4xl md:text-5xl font-semibold text-white" />
            </div>
            {/* To Display The Messages */}
            <div
              style={{
                animation: "fadeIn 0.5s ease-in-out forwards",
              }}
              className="text-lg md:text-2xl lg:text-xl text-white text-justify p-3 opacity-90 md:mb-2 lg:mb-0 leading-relaxed"
              key={memoizedLatestMessage}
            >
              {memoizedLatestMessage}
            </div>
            <style>
              {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}
            </style>
          </div>
        )}
        {/* The Action Controls - Black Glassmorphism Pill with Floating Buttons */}
        <div className="fixed bottom-6 w-full flex justify-center px-3">
          <div className="flex items-center gap-4 rounded-full border border-white/10 bg-black/20 backdrop-blur-xl px-4 py-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
            {/* Voice Select (Opens Dialog) */}
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <button
                  aria-label="Select Voice"
                  className="group relative size-14 md:size-14 lg:size-12 rounded-full grid place-items-center border border-white/15 bg-gradient-to-b from-slate-900/70 to-slate-800/60 hover:from-slate-800/80 hover:to-slate-700/70 transition-all duration-200 hover:scale-105 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 hover:cursor-pointer"
                >
                  <div className="absolute -inset-0.5 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition duration-200 bg-emerald-500/20" />
                  <RiMicAiLine className="relative text-3xl md:text-4xl lg:text-2xl text-white/90" />
                  {/* Tooltip (bottom) */}
                  <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+10px)] whitespace-nowrap rounded-md bg-green-400/30 border border-white/10 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 translate-y-1 transition-all duration-150">
                    Select Voice
                  </span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/40 rounded-2xl">
                <AlertDialogHeader className="px-4 pt-4">
                  <AlertDialogTitle>Choose a Voice</AlertDialogTitle>
                  <AlertDialogDescription>
                    Personalize the interview by picking the voice you’d like to
                    hear.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <ScrollArea className="h-[55vh] px-4">
                  <div className="space-y-2 pb-4 gap-y-4 flex flex-col justify-start items-start w-full">
                    {voices.map((voice) => (
                      <div
                        key={voice.name}
                        className={`p-3 mt-2 rounded-md w-full flex flex-col justify-start items-start gap-y-4 transition-all duration-150 hover:cursor-pointer ${
                          voiceId === voice.name
                            ? "bg-emerald-600/30 border border-emerald-400/40"
                            : "bg-transparent hover:bg-gray-800/80"
                        }`}
                        onClick={() => {
                          setVoiceId(voice.name as voiceId);
                          setOpen(false);
                        }}
                      >
                        <div className="w-full flex justify-start items-center gap-x-4 flex-wrap gap-y-2">
                          <div
                            className="w-[28%] h-16 lg:w-2/15 lg:h-12 bg-transparent"
                            style={{
                              backgroundImage: `url('/bolaiVoiceImage_active.svg')`,
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                            }}
                          ></div>
                          <div className="text-white text-md text-bold">
                            {voice.name}
                          </div>
                          <AudioPlayer src={voice.audio} />
                        </div>
                        <div className="w-full flex justify-start items-center gap-x-5 flex-wrap gap-y-1.5">
                          {voice.default ? (
                            <div className="text-sm text-white font-semibold w-18 p-1 rounded-sm flex justify-center items-center bg-gradient-to-r from-green-500/80 via-emerald-500/80 to-teal-500/80">
                              Default
                            </div>
                          ) : (
                            <></>
                          )}
                          {voiceId === voice.name && (
                            <div className="text-sm text-white font-medium w-18 p-1 rounded-sm flex justify-center items-center bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-teal-500/20">
                              Selected
                            </div>
                          )}
                          <div
                            className={`text-sm text-white p-1 w-16 rounded-sm flex justify-center items-center ${
                              voice.gender === "Female"
                                ? "font-medium bg-pink-400/20 text-pink-300 border border-pink-400/30"
                                : "font-medium bg-blue-400/20 text-blue-300 border border-blue-400/30"
                            }`}
                          >
                            {voice.gender}
                          </div>
                          <div className="text-sm p-1 rounded-sm flex justify-center items-center font-medium bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                            {voice.accent}
                          </div>
                        </div>
                        <div className="w-full flex justify-start items-center  flex-wrap gap-y-2 gap-x-5">
                          {voice.characteristics.map((character) => (
                            <div
                              className="text-sm text-semibold p-1 rounded-sm flex justify-center items-center font-medium bg-orange-400/20 text-orange-300 border border-orange-400/30"
                              key={character}
                            >
                              {character}
                            </div>
                          ))}
                        </div>
                        <div className="w-full flex justify-start items-center">
                          <div className="text-gray-300/80 text-sm text-semibold">
                            {voice.age}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <AlertDialogFooter className="w-full flex jusfity-center items-center">
                  <AlertDialogCancel className="hover:cursor-pointer text-lg w-[98%] h-12 border-2 rounded-xl">
                    Cancel
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {/* Call / End controls */}
            {callStatus === CallStatus.CONNECTING ? (
              <button
                onClick={handleCall}
                aria-label="Connecting"
                className="group relative size-14 md:size-14 lg:size-12 rounded-full grid place-items-center border border-white/15 transition-all duration-200 hover:scale-105 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 hover:cursor-pointer bg-gradient-to-b from-blue-700/80 to-indigo-800/80"
              >
                <div className="absolute -inset-0.5 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition bg-blue-500/25" />
                <ImSpinner8 className="relative text-2xl md:text-3xl text-white/90 animate-spin" />
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+10px)] whitespace-nowrap rounded-md bg-green-400/30 border border-white/10 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 translate-y-1 transition-all duration-150">
                  Connecting
                </span>
              </button>
            ) : isCallInactiveOrFinished ? (
              <button
                onClick={handleCall}
                aria-label="Initiate Call"
                className="group relative size-14 md:size-14 lg:size-12 rounded-full grid place-items-center border border-white/15 transition-all duration-200 hover:scale-105 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 hover:cursor-pointer bg-gradient-to-b from-emerald-700/80 to-teal-800/80"
              >
                <div className="absolute -inset-0.5 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition bg-emerald-500/25" />
                <MdCall className="relative text-3xl md:text-4xl lg:text-2xl text-white/90" />
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+10px)] whitespace-nowrap rounded-md bg-green-400/30 border border-white/10 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 translate-y-1 transition-all duration-150">
                  Initiate Call
                </span>
              </button>
            ) : (
              <button
                onClick={handleDisconnect}
                aria-label="End Call"
                className="group relative size-14 md:size-14 lg:size-12 rounded-full grid place-items-center border border-white/15 bg-gradient-to-b from-rose-700/85 to-pink-800/80 hover:scale-105 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40"
              >
                <div className="absolute -inset-0.5 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition bg-rose-500/30" />
                <MdCallEnd className="relative text-3xl md:text-4xl lg:text-2xl text-white/90" />
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[calc(100%+10px)] whitespace-nowrap rounded-md bg-black/80 border border-white/10 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 translate-y-1 transition-all duration-150">
                  End Call
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Agent;
