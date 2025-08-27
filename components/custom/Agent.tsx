/* eslint-disable @typescript-eslint/no-explicit-any */
//CSR:
"use client";
import React, { useEffect, useState } from "react";
import { MdCallEnd, MdCall } from "react-icons/md";
import { ImSpinner8 } from "react-icons/im";
import { FiMessageCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";
import Head from "next/head";

interface AiInterviewProps {
  userName: string;
  type: string;
  userId: string;
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

const Agent = ({ userName, type, userId }: AiInterviewProps) => {
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
  const latestMessage = messages[messages.length - 1]?.content;

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
          }, 3500); // Increased to 3.5 seconds for better recognition
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
          }, 3500); // Increased to 3.5 seconds for better recognition
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
  }, [userId, userName]); // eslint-disable-line react-hooks/exhaustive-deps

  //useEffect Hook when anything changes:
  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      router.push("/home");
    }
  }, [messages, callStatus, type, userId, router]);

  const handleCall = async () => {
    console.log("Starting Vapi call...");
    console.log("Call parameters:", {
      assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
      userName,
      userId,
      apiKey: process.env.NEXT_PUBLIC_VAPI_API_KEY ? "Present" : "Missing",
    });

    setCallStatus(CallStatus.CONNECTING);

    try {
      // Pre-call microphone permission check
      try {
        console.log("🎤 Checking microphone permissions...");
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop()); // Stop the test stream
        console.log("✅ Microphone access granted");
      } catch (micError) {
        console.error("❌ Microphone access denied:", micError);
        alert(
          "Please allow microphone access for the interview to work properly."
        );
        setCallStatus(CallStatus.INACTIVE);
        return;
      }

      if (!userName || userName.trim() === "") {
        throw new Error("userName is required but not provided");
      }
      if (!userId || userId.trim() === "") {
        throw new Error("userId is required but not provided");
      }
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
      console.log("Vapi call initiated successfully");
    } catch (error: unknown) {
      const err = error as Error & {
        response?: {
          status: number;
          statusText: string;
          data: unknown;
        };
        code?: string;
      };
      console.error("Vapi call failed:");
      console.error("Error message:", err.message);
      console.error("Error type:", typeof err);
      console.error("Full error object:", err);
      // Check for specific error types
      if (err.response) {
        console.error("HTTP Response Error:");
        console.error("- Status:", err.response.status);
        console.error("- Status Text:", err.response.statusText);
        console.error("- Data:", err.response.data);
      }
      if (err.code) {
        console.error("Error Code:", err.code);
      }
      setCallStatus(CallStatus.INACTIVE);
      alert(`Failed to start call: ${err.message || "Unknown error occurred"}`);
    }
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    await vapi.stop();
  };

  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="w-full flex flex-col justify-start items-center">
        {/* Title Of The Component */}
        <div className="w-[95%] lg:w-[80%] flex justify-center lg:justify-start mb-[2rem] md:mb-[2rem] lg:mb-[3rem] text-3xl md:text-4xl lg:text-3xl font-bold text-white mt-[2rem] ">
          {type === "generate" ? "Interview Generation" : ""}
        </div>
        {/* The Interview Cards */}
        <div className="w-full flex flex-col lg:flex-row lg:justify-around justify-center items-center md:items-center gap-4 mt-[1rem] mb-[2rem]">
          {/* Ai Interviewer Card */}
          <div
            className={`w-[95%] lg:w-[40%] md:w-[82%] h-[55vh] md:h-[48vh] lg:h-[48vh] bg-transparent flex flex-col justify-center items-center rounded-md transition-all ease-in-out duration-300 border-2 mb-0 md:mb-4 lg:mb-0 ${
              speakingRole === "assistant"
                ? "border-green-500 bg-neutral-900 scale-105 shadow-lg shadow-green-500/30"
                : "border-gray-300/50"
            }`}
          >
            {/* Motif And Pulse */}
            <div className="relative flex justify-center items-center w-[25%] aspect-square mb-4">
              {speakingRole === "assistant" && (
                <span className="absolute inline-flex h-full w-full rounded-[50%] sm:rounded-full border-6 border-green-400/80 opacity-75 animate-ping transition-all ease-in-out duration-150"></span>
              )}
              <div
                className={`relative w-full h-full aspect-square rounded-[50%] bg-transparent ${
                  speakingRole === "assistant" ? "opacity-95 animate-pulse" : ""
                }`}
                style={{
                  backgroundImage: `url('/motif.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            </div>
            {/* Title or Designation */}
            <div className="text-3xl lg:text-2xl font-semibold text-white mt-4 mb-2">
              AI Interviewer
            </div>
            {/* Label or Tag */}
            <div
              className={`w-[35%] md:w-[65%] h-[6.5vh] lg:w-[25%] lg:h-[4.5vh] rounded-md flex items-center justify-center ${
                speakingRole === "assistant"
                  ? "bg-green-600/80"
                  : "bg-gray-400/60"
              }`}
            >
              <div className="text-md lg:text-sm md:text-2xl font-semibold text-white animate-pulse">
                {speakingRole === "assistant" ? "Speaking..." : "Listening..."}
              </div>
            </div>
          </div>
          {/* User Interview Card */}
          <div
            className={`max-sm:hidden lg:w-[40%] md:w-[82%] h-[55vh] md:h-[48vh] lg:h-[48vh] transition-all ease-in-out duration-300 bg-transparent flex flex-col justify-center items-center rounded-md border-2 ${
              speakingRole === "user"
                ? "border-blue-500 bg-neutral-900 scale-105 shadow-lg shadow-blue-500/30"
                : "border-white/50"
            }`}
          >
            <div className="relative flex justify-center items-center w-[22%] aspect-square mb-6">
              {speakingRole === "user" && (
                <span className="absolute inline-flex h-full w-full rounded-[50%] sm:rounded-full border-6 border-blue-400/80 opacity-75 animate-ping transition-all ease-in-out duration-150"></span>
              )}
              <div
                className={`relative w-full h-full aspect-square rounded-[50%] bg-transparent ${
                  speakingRole === "user" ? "opacity-95 animate-pulse" : ""
                }`}
                style={{
                  backgroundImage: `url('/profile.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            </div>
            <div className="text-3xl lg:text-2xl font-semibold text-white mt-4 mb-2">
              {userName}
            </div>
            <div
              className={`w-[35%] md:w-[65%] h-[6.5vh] lg:w-[25%] lg:h-[4.5vh] rounded-md flex items-center justify-center ${
                speakingRole === "user" ? "bg-blue-500/80" : "bg-gray-400/60"
              }`}
            >
              <div className="text-md lg:text-sm md:text-2xl font-semibold text-white animate-pulse">
                {speakingRole === "user" ? "Speaking..." : "Listening..."}
              </div>
            </div>
          </div>
        </div>
        {/* Displaying The Transcribed Message From Vapi */}
        {messages.length > 0 && (
          <div className="w-[95%] lg:w-[75%] rounded-md bg-gray-900/80 border-1 border-white/20 backdrop-blur-md mb-[2rem] shadow-lg flex flex-col justify-start items-start lg:flex-row lg:justify-start lg:items-center p-5">
            {/* Bubble For The Convo */}
            <div className="w-[30%] md:w-[14.5%] lg:w-[7.5%] md:h-[8vh] h-[12vh] bg-blue-800 border-1 border-blue-400/80 aspect-square rounded-md flex justify-center items-center mr-6 mb-1 lg:mb-0">
              <FiMessageCircle className="text-4xl lg:text-4xl md:text-5xl font-semibold text-white" />
            </div>
            {/* To Display The Messages */}
            <div
              style={{
                animation: "fadeIn 0.5s ease-in-out forwards",
              }}
              className="text-lg md:text-2xl lg:text-xl text-white text-justify p-3 opacity-90 md:mb-2 lg:mb-0 leading-relaxed"
              key={latestMessage}
            >
              {latestMessage}
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
        {/* The Action Button */}
        {callStatus !== "ACTIVE" ? (
          <div
            className={`fixed bottom-4 right-6 w-[20%] md:w-[16%] h-[10.25vh] lg:w-[5%] lg:h-[9vh] rounded-md flex justify-center items-center text-white text-lg transition-all ease-in-out duration-150 hover:scale-110 aspect-square hover:cursor-pointer mb-[2rem] ${
              callStatus === "CONNECTING"
                ? "animate-pulse bg-blue-800/80 hover:bg-blue-800/90 border-gray-300/80"
                : "bg-green-500/80 hover:bg-green-500/90 border-1 border-gray-300/80"
            }`}
            onClick={handleCall}
          >
            {isCallInactiveOrFinished ? (
              <>
                <MdCall className="text-3xl lg:text-3xl md:text-5xl text-white font-semibold mr-0.5" />
              </>
            ) : (
              <>
                <ImSpinner8 className="text-3xl lg:text-3xl md:text-5xl text-white font-semibold mr-0.5 animate-spin" />
              </>
            )}
          </div>
        ) : (
          <div
            className="fixed bottom-4 right-6 w-[20%] md:w-[16%] h-[10.25vh] lg:w-[5%] lg:h-[9vh] rounded-md bg-rose-600/90 flex justify-center items-center transition-all ease-in-out duration-150 hover:cursor-pointer hover:scale-105 hover:bg-rose-600/80 border-1 border-gray-300/80 mb-[2rem]"
            onClick={handleDisconnect}
          >
            <MdCallEnd className="text-3xl lg:text-3xl md:text-5xl text-white font-semibold mr-0.5" />
          </div>
        )}
      </div>
    </>
  );
};

export default Agent;
