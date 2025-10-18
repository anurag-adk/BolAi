import { fetchInterviewsById } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import TechIcon from "@/components/custom/techIcon";
import Agent from "../../../../components/custom/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Link from "next/link";
import { PiBrainDuotone } from "react-icons/pi";
import { RiChatVoiceAiFill } from "react-icons/ri";
import { FaQuestion } from "react-icons/fa";

const InterviewPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  //Retrieve the user information first:
  const user = await getCurrentUser();

  //SECURITY FIX: Check if user is authenticated
  if (!user) {
    redirect("/login");
  }

  //SECURITY FIX: Get full interview data including questions
  const fullInterview = await fetchInterviewsById(id, user.id, true);

  if (!fullInterview?.success || !fullInterview.data) {
    console.error("Failed to fetch full interview data");
    redirect("/");
  }

  const interview = fullInterview.data;
  return (
    <>
      <div className="w-full min-h-screen flex flex-col justify-start items-center relative">
        {/* Back Button */}
        <Link
          href="/home"
          className="w-[95%] inline-flex justify-start items-center text-sm md:text-base font-medium text-gray-300 hover:text-green-300 transition-colors group p-4 bg-transparent mt-2 hover:underline"
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
        {/* Banner */}
        <div className="w-[95%] md:w-[85%] lg:w-[95%] backdrop-blur-xl bg-gradient-to-br from-slate-800/40 via-slate-900/30 to-slate-950/10 shadow-[inset_0_0_15px_rgba(34,197,94,0.3),_0_0_15px_rgba(34,197,94,0.3)] p-3 flex flex-col justify-start items-center lg:flex-row lg:justify-between lg:items-center gap-y-4 gap-x-6 lg:gap-y-0 py-10 px-6 lg:px-12 mb-6 border-1 border-white/30 rounded-2xl">
          {/* Companies Logo */}
          <div className="w-[32%] h-[14vh] md:w-[26.5%] md:h-[10.5vh] lg:w-[9.5%] lg:h-[12vh] rounded-xl border border-slate-500/40 bg-slate-700/60 shadow-inner flex flex-row justify-center items-center backdrop-blur-md">
            <div
              className="w-[60%] h-[72%] md:w-[58%] md:h-[66%] lg:w-[66%] lg:h-[70%] bg-transparent aspect-square"
              style={{
                backgroundImage: `url(${interview.imagePath || ""})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          </div>
          {/* Position Title and Tags */}
          <div className="w-full bg-transparent flex flex-col justify-start items-start p-2 ml-2">
            <div className="text-[0.7rem] md:text-sm tracking-wide p-2 px-3 bg-gray-800/70 text-gray-200 rounded-md font-semibold border border-white/10">
              INTERVIEW PREPARATION
            </div>
            {/* Position Title */}
            <div
              className="font-extrabold text-white w-full leading-tight mt-2
             text-3xl md:text-3xl lg:text-4xl whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-[0_6px_24px_rgba(16,185,129,0.25)]"
            >
              {interview.role
                .split(" ")
                .map(
                  (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
                )
                .join(" ")}
            </div>
            {/* Tag for the interview, it's type and no of questions: */}
            <div className="w-full flex flex-col justify-start items-start lg:flex-row lg:justify-start lg:items-center lg:gap-x-4 mt-2 text-gray-300">
              <div className="flex justify-start items-center">
                <PiBrainDuotone className="mr-2 text-emerald-300" />
                <div className="text-sm md:text-base lg:text-sm text-gray-400">
                  AI-Powered Interview
                </div>
              </div>
              <div className="flex justify-start items-center">
                <RiChatVoiceAiFill className="mr-2 text-indigo-300" />
                <div className="text-sm md:text-base lg:text-sm text-gray-400">
                  {interview.type} Interview
                </div>
              </div>
              <div className="flex justify-start items-center">
                <FaQuestion className="mr-2 text-amber-400" />
                <div className="text-sm md:text-base lg:text-sm text-gray-400">
                  {interview.questions?.length || 0} AI Questions
                </div>
              </div>
            </div>
          </div>
          {/* TechStack Icon */}
          <div className="flex flex-row justify-start items-center gap-x-2">
            {interview.techstack.map((techIcon: string) => (
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

        {/* Agent Component For Mock Interview */}
        <Agent
          userName={user?.name || ""}
          type="interview"
          userId={user?.id || ""}
          profilePic={user?.profilePic || ""}
          interviewId={interview.id}
          questions={(interview.questions || []).map((q) => q.question)}
        />
      </div>
    </>
  );
};

export default InterviewPage;
