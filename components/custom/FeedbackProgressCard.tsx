"use client";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Props {
  score: number;
  pathColor: string;
  trailColor: string;
  title: string;
  comment: string;
}

const FeedbackProgressCard = ({
  score,
  pathColor,
  trailColor,
  title,
  comment,
}: Props) => {
  return (
    <div
      className="group mt-4 w-full h-[48vh] p-[2px] 
      bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 
      hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 
      transition-all duration-300 rounded-2xl 
      shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] 
      hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.5)]
    "
    >
      <div className="w-full h-full bg-gray-900 backdrop-blur-md flex flex-col justify-around items-center transition-all ease-out duration-200 hover:cursor-pointer hover:-translate-y-[1px] rounded-2xl gap-y-4 p-4">
        {/* Title and Circular Progress */}
        <div className="w-full flex justify-around items-center mb-2">
          <div className="text-md md:text-lg lg:text-md font-semibold text-white">
            {title}
          </div>
          <div className="w-[28%] h-[6vh]">
            <CircularProgressbar
              value={score}
              text={`${score}%`}
              styles={buildStyles({
                rotation: 0.25,
                strokeLinecap: "round",
                textSize: "16px",
                pathTransitionDuration: 1,
                pathColor: pathColor,
                trailColor: trailColor,
                textColor: "#fff",
                backgroundColor: "#111827",
              })}
            />
          </div>
        </div>

        {/* Description */}
        <div className="w-[95%] text-justify text-sm md:text-md lg:text-sm text-slate-300/80">
          {comment}
        </div>
      </div>
    </div>
  );
};

export default FeedbackProgressCard;
