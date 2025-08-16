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
    <div className="w-[95%] h-[48vh] md:w-[88%] md:h-[42vh] lg:w-[32%] lg:h-[48vh] bg-gray-900/60 hover:bg-neutral-900 rounded-md mb-6 md:mb-10 flex flex-col justify-start items-start transition-all ease-in-out duration-100 hover:cursor-pointer hover:scale-105 border-2 border-gray-800/60 hover:border-2 hover:border-gray-400 p-0 md:p-x-2 lg:p-0">
      {/* Logo and Tag */}
      <div className="w-[95%] flex justify-around items-center mt-6 mb-2">
        {/* Logo */}
        <div
          className="w-[24.8%] h-[11.4vh] md:w-[34.2%] md:h-[11.8vh] lg:w-[24.8%] lg:h-[11.4vh] rounded-md bg-transparent aspect-square"
          style={{
            backgroundImage: `url(${imagePath})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        {/* Tag */}
        <div
          className={`w-[35%] h-[3.8vh] rounded-sm ${
            type === "Technical"
              ? "bg-blue-600/80"
              : type === "Non-Technical"
              ? "bg-purple-600/80"
              : type === "Mixed"
              ? "bg-amber-600/80"
              : "bg-lime-600/80"
          } flex justify-center items-center`}
        >
          <div className="text-sm md:text-xl lg:text-sm text-white">{type}</div>
        </div>
      </div>
      {/* Role for the interview     */}
      <div className="text-lg md:text-2xl lg:text-lg text-white font-semibold capitalize mt-4 text-start ml-4">
        {role} Interview
      </div>
      {/* Date and Review */}
      <div className="w-[95%] flex justify-start items-center p-2 mt-2 ml-2">
        {/* Date */}
        <div className="flex justify-center items-center mr-4">
          {/* Icon */}
          <FaCalendarAlt className="text-lg md:text-2xl lg:text-lg font-semibold text-white mr-2" />
          {/* Data */}
          <div className="text-sm md:text-lg lg:text-sm text-white">
            {formattedDate}
          </div>
        </div>
        {/* Review */}
        <div className="flex justify-center items-center mr-4">
          {/* Icon */}
          <FaStar className="text-lg md:text-2xl lg:text-lg font-semibold text-amber-300 mr-2" />
          {/* Data */}
          <div className="text-sm md:text-lg lg:text-sm text-white">
            {" "}
            {feedback?.totalScore || "--- / 100"}
          </div>
        </div>
      </div>
      {/* Description */}
      <div className="mt-2 mb-2 line-clamp-2 text-sm md:text-lg lg:text-sm text-white text-justify p-4">
        {feedback?.finalAssessment ||
          "Still waiting to take the interview? 😲 Jump in now and boost your skills like a pro! 🚀🙌"}
      </div>
      {/* Icons and Buttons */}
      <div className="w-full mb-2 lg:mb-2 md:mb-4 flex justify-around items-center">
        {/* Icons */}
        <div className="flex justify-start items-center">
          {techstack.map((techIcon) => (
            <TechIcon techStack={techIcon} key={techIcon} />
          ))}
        </div>
        {/* Buttons */}
        <Link
          className="w-[38%] md:w-[44%] md:p-2 lg:w-[38%] h-[6vh] bg-green-600/80 rounded-md flex justify-center items-center transition-all ease-in-out duration-150 hover:scale-105 hover:cursor-pointer hover:bg-green-400/70"
          href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}
        >
          <div className="text-center text-white font-semibold text-sm md:text-xl lg:text-sm">
            {feedback ? "Check Feedback" : "View Interview"}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default InterviewCard;
