"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AiOutlineCheck,
  AiOutlineCrown,
  AiOutlineThunderbolt,
} from "react-icons/ai";

const SubscriptionPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-start items-center py-4 px-5 md:pt-4 pt-0">
        <div className="text-white text-lg">Loading subscription plans...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center py-4 px-5 md:pt-4 pt-0">
      {/* Header Section */}
      <div className="w-[95%] md:w-[95%] lg:w-[90%] mb-8 mt-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
          Simple, <span className="text-green-400">Transparent Pricing</span>
        </h1>
        <p className="text-md md:text-lg text-gray-300 max-w-2xl mb-4">
          Choose the plan that fits your needs. All plans include core features
          to help you ace your interviews.
        </p>
      </div>

      {/* Pricing Cards Container */}
      <div className="w-[95%] md:w-[95%] lg:w-[90%] max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Free Plan */}
          <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-6 flex flex-col h-full">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
              <p className="text-gray-400 text-sm mb-4">
                Great for trying out AI interviews
              </p>
              <div className="mb-4">
                <span className="text-4xl font-bold text-green-400">$0</span>
                <span className="text-gray-400 ml-2">forever</span>
              </div>
            </div>

            <div className="flex-1 space-y-3 mb-6">
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
            </div>

            <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md transition-colors">
              Start for Free
            </Button>
          </div>

          {/* Student Plan */}
          <div className="bg-gray-900/80 border-2 border-green-400 rounded-lg p-6 flex flex-col h-full relative">
            {/* Popular Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-400 text-gray-900 px-4 py-1 rounded-full text-xs font-semibold uppercase">
                Popular
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Student</h3>
              <p className="text-gray-400 text-sm mb-4">
                Ideal for students and early job seekers
              </p>
              <div className="mb-4">
                <span className="text-4xl font-bold text-green-400">$7</span>
                <span className="text-gray-400 ml-2">per month</span>
              </div>
            </div>

            <div className="flex-1 space-y-3 mb-6">
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

            <Button className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-md transition-colors">
              Get Student Plan
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-6 flex flex-col h-full">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AiOutlineCrown className="text-blue-400 text-xl" />
                <h3 className="text-xl font-semibold text-white">Pro</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Designed for ambitious professionals
              </p>
              <div className="mb-4">
                <span className="text-4xl font-bold text-blue-400">$13</span>
                <span className="text-gray-400 ml-2">per month</span>
              </div>
            </div>

            <div className="flex-1 space-y-3 mb-6">
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

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors">
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </div>

      {/* More Info Section */}
      <div className="w-[95%] md:w-[95%] lg:w-[90%] max-w-4xl mt-12">
        <div className="bg-gray-900/80 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AiOutlineThunderbolt className="text-green-400 text-2xl" />
            <h3 className="text-xl font-semibold text-white">
              Need Help Choosing?
            </h3>
          </div>
          <p className="text-gray-300 mb-4">
            All plans include our core AI interview features. Start with Free
            and upgrade anytime as your needs grow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
