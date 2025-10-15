import Link from "next/link";
import React from "react";

const FeedbackCard = ({
  logo,
  title,
  level,
  type,
  totalScore,
  finalAssessment,
  interviewId,
  feedbackId,
}: {
  logo: string;
  title: string;
  level: string;
  type: string;
  totalScore: string;
  finalAssessment: string;
  interviewId: string;
  feedbackId: string;
}) => {
  // Helper function to get score styling
  const getScoreStyling = (score: string) => {
    const scoreNum = parseInt(score) || 0;
    if (scoreNum >= 0 && scoreNum <= 40) {
      return {
        bg: "bg-red-500/20",
        text: "text-red-400",
        border: "border-red-500/30",
      };
    } else if (scoreNum >= 41 && scoreNum <= 69) {
      return {
        bg: "bg-amber-500/20",
        text: "text-amber-400",
        border: "border-amber-500/30",
      };
    } else {
      return {
        bg: "bg-green-500/20",
        text: "text-green-400",
        border: "border-green-500/30",
      };
    }
  };

  const scoreStyling = getScoreStyling(totalScore);

  return (
    <div className="group mt-4 w-full h-[58vh] p-[2px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 transition-all duration-300 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.5)] mr-2">
      <div className="w-full h-full bg-gray-900 backdrop-blur-md flex flex-col justify-center items-center transition-all ease-out duration-200 hover:cursor-pointer hover:-translate-y-[1px] rounded-2xl gap-y-3">
        {/* Logo and Score Box */}
        <div className="w-full flex justify-center items-center gap-x-3">
          {/* Logo */}
          <div
            className="w-[28%] lg:w-[26%] h-[12vh] rounded-xl border border-white/10 overflow-hidden"
            style={{
              backgroundImage: `url(${logo})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></div>
          {/* Score Box */}
          <div
            className={`w-[28%] lg:w-[26%] h-[12vh] rounded-lg ${scoreStyling.bg} border ${scoreStyling.border} flex flex-col justify-center items-center gap-y-1`}
          >
            <div className={`font-bold ${scoreStyling.text} text-4xl`}>
              {totalScore}
            </div>
            <div className="text-white text-sm">Score</div>
          </div>
        </div>
        {/* Title */}
        <div className="text-2xl md:text-3xl lg:text-lg font-semibold text-white capitalize">
          {title}
        </div>
        {/* Tags */}
        <div className="flex justify-evenly items-center gap-x-2">
          <span className="px-2.5 py-0.5 text-[12px] md:text-[15px] lg:text-[10px] tracking-wide uppercase bg-blue-500/10 text-blue-400 border border-blue-600/20 rounded-md">
            {type}
          </span>
          <span className="px-2.5 py-0.5 text-[12px] md:text-[15px] lg:text-[10px] tracking-wide uppercase bg-purple-500/10 text-purple-400 border border-purple-600/20 rounded-md">
            {level}
          </span>
        </div>
        {/* Final Assessment */}
        <div className="w-[85%] lg:w-[90%] text-xl md:text-2xl lg:text-sm font-semibold text-slate-300/80 mt-4 text-left">
          Final Assessment
        </div>
        <div className="w-[85%] lg:w-[90%] text-justify line-clamp-3 text-md md:text-md lg:text-sm text-slate-300/80">
          {finalAssessment}
        </div>
        {/* Button */}
        <Link
          className="mt-4 w-[38%] md:w-[44%] md:p-2 lg:w-[42%] h-[6vh] rounded-lg flex justify-center items-center transition-all ease-in-out duration-200 hover:cursor-pointer bg-gradient-to-r from-emerald-600/90 via-green-700/90 to-teal-800/90 border border-emerald-400/50 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.45)] hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.55)] hover:-translate-y-[1px]"
          href={`/interview/${interviewId}/feedback/${feedbackId}`}
        >
          <div className="text-center text-white font-semibold text-sm md:text-lg lg:text-sm">
            Check Feedback
          </div>
        </Link>
      </div>
    </div>
  );
};

export default FeedbackCard;
