/* eslint-disable react/no-unescaped-entities */
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  fetchFeedbackById,
  fetchInterviewsById,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import React from "react";
//Icons:
import { FaStar } from "react-icons/fa";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { FaLightbulb } from "react-icons/fa";
import { FaFire } from "react-icons/fa";
//Components:
import FeedbackProgressCard from "@/components/custom/FeedbackProgressCard";
import Link from "next/link";

const feedbackPage = async ({
  params,
}: {
  params: { id: string; feedbackId: string };
}) => {
  const { id, feedbackId } = await params;
  console.log(id, feedbackId);
  const user = await getCurrentUser();

  //Check if the provided link has valid interview:
  const interview = await fetchInterviewsById(id);
  if (!interview) {
    redirect("/");
  }

  //Fetch The Feedback Info:
  const feedbackInfo = await fetchFeedbackById({
    interviewId: id,
    userId: user?.id || "",
    feedbackId,
  });
  if (!feedbackInfo || "success" in feedbackInfo) {
    redirect("/");
  }

  console.log(feedbackInfo);

  //Determining the trail and path color of the progress bar:
  const getProgressColors = (score: number) => {
    if (score < 50) return { pathColor: "#b91c1c", trailColor: "#fca5a5" }; // red
    if (score < 70) return { pathColor: "#ca8a04", trailColor: "#fde68a" }; // yellow
    if (score < 90) return { pathColor: "#15803d", trailColor: "#86efac" }; // green
    return { pathColor: "#1d4ed8", trailColor: "#93c5fd" }; // blue
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center gap-y-4">
      {/* Back link  */}
      <div className="w-[95%] h-full flex justify-start items-center p-2">
        <Link
          href={"/myFeedbacks"}
          className="mb-4 inline-flex items-center text-sm md:text-base font-medium text-gray-300 hover:text-green-300 transition-colors group mt-8 hover:underline p-4 bg-green-500/30 rounded-md"
        >
          <span className="mr-2 h-6 w-6 rounded-full bg-green-600/30 border border-green-500/40 flex items-center justify-center group-hover:bg-green-600/60 group-hover:scale-95 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-green-300"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </span>
          Back to Feedbacks
        </Link>
      </div>
      {/* Title, Description & Score - Time */}
      <div className="w-[90%] flex flex-col justify-start items-center mt-8 gap-y-2 border-b-1 border-slate-300/80">
        {/* Title */}
        <div className="text-5xl font-bold text-white ">
          Interview Performance Report
        </div>
        {/* Description */}
        <div className="text-lg font-semibold text-slate-400/80">
          A comprehensive evaluation of your interview session.
        </div>
        {/* Score And Time */}
        <div className="flex flex-col justify-start items-start lg:flex-row lg:justify-center lg:items-center gap-x-4 mt-6 mb-4">
          {/* Score */}
          <div className="flex justfiy-start items-center gap-x-2 lg:mb-0 mb-2">
            <FaStar className="text-xl font-bold text-amber-500/80" />
            <div className="text-sm font-semibold text-white">
              Overall Impression:
            </div>
            <div className="text-sm font-semibold text-white">
              {feedbackInfo.totalScore}/100
            </div>
          </div>
          {/* Time */}
          <div className="flex justfiy-start items-center gap-x-2">
            <BsFillCalendarDateFill className="text-xl font-bold text-blue-500/80" />
            <div className="text-sm font-semibold text-white">
              {new Date(feedbackInfo.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </div>
            <div className="text-sm font-semibold text-white">
              {new Date(feedbackInfo.createdAt).toLocaleString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Remaining Content Display */}
      <div className="w-[95.5%] md:w-[95%] lg:w-[85%] flex flex-col justify-start items-start mt-8 mb-4">
        {/* Category Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
          {feedbackInfo.categoryScores.map((category) => {
            const { pathColor, trailColor } = getProgressColors(category.score);
            return (
              <FeedbackProgressCard
                key={category.name}
                score={category.score}
                pathColor={pathColor}
                trailColor={trailColor}
                title={category.name}
                comment={category.comment}
              />
            );
          })}
        </div>
        {/* Areas For Improvement & Strength */}
        <div className="w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mt-6 mb-6">
          {/* Areas For Improvement */}
          {feedbackInfo.areasForImprovement &&
            feedbackInfo.areasForImprovement.length > 0 && (
              <div className="group mt-4 w-full p-[2px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 transition-all duration-300 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.5)] mr-2">
                <div className="w-full h-full bg-gray-900 backdrop-blur-md flex flex-col justify-start items-center transition-all ease-out duration-200 hover:cursor-pointer hover:-translate-y-[1px] rounded-2xl gap-y-3">
                  {/* Title */}
                  <div className="text-xl font-bold text-white mt-8">
                    Areas For Improvement
                  </div>
                  {/* Description */}
                  <div className="w-[85%] text-sm text-slate-400/80 text-justify mt-4">
                    Suggestions to help improve specific skills and perform even
                    better in future interviews.
                  </div>
                  {/* Bullet Points */}
                  <div className="w-[95%] flex flex-col justify-start items-center mt-4 mb-8">
                    {feedbackInfo.areasForImprovement.map((point) => (
                      <div
                        className="w-full flex justify-start items-center mb-2"
                        key={point}
                      >
                        <FaLightbulb className="text-xl font-semibold text-yellow-400 mr-2" />
                        <div className="text-sm text-white text-left">
                          {point}.
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          {/* Strengths   */}
          {feedbackInfo.strengths && feedbackInfo.strengths.length > 0 && (
            <div className="group mt-4 w-full p-[2px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 transition-all duration-300 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.5)] mr-2">
              <div className="w-full h-full bg-gray-900 backdrop-blur-md flex flex-col justify-start items-center transition-all ease-out duration-200 hover:cursor-pointer hover:-translate-y-[1px] rounded-2xl gap-y-3">
                {/* Title */}
                <div className="text-xl font-bold text-white mt-8">
                  Strengths
                </div>
                {/* Description */}
                <div className="w-[85%] text-sm text-slate-400/80 text-justify mt-4">
                  Showcases the individual's standout abilities and strengths
                  that made a positive impression.
                </div>
                {/* Bullet Points */}
                <div className="w-[95%] flex flex-col justify-start items-center mt-4 mb-8">
                  {feedbackInfo.strengths.map((point) => (
                    <div
                      className="w-full flex justify-start items-center mb-2"
                      key={point}
                    >
                      <FaFire className="text-xl font-semibold text-amber-400 mr-2" />
                      <div className="text-sm text-white text-left">
                        {point}.
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Final Assessment */}
        <div className="w-[98.5%] lg:w-[85%] mx-auto flex flex-row justify-center items-center gap-6 mt-6 mb-6">
          {/* Display Card */}
          {feedbackInfo.finalAssessment && (
            <div className="group mt-4 w-full p-[2px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 transition-all duration-300 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.5)] mr-2">
              <div className="w-full h-full bg-gray-900 backdrop-blur-md flex flex-col justify-start items-center transition-all ease-out duration-200 hover:cursor-pointer hover:-translate-y-[1px] rounded-2xl gap-y-3">
                {/* Title */}
                <div className="text-xl font-bold text-white mt-8">
                  Final Assessment
                </div>
                {/* Description */}
                <div className="w-[85%] text-sm text-slate-400/80 text-justify mt-4">
                  Combines all assessment areas to deliver a final judgment on
                  the individual’s skills, potential, and suitability.
                </div>
                {/* Assessment */}
                <div className="w-[90%] text-justify mt-4 mb-8">
                  {feedbackInfo.finalAssessment}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default feedbackPage;
