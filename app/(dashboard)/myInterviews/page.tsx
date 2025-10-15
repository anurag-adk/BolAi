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
import { PiSortDescendingBold } from "react-icons/pi";
import { ImSpinner8 } from "react-icons/im";
import { MdCancel } from "react-icons/md";
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
        <div className="w-full h-full bg-transparent rounded-md flex flex-col justify-start items-start md:flex-row md:justify-start md:items-center lg:flex-row lg:justify-around lg:items-center mb-4">
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
            className="max-sm:hidden md:w-[42%] md:h-[14vh] lg:w-[34%] lg:h-[34vh] bg-transparent"
            style={{
              backgroundImage: `url(/myInterviews.png)`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
      </BackgroundLines>
      {/* Main Cards Render */}
      <div className="w-[95.5%] md:w-[95%] lg:w-[90%] flex flex-col justify-start items-start mt-8 mb-4">
        {/* Filter Button */}
        <div className="w-[95%] md:w-[98%] lg:w-[87.5%] flex justify-end items-center mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-[56%] h-[7.95vh] md:w-[52%] md:h-[7.35vh] lg:w-[18%] lg:h-[7.25vh] bg-green-600/80 hover:cursor-pointer hover:bg-green-500/80 flex justify-center items-center rounded-md transition-all ease-in-out duration-150 hover:scale-105">
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
        {/* Showing the total interviews fetched */}
        {filteredInterviews.length > 0 && (
          <div className="w-full p-2 flex justify-start items-center mb-2">
            <div className="text-center text-md md:text-xl lg:text-sm text-white font-semibold">
              Showing {filteredInterviews.length} of {myInterviews.length}{" "}
              interviews.
            </div>
          </div>
        )}
        {/* Showing the active filters used */}
        {(selectedLevel || selectedRole || selectedType) && (
          <div className="w-full p-2 flex flex-col justify-start items-start lg:flex-row lg:justify-start lg:items-center mb-4">
            <div className="text-md md:text-xl lg:text-md lg:text-sm text-white font-semibold mr-0 mb-3 lg:mr-4 lg:mb-0">
              Active Filters:
            </div>
            <div className="w-full lg:w-[85%] ml-2 flex-row flex-wrap justify-start items-center gap-4">
              {selectedLevel && (
                <div className="p-2 h-[5.25vh] rounded-sm bg-green-600/80 flex justify-around items-center hover:bg-green-400/80">
                  <div className="text-md md:text-xl lg:text-sm font-semibold text-white mr-2">
                    {selectedLevel}
                  </div>
                  <div
                    className="hover:cursor-pointer"
                    onClick={() => setSelectedLevel("")}
                  >
                    <MdCancel className="text-2xl md:text-3xl lg:text-xl text-white font-semibold" />
                  </div>
                </div>
              )}
              {selectedType && (
                <div className="p-2 h-[5.25vh] rounded-sm bg-green-600/80 flex justify-around items-center hover:bg-green-400/80">
                  <div className="text-md md:text-lg lg:text-sm font-semibold text-white mr-2">
                    {selectedType}
                  </div>
                  <div
                    className="hover:cursor-pointer"
                    onClick={() => setSelectedType("")}
                  >
                    <MdCancel className="text-2xl md:text-3xl lg:text-xl text-white font-semibold" />
                  </div>
                </div>
              )}
              {selectedRole && (
                <div className="p-2 h-[5.25vh] rounded-sm bg-green-600/80 flex justify-around items-center hover:bg-green-400/80">
                  <div className="text-md md:text-lg lg:text-sm font-semibold text-white mr-2">
                    {selectedRole}
                  </div>
                  <div
                    className="hover:cursor-pointer"
                    onClick={() => setSelectedRole("")}
                  >
                    <MdCancel className="text-2xl md:text-3xl lg:text-xl text-white font-semibold" />
                  </div>
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
