import FeedbackCard from "@/components/custom/feedbackCard";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { fetchFeedbacksForUser } from "@/lib/actions/general.action";
import Link from "next/link";
import React from "react";
import { FaChartLine } from "react-icons/fa";

const feedbackPage = async () => {
  //Get Current User:
  const user = await getCurrentUser();
  const feedbackData = await fetchFeedbacksForUser(user?.id || "");

  console.log(feedbackData);

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center overflow-y-auto mt-4 px-5">
      {/* Banner And CTA */}
      <BackgroundLines className="w-[95%] md:w-[98%] lg:w-[90%] h-[45vh] md:h-[38vh] lg:h-[40vh] mt-4">
        <div className="w-full h-full bg-transparent rounded-md flex flex-col justify-start items-start md:flex-row md:justify-between md:items-center lg:flex-row lg:justify-between lg:items-center mb-4">
          {/* Banner Actions */}
          <div className="w-full lg:w-[55%] md:w-[58%] flex flex-col justify-center items-start lg:items-start md:items-start p-6 mt-2">
            {/* Title */}
            <div className="text-2xl md:text-3xl lg:text-3xl text-white font-semibold mb-4">
              Track Your Growth with My Feedbacks
            </div>

            {/* SubText */}
            <div className="text-md md:text-xl lg:text-md text-white mb-6">
              Review and reflect on feedback from your practice interviews.
            </div>

            {/* CTA Button */}
            <Button
              asChild
              className="w-[75%] md:w-[85%] md:p-2 lg:w-[30%] h-[8.5vh] md:h-[6.8vh] lg:h-[7vh] rounded-md hover:cursor-pointer transition-all ease-in-out duration-150 hover:scale-105 bg-green-700 hover:bg-green-400/70 mb-1"
            >
              <Link
                href="/interview"
                className="flex justify-center items-center"
              >
                <div className="text-lg md:text-xl lg:text-sm text-white">
                  Generate Interview
                </div>
              </Link>
            </Button>
          </div>

          {/* Banner Image */}
          <div
            className="max-sm:hidden md:w-[40%] md:h-[32vh] lg:w-[34%] lg:h-[34vh]"
            style={{
              backgroundImage: `url(/myFeedbacks.svg)`,
              backgroundPosition: "center center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
      </BackgroundLines>

      {/* Rendering The Cards */}
      <div className="w-[95%] md:w-[98%] lg:w-[90%] grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-4 p-2 mt-8 bg-transparent">
        {feedbackData.data && feedbackData.data.length > 0 ? (
          feedbackData.data.map((item) => (
            <FeedbackCard
              key={item.id}
              logo={item.interview?.imagePath ?? ""}
              title={item.interview?.role ?? ""}
              level={item.interview?.level ?? ""}
              type={item.interview?.type ?? ""}
              totalScore={String(
                (item as Record<string, unknown>)["totalScore"] ?? ""
              )}
              finalAssessment={String(
                (item as Record<string, unknown>)["finalAssessment"] ?? ""
              )}
              interviewId={item.interviewId ?? ""}
              feedbackId={item.id ?? ""}
            />
          ))
        ) : (
          <div className="col-span-full w-full max-w-2xl mx-auto mt-8">
            <div className="group relative px-8 py-12 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/40 backdrop-blur-md transition-all duration-500 hover:shadow-green-500/20 hover:shadow-2xl">
              {/* Border Glow on Hover */}
              <div className="absolute inset-0 rounded-xl border border-green-500/0 group-hover:border-green-500/20 transition-all duration-500 pointer-events-none"></div>

              {/* Icon with glow */}
              <div className="relative mb-6 flex justify-center z-10">
                <div className="relative">
                  {/* Outer glow */}
                  <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-20 blur-xl animate-pulse"></div>

                  {/* Icon circle */}
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 flex justify-center items-center shadow-xl border border-green-400/30 group-hover:border-green-300/50 transition-all duration-300">
                    <FaChartLine className="text-3xl text-white drop-shadow-lg" />

                    {/* Inner highlight */}
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="relative z-10 text-2xl md:text-3xl font-bold text-white mb-4 text-center group-hover:text-green-300 transition-all duration-300">
                No Feedback Yet
              </h3>

              {/* Description */}
              <p className="relative z-10 text-gray-300 text-lg mb-8 max-w-md mx-auto text-center leading-relaxed group-hover:text-gray-100 transition-all duration-300">
                Start an interview to access your feedback and scores. Track
                your progress and improve your skills!
              </p>

              {/* Button */}
              <div className="relative z-10 flex justify-center">
                <Button
                  asChild
                  className="w-[60%] md:w-[40%] lg:w-[35%] h-[8vh] md:h-[6vh] lg:h-[7vh] rounded-md hover:cursor-pointer transition-all ease-in-out duration-150 hover:scale-105 bg-green-700 hover:bg-green-400/70"
                >
                  <Link
                    href="/interview"
                    className="flex justify-center items-center"
                  >
                    <div className="text-lg md:text-xl lg:text-base text-white font-medium">
                      Start Interview
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default feedbackPage;
