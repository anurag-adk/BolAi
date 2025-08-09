/* eslint-disable @typescript-eslint/no-explicit-any */
//CSR:
"use client";
import React, { useEffect, useState } from "react";
import { MdCallEnd, MdCall } from "react-icons/md";
import { ImSpinner8 } from "react-icons/im";
import { FiMessageCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";

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

interface Message {
  type: "transcript" | string;
  transcriptType?: "final" | "interim";
  role?: string;
  transcript?: string;
}

const Agent = ({ userName, type, userId }: AiInterviewProps) => {
  //useState Hook:
  const router = useRouter();
  const [speakingRole, setSpeakingRole] = useState<"user" | "assistant" | null>(
    null
  );
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const latestMessage = messages[messages.length - 1]?.content;

  //useEffect Hook executed in the initial mounting:
  useEffect(() => {
    const onCallStart = () => {
      console.log("Vapi call started successfully");
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      console.log("Vapi call ended");
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      console.log("Vapi message received:", message);
      if (message.type === "transcript" && message.transcriptType === "final") {
        const role =
          message.role === "user" || message.role === "assistant"
            ? message.role
            : "system";
        const content = message.transcript || "";

        const newMessage: SavedMessage = {
          role,
          content,
        };

        console.log("Saving message:", newMessage);
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("Speech started");
      setSpeakingRole("assistant");
    };

    const onSpeechEnd = () => {
      console.log("Speech ended");
      setSpeakingRole(null);
    };

    const onError = (error: any) => {
      console.log("Vapi error event received:", error);

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
      vapi
        .off("call-start", onCallStart)
        .off("call-end", onCallEnd)
        .off("message", onMessage)
        .off("speech-start", onSpeechStart)
        .off("speech-end", onSpeechEnd)
        .off("error", onError);
    };
  }, [userId, userName]);

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
    <div className="w-full flex flex-col justify-start items-center">
      {/* Title Of The Component */}
      <div className="w-[95%] lg:w-[80%] flex justify-center lg:justify-start mb-[2rem] md:mb-[2rem] lg:mb-[1rem] text-3xl md:text-4xl lg:text-3xl font-bold text-white mt-[2rem] ">
        {type === "generate" ? "Interview Generation" : ""}
      </div>
      {/* The Interview Cards */}
      <div className="w-full md:w-[98%] lg:w-[95%] flex flex-row justify-around items-center mt-[1rem] mb-[2rem] lg:px-10">
        {/* Ai Interviewer Card */}
        <div
          className={`w-[95%] lg:w-[40%] md:w-[48%] h-[55vh] md:h-[38vh] lg:h-[48vh] bg-gray-900/80 flex flex-col justify-center items-center rounded-md ${
            speakingRole === "assistant"
              ? "border-green-500/80"
              : "border-gray-400/60"
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
          className={`max-sm:hidden lg:w-[40%] md:w-[48%] md:h-[38vh] lg:h-[48vh] bg-gray-900/80 flex flex-col justify-center items-center rounded-md ${
            speakingRole === "user"
              ? "border-blue-500/80"
              : "border-gray-400/60"
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
            className="text-md md:text-xl lg:text-sm text-white text-justify p-3 opacity-75 md:mb-2 lg:mb-0"
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
  );
};

export default Agent;
