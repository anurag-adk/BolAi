import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { dummyInterviews, myInterviews } from "@/constants";
import InterviewCard from "@/components/custom/interviewCard";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center overflow-y-auto mt-4 px-5">
      {/* Banner And CTA */}
      <div className="w-[95%] md:w-[95%] lg:w-[90%] h-[45vh] md:h-[38vh] lg:h-[40vh] bg-gray-900/90 rounded-md flex flex-col justify-start items-start md:flex-row md:justify-start md:items-center lg:flex-row lg:justify-start lg:items-center mb-4">
        {/* Banner Actions */}
        <div className="w-full lg:w-[55%] md:w-[50%] flex flex-col justify-center items-start lg:items-start md:items-start p-6 mt-2">
          {/* Title */}
          <div className="text-2xl md:text-3xl lg:text-3xl text-white font-semibold mb-4">
            Get Interview Ready with BolAi !
          </div>
          {/* SubText */}
          <div className="text-md md:text-lg lg:text-md text-white mb-6">
            Practice on real interview questions & get instant feedback
          </div>
          {/* Button */}
          <Button
            asChild
            className="w-[75%] md:w-[64%] lg:w-[30%] h-[8.5vh] md:h-[6.8vh] lg:h-[7vh] rounded-md hover:cursor-pointer transition-all ease-in-out duration-150 hover:scale-105 bg-green-700 hover:bg-green-400/70 mb-1"
          >
            <Link
              href="/interview"
              className="flex justify-center items-center"
            >
              <div className="text-lg lg:text-sm text-white">
                Start an Interview
              </div>
            </Link>
          </Button>
        </div>
        {/* Banner Image */}
        <div
          className="max-sm:hidden md:w-[32%] md:h-[34vh] lg:w-[20%] lg:h-[30vh]"
          style={{
            backgroundImage: `url(/backgroundMotif.png)`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>
      {/* Displaying the users Interviews */}
      <div className="w-[95%] md:w-[95%] lg:w-[90%] flex flex-col justify-start items-start mt-8 mb-4">
        <div className="text-2xl md:text-3xl lg:text-2xl font-semibold text-white mb-4 md:mb-6 lg:mb-4">
          Your Interviews
        </div>
        {/* Render The Interview Cards */}
        <div className="w-full flex flex-col justify-start items-center lg:flex-row lg:justify-between lg:items-start lg:flex-wrap lg:gap-4 mb-4">
          {myInterviews.map((interview) => (
            <InterviewCard key={interview.id} {...interview} />
          ))}
        </div>
        {/* If there is no interviews created */}
        {/* <div className="text-md text-white">
          There are no interviews available yet! ☹️
        </div> */}
      </div>
      {/* Displaying the available Interviews */}
      <div className="w-[95%] md:w-[95%] lg:w-[90%] flex flex-col justify-start items-start mt-8 mb-4">
        <div className="text-2xl md:text-3xl lg:text-2xl font-semibold text-white mb-4 md:mb-6 lg:mb-4">
          Take an Interview
        </div>
        {/* Render The Interview Cards */}
        <div className="w-full flex flex-col justify-start items-center lg:flex-row lg:justify-between lg:items-start lg:flex-wrap lg:gap-4 mb-4 mt-2">
          {dummyInterviews.map((interview) => (
            <InterviewCard key={interview.id} {...interview} />
          ))}
        </div>
        {/* If No Interviews Available */}
        {/* <div className="text-md text-white">
          There are no interviews available yet! ☹️
        </div> */}
      </div>
    </div>
  );
};

export default HomePage;
