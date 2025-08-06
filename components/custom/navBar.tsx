import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
    // Navigation Bar
    <div className="w-full h-[15vh] bg-black/35 flex justify-start lg:justify-around items-center border-b-2 border-gray-400/35 fixed top-0 backdrop-blur-md">
      {/* Logo */}
      <div className="w-[45%] md:w-[35%] lg:w-[35%] h-[12vh] flex justify-center items-center">
        <div
          className="w-[95%] h-[10vh] ml-4 md:ml-0 lg:ml-0 lg:w-[12%] lg:h-[10vh] md:w-[22%] md:h-[8vh] mr-2"
          style={{
            backgroundImage: `url('/motif.png')`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        ></div>
        <div className="text-3xl font-bold text-green-700/85">BolAi</div>
      </div>
      {/* Buttons */}
      <div className="hidden md:w-[60%] md:flex md:justify-center md:items-center lg:w-[45%] lg:flex lg:justify-center lg:items-center">
        <div className="text-md hover:cursor-pointer text-gray-300 hover:text-green-400/90 mr-8">
          Features
        </div>
        <div className="text-md hover:cursor-pointer text-gray-300 hover:text-green-400/90 mr-8">
          How it Works
        </div>
        <Link
          href={"/login"}
          className="lg:w-[15%] md:w-[20%] md:h-[6vh] lg:h-[7vh] rounded-md bg-transparent border-2 border-green-700/50 text-green-400/90 text-center hover:cursor-pointer transition-all ease-in-out duration-150 hover:scale-95 hover:bg-green-500/90 hover:text-white flex justify-center items-center mr-8"
        >
          Sign In
        </Link>
        <Link
          href={"/signup"}
          className="lg:w-[20%] lg:h-[7vh] md:w-[25%] md:h-[6vh] rounded-md bg-green-500/70 text-center hover:cursor-pointer transition-all ease-in-out duration-150 hover:scale-95 hover:bg-green-500/90 text-white flex justify-center items-center"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
