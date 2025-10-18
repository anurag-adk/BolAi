/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { fetchGeneratedInterviews } from "@/lib/actions/general.action";
import InterviewCard from "@/components/custom/interviewCard";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { FiFilter } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { ImSpinner8 } from "react-icons/im";
import useFilterInterview from "@/hooks/filterInterview";
import { BackgroundLines } from "@/components/ui/background-lines";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

const MyInterviewsPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [myInterviews, setMyInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    filteredInterviews,
    selectedRole,
    setSelectedRole,
    selectedType,
    setSelectedType,
    selectedLevel,
    setSelectedLevel,
  } = useFilterInterview(myInterviews);

  const router = useRouter();

  //Fetch the initial data.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser?.id) {
          const interviews = await fetchGeneratedInterviews({
            userId: currentUser.id,
          });
          setUser(currentUser as User);
          setMyInterviews(interviews || []);
        }
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Spinner
  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col md:flex-col lg:flex-row justify-center items-center">
        <div className="text-white font-semibold text-md md:text-xl lg:text-sm mr-0 mb-4 md:mr-0 md:mb-4 lg:mb-0 lg:mr-2 text-center md:text-justify lg:text-center p-4">
          Your interviews are being loaded and rendered. This may take a few
          seconds.
        </div>
        <ImSpinner8 className="text-2xl md:text-3xl lg:text-xl text-white animate-spin" />
      </div>
    );
  }

  // Check User is loggedIn
  if (!user || !user.id) {
    router.push("/login");
    return toast.error(
      "This page is only available to signed-in users. Please log in to continue."
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center overflow-y-auto mt-4 px-5">
      {/* Banner Component */}
      <BackgroundLines className="w-[95%] md:w-[98%] lg:w-[90%] h-[45vh] md:h-[38vh] lg:h-[40vh] mt-4 mb-4">
        <div className="w-full h-full bg-transparent rounded-md flex flex-col justify-start items-start md:flex-row md:justify-between md:items-center lg:flex-row lg:justify-between lg:items-center mb-4">
          <div className="w-full lg:w-[55%] md:w-[58%] flex flex-col justify-center items-start lg:items-start md:items-start p-6 mt-2 bg-transparent">
            <div className="text-2xl md:text-3xl lg:text-3xl text-white font-semibold mb-4">
              Build Your Interview Portfolio with Every Practice
            </div>
            <div className="text-md md:text-xl lg:text-md text-white mb-6">
              Access all your completed and pending interviews in one place.
            </div>
            <Button
              asChild
              className="w-[75%] md:w-[85%] md:p-2 lg:w-[30%] h-[8.5vh] md:h-[6.8vh] lg:h-[7vh] rounded-md hover:cursor-pointer transition-all ease-in-out duration-150 hover:scale-105 bg-green-700 hover:bg-green-400/70 mb-1"
            >
              <Link
                href="/interviewHub"
                className="flex justify-center items-center"
              >
                <div className="text-lg md:text-2xl lg:text-sm text-white">
                  Interview Hub
                </div>
              </Link>
            </Button>
          </div>
          <div
            className="max-sm:hidden md:w-[40%] md:h-[32vh] lg:w-[34%] lg:h-[34vh] bg-transparent"
            style={{
              backgroundImage: `url(/myInterviews.svg)`,
              backgroundPosition: "center center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
      </BackgroundLines>
      {/* Main Cards Render */}
      <div className="w-[95.5%] md:w-[95%] lg:w-[90%] flex flex-col justify-start items-start mt-8 mb-4">
        {/* Filter Section Header */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          {/* Results Counter */}
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl lg:text-xl text-white font-semibold">
              My Interviews
            </h2>
            <div className="px-3 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300">
              {filteredInterviews.length} of {myInterviews.length}
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-3">
            {/* Clear All Filters Button */}
            {(selectedLevel || selectedRole || selectedType) && (
              <button
                onClick={() => {
                  setSelectedLevel("");
                  setSelectedRole("");
                  setSelectedType("");
                }}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors duration-200"
              >
                Clear All
              </button>
            )}

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-gray-700/50 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-all duration-200">
                  <FiFilter className="text-lg" />
                  <span className="font-medium">Filter By</span>
                  {(selectedLevel || selectedRole || selectedType) && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  )}
                </button>
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
                        <DropdownMenuItem
                          onClick={() => setSelectedLevel("Mid")}
                        >
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
                        <DropdownMenuItem
                          onClick={() => setSelectedRole("Frontend")}
                        >
                          Front End
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSelectedRole("Backend")}
                        >
                          Back End
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSelectedRole("Devops")}
                        >
                          DevOps
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSelectedRole("Fullstack")}
                        >
                          Full Stack
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSelectedRole("Mobile Developer")}
                        >
                          Mobile Developement
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSelectedRole("Others")}
                        >
                          Others
                        </DropdownMenuItem>
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
        </div>

        {/* Active Filters Display */}
        {(selectedLevel || selectedRole || selectedType) && (
          <div className="w-full mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-400 font-medium">
                Active filters:
              </span>

              {selectedLevel && (
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-sm text-blue-300">
                  <span>Level: {selectedLevel}</span>
                  <button
                    onClick={() => setSelectedLevel("")}
                    className="ml-1 hover:bg-blue-500/30 rounded-full p-0.5 transition-colors"
                  >
                    <AiOutlineClose className="w-3 h-3" />
                  </button>
                </div>
              )}

              {selectedType && (
                <div className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full text-sm text-purple-300">
                  <span>Type: {selectedType}</span>
                  <button
                    onClick={() => setSelectedType("")}
                    className="ml-1 hover:bg-purple-500/30 rounded-full p-0.5 transition-colors"
                  >
                    <AiOutlineClose className="w-3 h-3" />
                  </button>
                </div>
              )}

              {selectedRole && (
                <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-sm text-green-300">
                  <span>Position: {selectedRole}</span>
                  <button
                    onClick={() => setSelectedRole("")}
                    className="ml-1 hover:bg-green-500/30 rounded-full p-0.5 transition-colors"
                  >
                    <AiOutlineClose className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rendering Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 justify-items-start">
          {filteredInterviews.length > 0 ? (
            filteredInterviews.map((interview: any) => (
              <InterviewCard key={interview?.id} {...interview} />
            ))
          ) : (
            <p className="text-left text-md md:text-xl lg:text-sm text-white">
              {myInterviews?.length > 0
                ? "No interviews match your selected filters."
                : "There are no new interviews available in the community."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyInterviewsPage;
