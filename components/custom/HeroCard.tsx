/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
//Icons:
import { LuBrain } from "react-icons/lu";
import { LuTarget } from "react-icons/lu";
import { HiUsers } from "react-icons/hi2";
import { FiMessageCircle } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";

const HeroCard = ({ title, description, icon }: any) => {
  return (
    <div className="group relative w-[95%] md:w-[45%] lg:w-[28%] mb-8 mx-auto">
      {/* Main Card */}
      <div className="relative px-6 py-8 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/40 backdrop-blur-md transition-all duration-500 hover:transform hover:scale-[1.02] min-h-[280px] flex flex-col items-center justify-between shadow-lg hover:shadow-green-500/25 hover:shadow-2xl">
        {/* Border Glow */}
        <div className="absolute inset-0 rounded-xl border border-green-500/0 group-hover:border-green-500/20 transition-all duration-500"></div>

        {/* Icon with glow */}
        <div className="relative mb-6 flex justify-center flex-shrink-0 z-10">
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-0 w-16 h-16 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-25 blur-xl transition-all duration-500"></div>

            {/* Inner glow */}
            <div className="absolute inset-1 w-14 h-14 rounded-lg bg-gradient-to-r from-green-300 to-emerald-400 opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500"></div>

            {/* Main icon container */}
            <div className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 flex justify-center items-center shadow-xl border border-green-400/30 group-hover:border-green-300/50 transition-all duration-300">
              {icon === 1 ? (
                <LuBrain className="text-2xl font-bold text-white relative z-10 drop-shadow-lg" />
              ) : icon === 2 ? (
                <LuTarget className="text-2xl font-bold text-white relative z-10 drop-shadow-lg" />
              ) : icon === 3 ? (
                <HiUsers className="text-2xl font-bold text-white relative z-10 drop-shadow-lg" />
              ) : icon === 4 ? (
                <FiMessageCircle className="text-2xl font-bold text-white relative z-10 drop-shadow-lg" />
              ) : icon === 5 ? (
                <FaRegStar className="text-2xl font-bold text-white relative z-10 drop-shadow-lg" />
              ) : icon === 6 ? (
                <FaRegCircleCheck className="text-2xl font-bold text-white relative z-10 drop-shadow-lg" />
              ) : null}

              {/* Inner highlight */}
              <div className="absolute inset-2 rounded-lg bg-gradient-to-br from-white/20 to-transparent"></div>
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
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
