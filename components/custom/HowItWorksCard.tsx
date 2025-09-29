/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const HowItWorksCard = ({ motif, title, desc }: any) => {
  return (
    <div className="group relative w-full max-w-sm mx-auto">
      {/* Main Card */}
      <div className="relative px-8 py-8 pb-16 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/40 backdrop-blur-md transition-all duration-500 hover:transform hover:scale-[1.02] min-h-[320px] flex flex-col shadow-lg hover:shadow-green-500/25 hover:shadow-2xl">
        {/* Border Glow */}
        <div className="absolute inset-0 rounded-xl border border-green-500/0 group-hover:border-green-500/20 transition-all duration-500"></div>

        {/* Number with glow */}
        <div className="relative mb-6 flex justify-center flex-shrink-0 z-10">
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 animate-pulse"></div>

            {/* Inner glow */}
            <div className="absolute inset-1 w-14 h-14 rounded-full bg-gradient-to-r from-green-300 to-emerald-400 opacity-0 group-hover:opacity-40 blur-lg transition-all duration-500"></div>

            {/* Main number circle */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 flex justify-center items-center text-xl font-bold text-white shadow-xl border border-green-400/30 group-hover:border-green-300/50 transition-all duration-300">
              <span className="relative z-10 drop-shadow-lg">{motif}</span>

              {/* Inner highlight */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-4 text-center flex-shrink-0 z-10">
          <h3 className="text-xl font-bold text-white group-hover:text-green-300 transition-all duration-300 drop-shadow-sm">
            {title}
          </h3>
        </div>

        {/* Description */}
        <div className="text-center flex-grow flex items-center z-10">
          <p className="text-gray-300 leading-relaxed group-hover:text-gray-100 transition-all duration-300 text-sm">
            {desc}
          </p>
        </div>

        {/* Bottom Arrow */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-y-[-2px]">
          <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center backdrop-blur-sm">
            <svg
              className="w-4 h-4 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksCard;
