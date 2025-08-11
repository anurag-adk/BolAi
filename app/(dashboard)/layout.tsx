import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import {
  AiOutlineBarChart,
  AiOutlineMessage,
  AiOutlineHistory,
  AiOutlineRobot,
  AiOutlineQuestionCircle,
  AiOutlineBook,
} from "react-icons/ai";

const dashboardLayout = async ({ children }: { children: ReactNode }) => {
  //Check Whether The User Is Authenticated:
  const isUserAuthenticated = await isAuthenticated();
  //If Not Authenticated Navigate Them Back:
  if (!isUserAuthenticated) {
    redirect("/login");
  }
  return (
    <div className="w-full min-h-screen flex bg-gray-900">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-screen">
        {/* Logo and Title */}
        <div className="p-6 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div
              className="w-10 h-10"
              style={{
                backgroundImage: `url('/motif.png')`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></div>
            {/* Title */}
            <div className="text-2xl font-bold text-green-500">BolAi</div>
          </div>
        </div>

        {/* Navigation Menu - Scrollable */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {/* Interview Prep Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Interview Prep
              </h3>
              <div className="space-y-1">
                <a
                  href="/home"
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                >
                  <AiOutlineBarChart className="mr-3 text-lg" />
                  Overview
                </a>
                <a
                  href="/interview"
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                >
                  <AiOutlineMessage className="mr-3 text-lg" />
                  Mock Interview
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                >
                  <AiOutlineHistory className="mr-3 text-lg" />
                  Interview History
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                >
                  <AiOutlineRobot className="mr-3 text-lg" />
                  Personalized AI
                </a>
              </div>
            </div>

            {/* Learning Center Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Learning Center
              </h3>
              <div className="space-y-1">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                >
                  <AiOutlineQuestionCircle className="mr-3 text-lg" />
                  Question Bank
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                >
                  <AiOutlineBook className="mr-3 text-lg" />
                  Resources
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Account Section */}
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">MJ</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Monkey Jumps</p>
              <p className="text-xs text-gray-400">Free Plan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
};

export default dashboardLayout;
