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
    <div className="w-[95%] h-[35vh] md:w-[45%] md:h-[25vh] lg:w-[28%] lg:h-[35vh] rounded-md border-1 border-gray-800/60 bg-gray-800/50 mb-8 flex flex-col p-4 justify-evenly items-start hover:broder-3 hover:border-green-300 transition-all ease-in-out duration-150 hover:scale-105 hover:shadow-green-400 hover:shadow-sm">
      <div className="w-[18%] h-[8vh] md:w-[25%] md:h-[7vh] lg:w-[15%] lg:h-[8vh] rounded-md bg-green-600/80 flex justify-center items-center">
        {icon === 1 ? (
          <LuBrain className="text-2xl font-bold text-white" />
        ) : icon === 2 ? (
          <LuTarget className="text-2xl font-bold text-white" />
        ) : icon === 3 ? (
          <HiUsers className="text-2xl font-bold text-white" />
        ) : icon === 4 ? (
          <FiMessageCircle className="text-2xl font-bold text-white" />
        ) : icon === 5 ? (
          <FaRegStar className="text-2xl font-bold text-white" />
        ) : icon === 6 ? (
          <FaRegCircleCheck className="text-2xl font-bold text-white" />
        ) : null}
      </div>
      <div className="text-xl font-semibold  text-white">{title}</div>
      <div className="text-sm md:text-md text-gray-300/80 text-start w-[85%]">
        {description}
      </div>
    </div>
  );
};

export default HeroCard;
