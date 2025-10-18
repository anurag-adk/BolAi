/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import InterviewCard from "@/components/custom/interviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { FaChevronDown } from "react-icons/fa";
import { BackgroundLines } from "@/components/ui/background-lines";
import {
  fetchGeneratedInterviews,
  fetchLatestGeneratedInterviews,
} from "@/lib/actions/general.action";

const HomePage = async () => {
  //Get Current User:
  const user = await getCurrentUser();

  // Handle case where user is not authenticated or doesn't have an id
  if (!user || !user.id) {
    console.error("User not authenticated or missing id:", user);
    // You might want to redirect to login page here
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="text-white text-xl">
          Please log in to access this page.
        </div>
      </div>
    );
  }

  //Parallel Data Fetching:
  const [userInterviews, communityInterviews] = await Promise.all([
    //Get The Current Users Interviews:
    fetchGeneratedInterviews({ userId: user.id, limit: 6 }),
    //Get The Latest Interview From The Community:
    fetchLatestGeneratedInterviews({
      userId: user.id,
      limit: 6,
    }),
  ]);
  const hasPastInterviews = userInterviews && userInterviews.length > 0;
  const hasPastCommunityInterviews =
    communityInterviews && communityInterviews.length > 0;
  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center overflow-y-auto mt-4 px-5">
      {/* Banner And CTA */}
      <BackgroundLines className="w-[95%] md:w-[98%] lg:w-[90%] h-[45vh] md:h-[38vh] lg:h-[40vh] mt-4">
        <div className="w-full h-full bg-transparent rounded-md flex flex-col justify-start items-start md:flex-row md:justify-between md:items-center lg:flex-row lg:justify-between lg:items-center mb-4">
          {/* Banner Actions */}
          <div className="w-full lg:w-[55%] md:w-[58%] flex flex-col justify-center items-start lg:items-start md:items-start p-6 mt-2">
            {/* Title */}
            <div className="text-2xl md:text-3xl lg:text-3xl text-white font-semibold mb-4">
              Get Interview Ready with BolAi
            </div>

            {/* SubText */}
            <div className="text-md md:text-xl lg:text-md text-white mb-6">
              Practice on real interview questions & get instant feedback
            </div>

            {/* Button */}
            <Button
              asChild
              className="w-[75%] md:w-[76%] md:p-2 lg:w-[30%] h-[8.5vh] md:h-[6.8vh] lg:h-[7vh] rounded-md hover:cursor-pointer transition-all ease-in-out duration-150 hover:scale-105 bg-green-700 hover:bg-green-400/70 mb-1"
            >
              <Link
                href="/interview"
                className="flex justify-center items-center"
              >
                <div className="text-lg lg:text-sm text-white">
                  Generate Interview
                </div>
              </Link>
            </Button>
          </div>

          {/* Banner Image */}
          <div
            className="max-sm:hidden md:w-[40%] md:h-[32vh] lg:w-[34%] lg:h-[34vh]"
            style={{
              backgroundImage: `url(/homePage.svg)`,
              backgroundPosition: "center center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
      </BackgroundLines>

      {/* Displaying the users Interviews */}
      <div className="w-[95%] md:w-[95%] lg:w-[90%] flex flex-col justify-start items-start mt-8 mb-4">
        <div className="w-full p-2 flex justify-between md:justify-between lg:justify-start items-center mb-4 md:mb-6 lg:mb-4 gap-x-4">
          {/* Title */}
          <div className="text-2xl md:text-3xl lg:text-2xl font-semibold text-white">
            My Interviews
          </div>
          {/* View More CTA Button - Circular Icon */}
          <Link href="/myInterviews">
            <button className="group w-10 h-10 md:w-12 md:h-12 lg:w-10 lg:h-10 rounded-full border-2 border-gray-600 hover:border-gray-400 flex items-center justify-center transition-all duration-200 hover:bg-gray-700/30">
              <FaChevronDown className="text-gray-400 group-hover:text-white text-sm md:text-base lg:text-sm transition-colors duration-200" />
            </button>
          </Link>
        </div>
        {/* Render The Interview Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 justify-items-start">
          {hasPastInterviews ? (
            userInterviews?.map((interview: any) => (
              <InterviewCard key={interview?.id} {...interview} />
            ))
          ) : (
            <p className="text-left text-md md:text-lg lg:text-sm text-white">
              There are no new interviews available. You haven't taken any
              interviews yet.
            </p>
          )}
        </div>
      </div>
      {/* Displaying the available Interviews */}
      <div className="w-[95%] md:w-[95%] lg:w-[90%] flex flex-col justify-start items-start mt-8 mb-4">
        <div className="w-full p-2 flex justify-between md:justify-between lg:justify-start items-center mb-4 md:mb-6 lg:mb-4 gap-x-4">
          {/* Title */}
          <div className="text-2xl md:text-3xl lg:text-2xl font-semibold text-white">
            Interview Hub
          </div>
          {/* View More CTA Button - Circular Icon */}
          <Link href="/interviewHub">
            <button className="group w-10 h-10 md:w-12 md:h-12 lg:w-10 lg:h-10 rounded-full border-2 border-gray-600 hover:border-gray-400 flex items-center justify-center transition-all duration-200 hover:bg-gray-700/30">
              <FaChevronDown className="text-gray-400 group-hover:text-white text-sm md:text-base lg:text-sm transition-colors duration-200" />
            </button>
          </Link>
        </div>
        {/* Render The Interview Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 justify-items-start">
          {hasPastCommunityInterviews ? (
            communityInterviews?.map((interview: any) => (
              <InterviewCard key={interview?.id} {...interview} />
            ))
          ) : (
            <p className="text-left text-md md:text-lg lg:text-sm text-white">
              There are no new interviews available in the community.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
