import React from "react";
import { AiOutlineCheck, AiOutlineCrown } from "react-icons/ai";
import { PiStudentBold } from "react-icons/pi";
import { TbFreeRights } from "react-icons/tb";

const SubscriptionCards = () => {
  return (
    <>
      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <div className="group relative">
          <div className="relative p-8 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/40 backdrop-blur-md transition-all duration-500 hover:transform hover:scale-[1.02] shadow-lg hover:shadow-green-500/10 h-full flex flex-col">
            <div className="text-center mb-8">
              <div className="flex justify-center items-center mb-4">
                <TbFreeRights className="text-2xl mr-2 w-8 h-8 text-gray-300" />
                <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Great for trying out AI interviews
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-green-400">$0</span>
                <span className="text-gray-400 ml-2">forever</span>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  1 AI mock interview per month
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Access to basic job roles
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Standard AI feedback
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Limited question bank access
                </span>
              </div>
              <div className="flex items-center gap-3 opacity-0">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Additional feature placeholder
                </span>
              </div>
              <div className="flex items-center gap-3 opacity-0">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Additional feature placeholder
                </span>
              </div>
            </div>

            <button className="w-full border-2 border-white/40 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 hover:cursor-pointer mt-auto">
              Start for Free
            </button>
          </div>
        </div>

        {/* Student Plan */}
        <div className="group relative">
          <div className="relative p-8 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-2 border-green-400 backdrop-blur-md transition-all duration-500 hover:transform hover:scale-[1.02] shadow-lg hover:shadow-green-500/25 h-full flex flex-col">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
              <span className="bg-green-400 text-gray-900 px-4 py-1 rounded-full text-xs font-semibold uppercase">
                Popular
              </span>
            </div>
            {/* Card Contents */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-center mb-4">
                <PiStudentBold className="text-2xl text-green-500 mr-2 w-8 h-8" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Student
                </h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Ideal for students and early job seekers
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-green-400">$7</span>
                <span className="text-gray-400 ml-2">per month</span>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Apply to real job listings
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  5 AI mock interviews per month
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Access to full job role library
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Enhanced AI feedback with suggestions
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Complete question bank access
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Track interview progress over time
                </span>
              </div>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 hover:cursor-pointer shadow-lg mt-auto">
              Get Student Plan
            </button>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="group relative">
          <div className="relative p-8 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/40 backdrop-blur-md transition-all duration-500 hover:transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/10 h-full flex flex-col">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <AiOutlineCrown className="text-blue-400 text-xl w-8 h-8" />
                <h3 className="text-xl font-semibold text-white">Pro</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Designed for ambitious professionals
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-400">$13</span>
                <span className="text-gray-400 ml-2">per month</span>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Apply to real job listings
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  10 AI mock interviews per month
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Full access to job roles & industries
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  In-depth AI feedback with performance scoring
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Unlimited question bank
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineCheck className="text-green-400 text-lg flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Detailed progress and analytics dashboard
                </span>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 hover:cursor-pointer shadow-lg mt-auto">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionCards;
