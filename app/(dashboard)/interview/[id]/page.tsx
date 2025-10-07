/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchInterviewsById } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import TechIcon from "@/components/custom/techIcon";
import Agent from "../../../../components/custom/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const InterviewPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const interview = await fetchInterviewsById(id);
  //Check if there is data or not:
  if (!interview) redirect("/");
  //Retrieve the user information:
  const user = await getCurrentUser();
  return (
    <>
      <div className="w-full min-h-screen flex flex-col justify-start items-center relative">
        {/* Banner */}
        <div className="w-full flex flex-col justify-start items-center lg:flex-row lg:justify-between lg:items-center p-4 gap-y-2 lg:gap-y-0 py-8 px-6 lg:px-12 backdrop-blur-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 shadow-md shadow-green-500/80 mb-4">
          {/* Companies Logo */}
          <div className="w-[24%] h-[10.5vh] md:w-[25%] md:h-[10.5vh] lg:w-[8%] lg:h-[12vh] rounded-lg border-1 border-slate-500/80 bg-slate-700/80 flex justify-center items-center backdrop-blur-md">
            <div
              className="w-[58%] h-[68%] md:w-[58%] md:h-[66%] lg:w-[62%] lg:h-[62%] bg-transparent aspect-square"
              style={{
                backgroundImage: `url(${interview.imagePath})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          </div>
          {/* Position Title and TechStack Icon */}
          <div className="w-full bg-transparent flex flex-col justify-start items-center p-2 gap-y-2 mt-2 lg:mt-0">
            <div className="text-sm md:text-lg lg:text-sm text-slate-400/80 font-semibold">
              INTERVIEW PREPARATION
            </div>
            {/* Position Title */}
            <div
              className="font-bold text-white mb-2 text-center w-full 
             text-[clamp(1.8rem,5vw,3.5rem)] whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {interview.role
                .split(" ")
                .map(
                  (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
                )
                .join(" ")}
            </div>
            {/* TechStack Icon */}
            <div className="flex justify-start items-center">
              {interview.techstack.map((techIcon: any) => (
                <TechIcon
                  techStack={techIcon
                    .toLowerCase()
                    .replace(/\./g, "")
                    .replace(/\s+/g, "")}
                  key={techIcon}
                />
              ))}
            </div>
          </div>
          {/* Tag for the interview */}
          <div
            className={`w-[25%] h-[5vh] md:w-[25%] md:h-[4vh] lg:w-[8%] lg:h-[4.2vh] rounded-md ${
              interview.type === "Technical"
                ? "bg-blue-600/80"
                : interview.type === "Non-Technical"
                ? "bg-purple-600/80"
                : interview.type === "Mixed"
                ? "bg-amber-600/80"
                : "bg-lime-600/80"
            } flex justify-center items-center ml-2`}
          >
            <div className="text-sm md:text-xl lg:text-sm text-white">
              {interview.type}
            </div>
          </div>
        </div>
        {/* Agent Component For Mock Interview */}
        <Agent
          userName={user?.name || ""}
          type="interview"
          userId={user?.id || ""}
          profilePic={user?.profilePic || ""}
          interviewId={interview.id}
          questions={interview.questions}
        />
      </div>
    </>
  );
};

export default InterviewPage;
