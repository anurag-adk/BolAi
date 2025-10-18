"use client";

import { useEffect, useState } from "react";
import { AiOutlineThunderbolt } from "react-icons/ai";
import SubscriptionCards from "@/components/custom/subscriptionCards";

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
    <div className="w-full min-h-screen flex flex-col justify-start items-center p-2 bg-gray-900 gap-y-4">
      {/* Banner And CTA */}
      <div className="w-[95%] md:w-[98%] lg:w-[90%] h-[38vh] md:h-[38vh] lg:h-[40vh] rounded-md flex flex-col justify-start items-start md:flex-row md:justify-start md:items-center lg:flex-row lg:justify-start lg:items-center mt-3 bg-transparent mb-2">
        {/* Banner Actions */}
        <div className="w-full lg:w-[55%] md:w-full flex flex-col justify-center items-start lg:items-start md:items-center p-6 mt-2">
          {/* Title */}
          <div className="text-2xl md:text-4xl lg:text-3xl text-white font-semibold mb-4">
            Simple, <span className="text-green-400">Transparent Pricing</span>
          </div>
          {/* SubText */}
          <div className="text-md md:text-lg lg:text-md text-white mb-3">
            Choose the plan that fits your needs. All plans include core
            features to help you ace your interviews.
          </div>
        </div>
      </div>

      {/* Pricing Cards Container */}
      <div className="w-[95%] md:w-[95%] lg:w-[90%] max-w-6xl">
        <SubscriptionCards />
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
