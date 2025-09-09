/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
//Imports:
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  fetchLatestGeneratedInterviews,
  getCurrentUser,
} from "@/lib/actions/auth.action";
import InterviewCard from "@/components/custom/interviewCard";
//React Components:
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
//ShadCn Drop-Down Component:
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
//Icons:
import { PiSortDescendingBold } from "react-icons/pi";
import { ImSpinner8 } from "react-icons/im";
import { MdCancel } from "react-icons/md";
//Hooks:
import useFilterInterview from "@/hooks/filterInterview";

//Interface For The User:
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

const InterviewHub = () => {
  //Use-State Variables:
  const [user, setUser] = useState<User | null>(null);
  const [communityInterviews, setCommunityInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  //Custom Hook:
  const {
    filteredInterviews,
    selectedRole,
    setSelectedRole,
    selectedType,
    setSelectedType,
    selectedLevel,
    setSelectedLevel,
  } = useFilterInterview(communityInterviews);
  //UseEffect Hook For Initial Render:
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
        console.error("Error: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  //Constants:
  const router = useRouter();
  //Conditional Returns:
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

  if (!user || !user.id) {
    router.push("/login");
    //Return Them Back To Login Page With A Toast:
    return toast.error(
      "This page is only available to signed-in users. Please log in to continue."
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center overflow-y-auto mt-4 px-5">
      {/* Banner And CTA */}
      <div className="w-[95%] md:w-[98%] lg:w-[90%] h-[45vh] md:h-[38vh] lg:h-[40vh] bg-gray-900/90 rounded-md flex flex-col justify-start items-start md:flex-row md:justify-start md:items-center lg:flex-row lg:justify-start lg:items-center mb-4">
        {/* Banner Actions */}
        <div className="w-full lg:w-[55%] md:w-[58%] flex flex-col justify-center items-start lg:items-start md:items-start p-6 mt-2">
          {/* Title */}
          <div className="text-2xl md:text-3xl lg:text-3xl text-white font-semibold mb-4">
            Learn from the Community with InterviewHub
          </div>
          {/* SubText */}
          <div className="text-md md:text-xl lg:text-md text-white mb-6">
            Discover and explore interviews shared by the community.
          </div>
          {/* CTA Button */}
          <Button
            asChild
            className="w-[75%] md:w-[85%] md:p-2 lg:w-[30%] h-[8.5vh] md:h-[6.8vh] lg:h-[7vh] rounded-md hover:cursor-pointer transition-all ease-in-out duration-150 hover:scale-105 bg-green-700 hover:bg-green-400/70 mb-1"
          >
            <Link
              href="/myInterview"
              className="flex justify-center items-center"
            >
              <div className="text-lg md:text-2xl lg:text-sm text-white">
                My Interviews
              </div>
            </Link>
          </Button>
        </div>
        {/* Banner Image */}
        <div
          className="max-sm:hidden md:w-[42%] md:h-[14vh] lg:w-[34%] lg:h-[34vh]"
          style={{
            backgroundImage: `url(/interviewHub.png)`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>
      {/* Render The Interview Cards */}
      <div className="w-[95.5%] md:w-[95%] lg:w-[90%] flex flex-col justify-start items-start mt-8 mb-4">
        {/* Filter Interview Button */}
        <div className="w-[95%] md:w-[98%] lg:w-[87.5%] flex justify-end items-center mb-6">
          <DropdownMenu>
            {/* Trigger Button */}
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
              {/* Option-1 */}
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
              {/* Option -2 */}
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
              {/* Option - 3 */}
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
              {/* Option - 4 */}
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
        {/* Displaying The Total Count */}
        {filteredInterviews.length > 0 && (
          <div className="w-full p-2 flex justify-start items-center mb-2">
            <div className="text-center text-md md:text-xl lg:text-sm text-white font-semibold">
              Showing {filteredInterviews.length} of{" "}
              {communityInterviews.length} interviews.
            </div>
          </div>
        )}
        {/* Displaying The Filter Labels */}
        {(selectedLevel || selectedRole || selectedType) && (
          <div className="w-full p-2 flex flex-col justify-start items-start lg:flex-row lg:justify-start lg:items-center mb-4">
            {/* Title */}
            <div className="text-md md:text-xl lg:text-md lg:text-sm text-white font-semibold mr-0 mb-3 lg:mr-4 lg:mb-0">
              Active Filters:
            </div>
            {/* Showing The Filters */}
            <div className="w-full lg:w-[85%] ml-2 flex-row flex-wrap justify-start items-center gap-4">
              {/* Level */}
              {selectedLevel && (
                <div className="p-2 h-[5.25vh] rounded-sm bg-green-600/80 flex justify-around items-center hover:bg-green-400/80">
                  {/* Value Display */}
                  <div className="text-md md:text-xl lg:text-sm font-semibold text-white mr-2">
                    {selectedLevel}
                  </div>
                  {/* Cancel Button */}
                  <div
                    className="hover:cursor-pointer"
                    onClick={() => {
                      setSelectedLevel("");
                    }}
                  >
                    <MdCancel className="text-2xl md:text-3xl lg:text-xl text-white font-semibold" />
                  </div>
                </div>
              )}
              {/* Type */}
              {selectedType && (
                <div className="p-2 h-[5.25vh] rounded-sm bg-green-600/80 flex justify-around items-center hover:bg-green-400/80">
                  {/* Value Display */}
                  <div className="text-md md:text-lg lg:text-sm font-semibold text-white mr-2">
                    {selectedType}
                  </div>
                  {/* Cancel Button */}
                  <div
                    className="hover:cursor-pointer"
                    onClick={() => {
                      setSelectedType("");
                    }}
                  >
                    <MdCancel className="text-2xl md:text-3xl lg:text-xl text-white font-semibold" />
                  </div>
                </div>
              )}
              {/* Role */}
              {selectedRole && (
                <div className="p-2 h-[5.25vh] rounded-sm bg-green-600/80 flex justify-around items-center hover:bg-green-400/80">
                  {/* Value Display */}
                  <div className="text-md md:text-lg lg:text-sm font-semibold text-white mr-2">
                    {selectedRole}
                  </div>
                  {/* Cancel Button */}
                  <div
                    className="hover:cursor-pointer"
                    onClick={() => {
                      setSelectedRole("");
                    }}
                  >
                    <MdCancel className="text-2xl md:text-3xl lg:text-xl text-white font-semibold" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Interview Container */}
        <div className="w-full flex flex-col justify-start items-center lg:flex-row lg:justify-evenly lg:items-start lg:flex-wrap lg:gap-4 mb-4 mt-4">
          {filteredInterviews.length > 0 ? (
            filteredInterviews.map(
              (
                interview: any // Use filtered data
              ) => <InterviewCard key={interview?.id} {...interview} />
            )
          ) : (
            <p className="text-left text-md md:text-xl lg:text-sm text-white">
              {communityInterviews?.length > 0
                ? "No interviews match your selected filters."
                : "There are no new interviews available in the community."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewHub;
