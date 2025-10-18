/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"; // Ensure this is a client component

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FaCalendarAlt, FaStar } from "react-icons/fa";
import Link from "next/link";
import TechIcon from "./techIcon";
import { fetchFeedbackById } from "@/lib/actions/general.action";

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
  id: string;
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
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    const getFeedback = async () => {
      if (!userId || !id) return;
      try {
        const data = await fetchFeedbackById({ interviewId: id, userId });

        // Check if it's an error response
        if ("success" in data && !data.success) {
          setFeedback(null);
          return;
        }

        // Check if data has the properties of Feedback
        if (
          "totalScore" in data &&
          "finalAssessment" in data &&
          "createdAt" in data &&
          "id" in data
        ) {
          setFeedback({
            id: data.id,
            totalScore: data.totalScore,
            finalAssessment: data.finalAssessment,
            createdAt: new Date(data.createdAt),
          });
        } else {
          setFeedback(null);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setFeedback(null);
      }
    };

    getFeedback();
  }, [id, userId]);

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="group w-full h-[48vh] md:h-[42vh] lg:h-[50vh] p-[1.5px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 transition-all duration-300 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] mb-2 md:mb-2 lg:mb-0">
      <div className="w-full h-full bg-gray-900/95 hover:bg-gray-900 flex flex-col justify-start items-start transition-all ease-out duration-200 hover:cursor-pointer hover:-translate-y-[0.75px] p-0 rounded-2xl">
        {/* Logo and Tag */}
        <div className="w-[95%] flex justify-around items-center mt-6 mb-2">
          <div
            className="w-[24.8%] h-[11.4vh] md:w-[34.2%] md:h-[11.8vh] lg:w-[24.8%] lg:h-[11.4vh] rounded-xl bg-transparent aspect-square ring-1 ring-white/10 overflow-hidden"
            style={{
              backgroundImage: `url(${imagePath})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
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

        {/* Role */}
        <div className="text-lg md:text-2xl lg:text-lg text-white font-semibold capitalize mt-4 text-start ml-4">
          {role} Interview
        </div>

        {/* Date & Review */}
        <div className="w-[95%] flex justify-start items-center p-2 mt-2 ml-2 text-slate-200">
          <div className="flex justify-center items-center mr-4">
            <FaCalendarAlt className="text-lg md:text-2xl lg:text-lg mr-2" />
            <div className="text-sm md:text-lg lg:text-sm">{formattedDate}</div>
          </div>
          <div className="flex justify-center items-center mr-4">
            <FaStar className="text-lg md:text-2xl lg:text-lg font-semibold text-amber-300 mr-2" />
            <div className="text-sm md:text-lg lg:text-sm">
              {feedback?.totalScore
                ? `${feedback.totalScore} / 100`
                : "--- / 100"}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-2 mb-4 line-clamp-2 text-sm md:text-base lg:text-sm text-slate-300 text-justify px-4">
          {feedback?.finalAssessment ||
            "Still waiting to take the interview? 😲 Jump in now and boost your skills like a pro! 🚀🙌"}
        </div>

        {/* Techstack & Buttons */}
        <div className="w-full mb-2 lg:mb-2 md:mb-4 flex justify-around items-center">
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
          <Link
            className="w-[38%] md:w-[44%] md:p-2 lg:w-[42%] h-[6vh] rounded-lg flex justify-center items-center transition-all ease-in-out duration-200 hover:cursor-pointer bg-gradient-to-r from-emerald-600/90 via-green-700/90 to-teal-800/90 border border-emerald-400/50 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.45)] hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.55)] hover:-translate-y-[1px]"
            href={
              feedback
                ? `/interview/${id}/feedback/${feedback.id}`
                : `/interview/${id}`
            }
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
