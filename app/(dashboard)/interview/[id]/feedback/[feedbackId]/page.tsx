/* eslint-disable react/no-unescaped-entities */
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  fetchFeedbackById,
  fetchInterviewsById,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import React from "react";
//Icons:
import {
  AiOutlineTrophy,
  AiOutlineCalendar,
  AiOutlineBulb,
  AiOutlineFire,
  AiOutlineCheckCircle,
} from "react-icons/ai";
//Components:
import FeedbackProgressCard from "@/components/custom/FeedbackProgressCard";

const feedbackPage = async ({
  params,
}: {
  params: { id: string; feedbackId: string };
}) => {
  const user = await getCurrentUser();
  const id = params.id;
  const feedbackId = params.feedbackId;

  // Authentication check
  if (!user) {
    redirect("/login");
  }

  //Check if the provided link has valid interview:
  const interview = await fetchInterviewsById(id, user.id, false);
  if (!interview || !interview.success) {
    redirect("/home");
  }

  //Fetch The Feedback Info:
  const feedbackInfo = await fetchFeedbackById({
    interviewId: id,
    userId: user.id, // User is guaranteed to exist here
    feedbackId,
  });

  // Improved error handling
  if (!feedbackInfo || "success" in feedbackInfo) {
    redirect("/myFeedbacks");
  }

  // Type guard to ensure feedbackInfo has required properties
  if (!feedbackInfo.totalScore || !feedbackInfo.categoryScores) {
    redirect("/myFeedbacks");
  }

  //Determining the trail and path color of the progress bar:
  const getProgressColors = () => {
    return {
      pathColor: "#4ade80", // light greenish (green-400)
      trailColor: "#6b7280", // light neutral gray (gray-500)
    };
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center gap-y-4">
      {/* Title, Description & Score - Time */}
      <div className="w-[90%] flex flex-col justify-start items-center mt-8 gap-y-2 border-b-1 border-slate-300/80">
        {/* Interview Name Tag */}
        <div className="px-6 py-2 rounded-full border-2 border-green-500/50 bg-green-500/10 backdrop-blur-sm mb-4">
          <span className="text-green-400 font-semibold text-sm tracking-wider uppercase">
            {interview.success && interview.data && "role" in interview.data
              ? `${interview.data.role}`
              : "MOCK INTERVIEW"}
          </span>
        </div>

        {/* Title */}
        <div className="text-5xl font-bold text-white ">
          Interview Performance Report
        </div>
        {/* Description */}
        <div className="text-lg font-semibold text-slate-400/80">
          A comprehensive evaluation of your interview session.
        </div>
        {/* Score And Time */}
        <div className="flex flex-col justify-start items-start lg:flex-row lg:justify-center lg:items-center gap-x-6 mt-6 mb-4">
          {/* Score */}
          <div className="flex justify-start items-center gap-x-3 lg:mb-0 mb-3">
            <AiOutlineTrophy className="text-2xl md:text-3xl lg:text-2xl text-amber-500" />
            <div className="text-base md:text-lg lg:text-base font-semibold text-white">
              Score:
            </div>
            <div className="text-base md:text-lg lg:text-base font-bold text-white">
              {feedbackInfo.totalScore}/100
            </div>
          </div>

          {/* Separator */}
          <div className="hidden lg:block text-gray-500 text-2xl">|</div>

          {/* Time */}
          <div className="flex justify-start items-center gap-x-3">
            <AiOutlineCalendar className="text-2xl md:text-3xl lg:text-2xl text-blue-500" />
            <div className="text-base md:text-lg lg:text-base font-semibold text-white">
              {new Date(feedbackInfo.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </div>
            <div className="text-base md:text-lg lg:text-base font-semibold text-white">
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
        {/* Section 1: Performance Metrics */}
        <div className="w-full mb-12">
          {/* Section Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              Performance Metrics
            </h2>
            <p className="text-base text-slate-400">
              Detailed breakdown of your interview performance across key
              categories
            </p>
          </div>

          {/* Category Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {feedbackInfo.categoryScores.map((category) => {
              const { pathColor, trailColor } = getProgressColors();
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
        </div>

        {/* Section 2: Areas For Improvement */}
        {feedbackInfo.areasForImprovement &&
          feedbackInfo.areasForImprovement.length > 0 && (
            <div className="w-full mb-12">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <AiOutlineBulb className="text-2xl text-blue-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Areas For Improvement
                  </h2>
                  <p className="text-base text-slate-400 mt-1">
                    Actionable suggestions to enhance your skills
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="pl-6 border-l-2 border-blue-500/30 space-y-4">
                {feedbackInfo.areasForImprovement.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-800/40 rounded-lg border border-gray-700/40 hover:border-blue-500/30 hover:bg-gray-800/60 transition-all duration-200"
                  >
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-200 text-base leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Section 3: Strengths */}
        {feedbackInfo.strengths && feedbackInfo.strengths.length > 0 && (
          <div className="w-full mb-12">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <AiOutlineFire className="text-2xl text-purple-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Strengths</h2>
                <p className="text-base text-slate-400 mt-1">
                  Outstanding qualities that impressed us
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="pl-6 border-l-2 border-purple-500/30 space-y-4">
              {feedbackInfo.strengths.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gray-800/40 rounded-lg border border-gray-700/40 hover:border-purple-500/30 hover:bg-gray-800/60 transition-all duration-200"
                >
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold mt-0.5 flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-200 text-base leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Section 4: Final Assessment */}
        {feedbackInfo.finalAssessment && (
          <div className="w-full mb-8">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <AiOutlineCheckCircle className="text-2xl text-green-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Final Assessment
                </h2>
                <p className="text-base text-slate-400 mt-1">
                  Overall evaluation of your interview performance
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="pl-6 border-l-2 border-green-500/30">
              <div className="p-6 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-lg border border-gray-700/40">
                <p className="text-gray-200 text-base leading-relaxed">
                  {feedbackInfo.finalAssessment}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default feedbackPage;
