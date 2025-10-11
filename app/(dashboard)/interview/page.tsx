import Agent from "@/components/custom/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Link from "next/link";
import React from "react";

const InterviewPage = async () => {
  const user = await getCurrentUser();
  const userName = (user as { name?: string })?.name ?? "You";

  return (
    <div className="min-h-screen w-full flex flex-col justify-start items-center overflow-auto">
      {/* Back Button */}
      <Link
        href="/home"
        className="w-[95%] inline-flex justify-start items-center text-sm md:text-base font-medium text-gray-300 hover:text-green-300 transition-colors group hover:underline p-4 bg-transparent mt-2 ml-4 mb-4"
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
        Back to home
      </Link>
      <div className="w-full h-full md:h-full lg:h-[85vh] flex justify-center items-center">
        <Agent
          userName={userName}
          userId={user?.id ?? ""}
          type="generate"
          profilePic={user?.profilePic ?? ""}
        />
      </div>
    </div>
  );
};

export default InterviewPage;
