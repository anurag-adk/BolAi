/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const HowItWorksCard = ({ motif, title, desc }: any) => {
  return (
    <div className="w-[95%] h-[38vh] md:w-[30%] md:h-[25vh] lg:w-[30%] lg:h-[38vh] mb-6 md:mb-0 lg:mb-0 flex flex-col justify-center items-center mr-2">
      {/* Motif */}
      <div className="my-4 w-[20%] h-[9vh] md:w-[45%] md:h-[16vh] lg:w-[16%] lg:h-[8vh] rounded-sm bg-green-600/80 flex justify-center items-center text-center text-2xl font-bold text-white">
        {motif}
      </div>
      {/* Title */}
      <div className="my-4 text-center text-xl text-white font-semibold">
        {title}
      </div>
      {/* Desc */}
      <div className="my-4 text-center text-lg text-gray-300">{desc}</div>
    </div>
  );
};

export default HowItWorksCard;
