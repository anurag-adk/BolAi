"use client";

import {
  AiOutlineBarChart,
  AiOutlineMessage,
  AiOutlineHistory,
  AiOutlineRobot,
  AiOutlineQuestionCircle,
  AiOutlineBook,
  AiOutlineUser,
  AiOutlineCreditCard,
  AiOutlineSetting,
  AiOutlineThunderbolt,
} from "react-icons/ai";

const Sidebar = () => {
  return (
    <div className="w-72 bg-gray-800 border-r border-gray-700 flex flex-col h-screen sticky top-0">
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

      {/* Scrollable Content Container */}
      <div
        className="flex-1 overflow-y-auto custom-scrollbar"
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Navigation Menu */}
        <nav className="p-4">
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

            {/* Account Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Account
              </h3>
              <div className="space-y-1">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                >
                  <AiOutlineUser className="mr-3 text-lg" />
                  My Profile
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                >
                  <AiOutlineCreditCard className="mr-3 text-lg" />
                  Subscription
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                >
                  <AiOutlineSetting className="mr-3 text-lg" />
                  Settings
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Free Plan Card */}
      <div className="p-4 flex-shrink-0">
        <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <AiOutlineThunderbolt className="mr-3 text-lg" />
            <span className="text-sm font-semibold text-white">Free Plan</span>
          </div>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            Upgrade to access more call credits & powerful features!
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors">
            Upgrade
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">MJ</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Anurag Adhikari</p>
            <p className="text-xs text-gray-400">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
