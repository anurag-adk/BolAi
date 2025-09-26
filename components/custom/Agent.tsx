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

interface AiInterviewProps {
  userName: string;
  type: string;
  userId: string;
  profilePic: string;
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

const Agent = ({ userName, type, userId, profilePic }: AiInterviewProps) => {
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
  const [voiceId, setVoiceId] = useState<voiceId>("Neha");

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
        voice: {
          voiceId,
          provider: "vapi",
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

  //Getting The Initials
  const initials = userName
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <>
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
            className={`max-sm:hidden lg:w-[40%] md:w-[82%] h-[55vh] md:h-[48vh] lg:h-[48vh] transition-all ease-in-out duration-300 bg-transparent flex flex-col justify-center items-center rounded-md border-2 backdrop-blur-md ${
              speakingRole === "user"
                ? "border-blue-500 bg-neutral-900 scale-105 shadow-lg shadow-blue-500/30"
                : "border-white/50"
            }`}
          >
            <div className="relative flex justify-center items-center w-[22%] aspect-square mb-6">
              {speakingRole === "user" && (
                <span className="absolute inline-flex h-full w-full rounded-[50%] sm:rounded-full border-6 border-blue-400/80 opacity-75 animate-ping transition-all ease-in-out duration-150"></span>
              )}
              {profilePic ? (
                <div
                  className={`relative w-full h-full aspect-square rounded-[50%] bg-transparent ${
                    speakingRole === "user" ? "opacity-95 animate-pulse" : ""
                  }`}
                  style={{
                    backgroundImage: `url(${profilePic})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
              ) : (
                <div
                  className={`relative  w-full h-full aspect-square rounded-[50%] bg-gradient-to-br from-blue-400/80 via-cyan-400/80 to-indigo-400/80 shadow-sm shadow-blue-500/80 flex justify-center items-center ${
                    speakingRole === "user" ? "opacity-95 animate-pulse" : ""
                  }`}
                >
                  <div className="text-2xl font-semibold text-white">
                    {initials}
                  </div>
                </div>
              )}
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
        <div className="fixed bottom-6 flex justify-center gap-4 w-full md:w-[65%] lg:w-[78%] px-0 py-0 lg:px-2 lg:py-2">
          {callStatus !== "ACTIVE" ? (
            <>
              {callStatus !== "CONNECTING" ? (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {/* Alert Trigger */}
                      <div className="w-[28.5%] md:w-[28.5%] h-[9.5vh] lg:w-[14.5%] lg:h-[7.5vh] rounded-md flex justify-center items-center text-white text-lg transition-all ease-in-out duration-150 hover:scale-110 aspect-square hover:cursor-pointer mr-6 bg-gradient-to-r from-slate-700/90 via-slate-800/90 to-slate-900/90 hover:from-slate-600/95 hover:via-slate-700/95 hover:to-slate-800/95 border-1 border-emerald-400/60 shadow-md shadow-emerald-400/30 ">
                        <RiMicAiLine className="text-4xl lg:text-3xl md:text-6xl text-white font-semibold mr-0 lg:mr-2" />
                        <div className="lg:text-[1rem] font-semibold text-white max-sm:hidden md:hidden lg:block">
                          Select Voice
                        </div>
                      </div>
                    </AlertDialogTrigger>
                    {/* The body of the alert:  */}
                    <AlertDialogContent className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50">
                      {/* The Header of the alert: */}
                      <AlertDialogHeader className="px-4 pt-4">
                        <AlertDialogTitle>Choose a Voice</AlertDialogTitle>
                        <AlertDialogDescription>
                          Personalize the interview by picking the voice you’d
                          like to hear.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      {/* Making The Content Scrollable */}
                      <ScrollArea className="h-[55vh] px-4">
                        <div className="space-y-2 pb-4 gap-y-4 flex flex-col justify-start items-start w-full">
                          {/* Now adding the options: */}
                          {voices.map((voice) => (
                            // Main Div
                            <div
                              key={voice.name}
                              className="bg-transparent p-3 mt-2 rounded-md w-full flex flex-col justify-start items-start gap-y-4 transition-all duration-150 hover:bg-gray-800/80 hover:cursor-pointer"
                              onClick={() => setVoiceId(voice.name as voiceId)}
                            >
                              {/* Div for Image, Name And Audio */}
                              <div className="w-full flex justify-start items-center gap-x-4 flex-wrap gap-y-2">
                                {/* Div For Image */}
                                <div
                                  className="w-[28%] h-16 lg:w-2/15 lg:h-12 bg-transparent"
                                  style={{
                                    backgroundImage: `url('/bolaiVoiceImage_active.svg')`,
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                  }}
                                ></div>
                                {/* Div For Name */}
                                <div className="text-white text-md text-bold">
                                  {voice.name}
                                </div>
                                {/* For The Audio */}
                                <AudioPlayer src={voice.audio} />
                              </div>
                              {/* Div For Default tag, Gender, Accent */}
                              <div className="w-full flex justify-start items-center gap-x-5 flex-wrap gap-y-1.5">
                                {/* Div For Default */}
                                {voice.default ? (
                                  <div className="text-sm text-white text-semibold w-18 p-1 rounded-sm flex justify-center items-center bg-gradient-to-r from-green-500/80 via-emerald-500/80 to-teal-500/80">
                                    Default
                                  </div>
                                ) : (
                                  <></>
                                )}
                                {/* Div For Gender */}
                                <div
                                  className={`text-sm text-white text-semibold p-1 w-16 rounded-sm flex justify-center items-center ${
                                    voice.gender === "Female"
                                      ? "font-medium bg-pink-400/20 text-pink-300 border border-pink-400/30"
                                      : "font-medium bg-blue-400/20 text-blue-300 border border-blue-400/30"
                                  }`}
                                >
                                  {voice.gender}
                                </div>
                                {/* Div For Accent */}
                                <div className="text-sm text-semibold p-1 rounded-sm flex justify-center items-center font-medium bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                                  {voice.accent}
                                </div>
                              </div>
                              {/* Div For Characteristics */}
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
                              {/* Div For Years*/}
                              <div className="w-full flex justify-start items-center">
                                <div className="text-gray-300/80 text-sm text-semibold">
                                  {voice.age}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      {/* The Footer of the alert: */}
                      <AlertDialogFooter className="w-full flex jusfity-center items-center">
                        <AlertDialogCancel className="hover:cursor-pointer text-lg w-[98%] h-12 border-2">
                          Cancel
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <></>
              )}
              <div
                className={`w-[28.5%] md:w-[26.5%] h-[9.5vh] lg:w-[14.5%] lg:h-[7.5vh] rounded-md flex justify-center items-center text-white text-lg transition-all ease-in-out duration-150 hover:scale-110 aspect-square hover:cursor-pointer ${
                  callStatus === "CONNECTING"
                    ? "animate-pulse bg-gradient-to-r from-blue-600/90 via-blue-700/90 to-indigo-800/90 hover:from-blue-500/95 hover:via-blue-600/95 hover:to-indigo-700/95 border-1 border-blue-500/80 shadow-md shadow-blue-400/80"
                    : "bg-gradient-to-r from-emerald-600/90 via-green-700/90 to-teal-800/90 hover:from-emerald-500/95 hover:via-green-600/95 hover:to-teal-700/95 border-1 border-green-500/80 shadow-md shadow-green-400/80"
                }`}
                onClick={handleCall}
              >
                {isCallInactiveOrFinished ? (
                  <>
                    <MdCall className="text-4xl lg:text-3xl md:text-6xl text-white font-semibold mr-0 lg:mr-2" />
                    <div className="lg:text-[1rem] font-semibold text-white max-sm:hidden md:hidden lg:block">
                      Initiate Call
                    </div>
                  </>
                ) : (
                  <>
                    <ImSpinner8 className="text-4xl lg:text-3xl md:text-5xl text-white font-semibold mr-0 lg:mr-2 animate-spin" />
                    <div className="lg:text-[1rem] font-semibold text-white max-sm:hidden md:hidden lg:block">
                      Making Call
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div
              className="w-[24%] md:w-[16.5%] h-[9.25vh] lg:w-[10.5%] lg:h-[7.5vh] rounded-md flex justify-center items-center text-white text-lg transition-all ease-in-out duration-150 hover:scale-110 aspect-square hover:cursor-pointer mt-[.25rem] mb-[1rem] bg-gradient-to-r from-rose-600/90 via-red-700/90 to-pink-800/90 hover:from-rose-500/95 hover:via-red-600/95 hover:to-pink-700/95 border-1 border-rose-500/80 shadow-md shadow-rose-400/80"
              onClick={handleDisconnect}
            >
              <MdCallEnd className="text-3xl lg:text-3xl md:text-5xl text-white font-semibold mr-2" />
              <div className="lg:text-[1rem] font-semibold text-white max-sm:hidden md:hidden lg:block">
                End Call
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Agent;
