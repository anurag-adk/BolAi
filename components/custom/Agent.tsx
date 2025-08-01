import React from "react";
import { MdCallEnd, MdCall } from "react-icons/md";
import { ImSpinner8 } from "react-icons/im";
import { FiMessageCircle } from "react-icons/fi";

interface AiInterviewProps {
  userName: string;
  type: string;
}

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const Agent = ({ userName, type }: AiInterviewProps) => {
  const isSpeaking = true;
  const isUserSpeaking = false;
  const callStatus = CallStatus.INACTIVE;
  const messages = [
    "Welcome to your frontend interview session. Can you please introduce yourself?",
    "Hello, I am Suman. I am a frontend developer with experience in React and Tailwind CSS.",
    "Great to meet you, Suman. Can you explain the virtual DOM in React and why it is useful?",
    "The virtual DOM is a lightweight copy of the real DOM. React uses it to efficiently update and render UI by comparing it with the previous virtual DOM and only updating the changed parts in the real DOM, improving performance.",
  ];
  const lastMessage = messages[messages.length - 1];

  return (
    <div className="w-full flex flex-col justify-start items-center">
      {/* Title Of The Component */}
      <div className="w-[95%] lg:w-[80%] flex justify-center lg:justify-start mb-[2rem] md:md-[2rem] lg:mb-[1rem] text-3xl md:text-4xl lg:text-3xl font-bold text-white mt-[2rem] ">
        {type === "generate" ? "Interview Generation" : ""}
      </div>
      {/* The Interview Cards */}
      <div className="w-full md:w-[98%] lg:w-[95%] flex flex-row justify-around items-center mt-[1rem] mb-[2rem] lg:px-10">
        {/* Ai Interviewer Card */}
        <div
          className={`w-[95%] lg:w-[40%] md:w-[48%] h-[55vh] md:h-[38vh] lg:h-[48vh] bg-gray-900/80 flex flex-col justify-center items-center rounded-md ${
            isSpeaking
              ? "border-2 border-green-500/80"
              : "border-1 border-gray-400/60"
          }`}
        >
          {/* Motif And Pulse */}
          <div className="relative flex justify-center items-center w-[25%] aspect-square mb-4">
            {isSpeaking && (
              <span className="absolute inline-flex h-full w-full rounded-[50%] sm:rounded-full border-6 border-green-400/80 opacity-75 animate-ping transition-all ease-in-out duration-150"></span>
            )}
            <div
              className={`relative w-full h-full aspect-square rounded-[50%] bg-transparent ${
                isSpeaking ? "opacity-95 animate-pulse" : ""
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
              isSpeaking ? "bg-green-600/80" : "bg-gray-400/60"
            }`}
          >
            <div className="text-md lg:text-sm md:text-2xl font-semibold text-white animate-pulse">
              {isSpeaking ? "Speaking..." : "Listening..."}
            </div>
          </div>
        </div>
        {/* User Interview Card */}
        <div
          className={`max-sm:hidden lg:w-[40%] md:w-[48%] md:h-[38vh] lg:h-[48vh] bg-gray-900/80 flex flex-col justify-center items-center rounded-md ${
            isUserSpeaking
              ? "border-2 border-blue-500/80"
              : "border-1  border-gray-400/60"
          }`}
        >
          <div className="relative flex justify-center items-center w-[22%] aspect-square mb-6">
            {isUserSpeaking && (
              <span className="absolute inline-flex h-full w-full rounded-[50%] sm:rounded-full border-6 border-blue-400/80 opacity-75 animate-ping transition-all ease-in-out duration-150"></span>
            )}
            <div
              className={`relative w-full h-full aspect-square rounded-[50%] bg-transparent ${
                isUserSpeaking ? "opacity-95 animate-pulse" : ""
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
              isUserSpeaking ? "bg-blue-500/80" : "bg-gray-400/60"
            }`}
          >
            <div className="text-md lg:text-sm md:text-2xl font-semibold text-white animate-pulse">
              {isUserSpeaking ? "Speaking..." : "Listening..."}
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
            key={lastMessage}
          >
            {lastMessage}
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
        >
          {callStatus === "FINISHED" || callStatus === "INACTIVE" ? (
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
        <div className="fixed bottom-4 right-6 w-[20%] md:w-[16%] h-[10.25vh] lg:w-[5%] lg:h-[9vh] rounded-md bg-rose-600/90 flex justify-center items-center transition-all ease-in-out duration-150 hover:cursor-pointer hover:scale-105 hover:bg-rose-600/80 border-1 border-gray-300/80 mb-[2rem]">
          <MdCallEnd className="text-3xl lg:text-3xl md:text-5xl text-white font-semibold mr-0.5" />
        </div>
      )}
    </div>
  );
};

export default Agent;
