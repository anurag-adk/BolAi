import FeedbackCard from "@/components/custom/feedbackCard";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { fetchFeedbacksForUser } from "@/lib/actions/general.action";
import Link from "next/link";
import React from "react";

const feedbackPage = async () => {
  //Get Current User:
  const user = await getCurrentUser();
  const feedbackData = await fetchFeedbacksForUser(user?.id || "");

  console.log(feedbackData);

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center overflow-y-auto mt-4 px-5">
      {/* Banner And CTA */}
      <BackgroundLines className="w-[95%] md:w-[98%] lg:w-[90%] h-[45vh] md:h-[38vh] lg:h-[40vh] mt-4">
        <div className="w-full h-full bg-transparent rounded-md flex flex-col justify-around items-start md:flex-row md:justify-around md:items-center lg:flex-row lg:justify-around lg:items-center mb-4">
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
            className="max-sm:hidden  md:w-[42%] md:h-[26vh] lg:w-[36%] lg:h-[38vh]"
            style={{
              backgroundImage: `url(/myFeedbacks.png)`,
              backgroundPosition: "center",
              backgroundSize: "cover",
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
          <div className="col-span-full w-full max-w-2xl mx-auto mt-8 p-8 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/70 border border-white/10 shadow-xl text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              No Feedback Yet
            </h3>
            <p className="text-slate-300/80 text-lg mb-6 max-w-md mx-auto">
              Start an interview to access your feedback and scores. Track your
              progress and improve your skills!
            </p>
            <Button
              asChild
              className="w-[60%] md:w-[40%] lg:w-[30%] h-[8vh] md:h-[6vh] lg:h-[7vh] rounded-lg hover:cursor-pointer transition-all ease-in-out duration-150 hover:-translate-y-[1px] bg-emerald-600 hover:bg-emerald-500/80 ring-1 ring-white/10 shadow-lg shadow-emerald-900/40"
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
        )}
      </div>
    </div>
  );
};

export default feedbackPage;
