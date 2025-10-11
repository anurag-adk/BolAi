/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import dayjs from "dayjs";
import { FaCalendarAlt } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import TechIcon from "./techIcon";

interface InterviewCardProps {
  id: string;
  userId: string;
  role: string;
  type: "Technical" | "Non-Technical" | "Mixed" | "Behavioral";
  techstack: string[];
  level: string;
  imagePath: string;
  createdAt: string;
}

interface Feedback {
  createdAt: Date;
  totalScore: number;
  finalAssessment: string;
}

const InterviewCard = ({
  id,
  userId,
  role,
  type,
  techstack,
  level,
  imagePath,
  createdAt,
}: InterviewCardProps) => {
  //Variables:
  const feedback = null as Feedback | null;
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="group w-[98%] h-[48vh] md:w-[88%] md:h-[42vh] lg:w-[32%] lg:h-[50vh] p-[1.5px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 transition-all duration-300 rounded-2xl mb-6 md:mb-10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)]">
      <div className="w-full h-full bg-gray-900/95 hover:bg-gray-900 flex flex-col justify-start items-start transition-all ease-out duration-200 hover:cursor-pointer hover:-translate-y-[0.75px] p-0 rounded-2xl">
        {/* Logo and Tag */}
        <div className="w-[95%] flex justify-around items-center mt-6 mb-2">
          {/* Logo */}
          <div
            className="w-[24.8%] h-[11.4vh] md:w-[34.2%] md:h-[11.8vh] lg:w-[24.8%] lg:h-[11.4vh] rounded-xl bg-transparent aspect-square ring-1 ring-white/10 overflow-hidden"
            style={{
              backgroundImage: `url(${imagePath})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          {/* Tag */}
          <div
            className={`w-[35%] h-[3.8vh] rounded-md border border-white/10 ${
              type === "Technical"
                ? "bg-blue-600/80"
                : type === "Non-Technical"
                ? "bg-purple-600/80"
                : type === "Mixed"
                ? "bg-amber-600/80"
                : "bg-lime-600/80"
            } flex justify-center items-center`}
          >
            <div className="text-sm md:text-base lg:text-sm text-white/95 tracking-wide">
              {type}
            </div>
          </div>
        </div>
        {/* Role for the interview     */}
        <div className="text-lg md:text-2xl lg:text-lg text-white font-semibold capitalize mt-4 text-start ml-4">
          {role} Interview
        </div>
        {/* Date and Review */}
        <div className="w-[95%] flex justify-start items-center p-2 mt-2 ml-2 text-slate-200">
          {/* Date */}
          <div className="flex justify-center items-center mr-4">
            {/* Icon */}
            <FaCalendarAlt className="text-lg md:text-2xl lg:text-lg mr-2" />
            {/* Data */}
            <div className="text-sm md:text-lg lg:text-sm">{formattedDate}</div>
          </div>
          {/* Review */}
          <div className="flex justify-center items-center mr-4">
            {/* Icon */}
            <FaStar className="text-lg md:text-2xl lg:text-lg font-semibold text-amber-300 mr-2" />
            {/* Data */}
            <div className="text-sm md:text-lg lg:text-sm">
              {" "}
              {feedback?.totalScore || "--- / 100"}
            </div>
          </div>
        </div>
        {/* Description */}
        <div className="mt-2 mb-4 line-clamp-2 text-sm md:text-base lg:text-sm text-slate-300 text-justify px-4">
          {feedback?.finalAssessment ||
            "Still waiting to take the interview? 😲 Jump in now and boost your skills like a pro! 🚀🙌"}
        </div>
        {/* Icons and Buttons */}
        <div className="w-full mb-2 lg:mb-2 md:mb-4 flex justify-around items-center">
          {/* Icons */}
          <div className="flex justify-start items-center gap-2">
            {techstack.map((techIcon) => (
              <TechIcon
                techStack={techIcon
                  .toLowerCase()
                  .replace(/\./g, "")
                  .replace(/\s+/g, "")}
                key={techIcon}
              />
            ))}
          </div>
          {/* Buttons */}
          <Link
            className="w-[38%] md:w-[44%] md:p-2 lg:w-[38%] h-[6vh] rounded-lg flex justify-center items-center transition-all ease-in-out duration-200 hover:cursor-pointer bg-gradient-to-r from-emerald-600/90 via-green-700/90 to-teal-800/90 border border-emerald-400/50 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.45)] hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.55)] hover:-translate-y-[1px]"
            href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}
          >
            <div className="text-center text-white font-semibold text-sm md:text-lg lg:text-sm">
              {feedback ? "Check Feedback" : "View Interview"}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
