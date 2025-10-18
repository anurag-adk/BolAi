/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/custom/interviewCard";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PiSortDescendingBold } from "react-icons/pi";
import { MdCancel } from "react-icons/md";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useFilterInterview from "@/hooks/filterInterview";
import { BackgroundLines } from "@/components/ui/background-lines";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { fetchLatestGeneratedInterviews } from "@/lib/actions/general.action";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

const InterviewHubPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [communityInterviews, setCommunityInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  //UseEffect Hook to fetch the data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser?.id) {
          const interviews = await fetchLatestGeneratedInterviews({
            userId: currentUser.id,
          });
          setUser(currentUser as User);
          setCommunityInterviews(interviews || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load interviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const {
    filteredInterviews,
    selectedRole,
    setSelectedRole,
    selectedType,
    setSelectedType,
    selectedLevel,
    setSelectedLevel,
  } = useFilterInterview(communityInterviews);

  //Spinner for loading
  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col md:flex-col lg:flex-row justify-center items-center">
        <div className="text-white font-semibold text-md md:text-xl lg:text-sm mr-0 mb-4 md:mr-0 md:mb-4 lg:mb-0 lg:mr-2 text-center md:text-justify lg:text-center p-4">
          Community interviews are being loaded. Please wait...
        </div>
      </div>
    );
  }
  //Check the userInfo
  if (!user || !user.id) {
    router.push("/login");
    toast.error(
      "This page is only available to signed-in users. Please log in to continue."
    );
    return null;
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center overflow-y-auto mt-4 px-5">
      {/* Banner Component */}
      <BackgroundLines className="w-[95%] md:w-[98%] lg:w-[90%] h-[45vh] md:h-[38vh] lg:h-[40vh] mt-4">
        <div className="w-full h-full flex flex-col md:flex-row lg:flex-row items-start md:items-center">
          <div className="w-full lg:w-[55%] md:w-[58%] flex flex-col p-6 mt-2">
            <div className="text-2xl md:text-3xl lg:text-3xl text-white font-semibold mb-4">
              Learn from the Community with InterviewHub
            </div>
            <div className="text-md md:text-xl lg:text-md text-white mb-6">
              Discover and explore interviews shared by the community.
            </div>
            <Button
              asChild
              className="w-[75%] md:w-[85%] lg:w-[30%] h-[7vh] rounded-md bg-green-700 hover:bg-green-400/70 transition hover:scale-105"
            >
              <Link
                href="/myInterviews"
                className="flex justify-center items-center"
              >
                <div className="text-lg md:text-2xl lg:text-sm text-white">
                  My Interviews
                </div>
              </Link>
            </Button>
          </div>
          <div
            className="max-sm:hidden md:w-[42%] md:h-[14vh] lg:w-[34%] lg:h-[34vh] bg-transparent"
            style={{
              backgroundImage: `url(/interviewHub.svg)`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
      </BackgroundLines>
      {/* Main Section      */}
      <div className="w-[95.5%] md:w-[95%] lg:w-[90%] flex flex-col mt-8 mb-4">
        {/* Filter Button */}
        <div className="w-full flex justify-end mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-[56%] md:w-[52%] lg:w-[18%] h-[7.95vh] md:h-[7.35vh] lg:h-[7.25vh] bg-green-600/80 hover:bg-green-500/80 flex justify-center items-center rounded-md transition hover:scale-105 cursor-pointer">
                <div className="text-white font-semibold text-md md:text-2xl lg:text-sm mr-2">
                  Refine Results
                </div>
                <PiSortDescendingBold className="text-white text-xl" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Level</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => setSelectedLevel("Entry")}
                      >
                        Entry
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedLevel("Mid")}>
                        Mid
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSelectedLevel("Senior")}
                      >
                        Senior
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Type</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => setSelectedType("Technical")}
                      >
                        Technical
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSelectedType("Behavioral")}
                      >
                        Behavioral
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSelectedType("Mixed")}
                      >
                        Mixed
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Position</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {[
                        "Frontend",
                        "Backend",
                        "Devops",
                        "Fullstack",
                        "Mobile Developer",
                        "Others",
                      ].map((role) => (
                        <DropdownMenuItem
                          key={role}
                          onClick={() => setSelectedRole(role)}
                        >
                          {role}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedLevel("");
                  setSelectedRole("");
                  setSelectedType("");
                }}
              >
                Reset
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Showing the total interviews fetched */}
        {filteredInterviews.length > 0 && (
          <div className="w-full p-2 flex justify-start items-center mb-2">
            <div className="text-center text-md md:text-xl lg:text-sm text-white font-semibold">
              Showing {filteredInterviews.length} of{" "}
              {communityInterviews.length} interviews.
            </div>
          </div>
        )}
        {/* Shows the level of filters        */}
        {(selectedLevel || selectedType || selectedRole) && (
          <div className="w-full p-2 flex flex-wrap gap-4 mb-4">
            {[
              { label: selectedLevel },
              { label: selectedType },
              { label: selectedRole },
            ]
              .filter((f) => f.label)
              .map((f) => (
                <div
                  key={f.label}
                  className="p-2 h-[5.25vh] rounded-sm bg-green-600/80 flex items-center gap-2 hover:bg-green-400/80"
                >
                  <div className="text-white font-semibold">{f.label}</div>
                  <MdCancel
                    className="text-white font-semibold cursor-pointer"
                    onClick={() => {
                      if (f.label === selectedLevel) setSelectedLevel("");
                      if (f.label === selectedType) setSelectedType("");
                      if (f.label === selectedRole) setSelectedRole("");
                    }}
                  />
                </div>
              ))}
          </div>
        )}
        {/* Rendering the cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
          {filteredInterviews.length > 0 ? (
            filteredInterviews.map((interview: any) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p className="text-white text-md md:text-xl lg:text-sm">
              {communityInterviews.length > 0
                ? "No interviews match your selected filters."
                : "There are no new interviews available in the community."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewHubPage;
