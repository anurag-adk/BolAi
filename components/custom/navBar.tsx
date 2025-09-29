"use client";

import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return (
    // Navigation Bar
    <div className="w-full h-[16vh] flex justify-center items-center fixed top-0 z-50 px-4">
      <div className="w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] max-w-7xl h-[11vh] bg-black/30 flex justify-between items-center border border-white/10 rounded-2xl backdrop-blur-md px-8">
        {/* Logo */}
        <div className="flex justify-center items-center">
          <div
            className="w-12 h-12 mr-3"
            style={{
              backgroundImage: `url('/motif.png')`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></div>
          <div className="text-3xl font-bold text-green-500">BolAi</div>
        </div>

        {/* Hamburger/Close Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-gray-300 hover:text-white p-2 transition-transform duration-200"
        >
          {isMobileMenuOpen ? (
            <div className="text-2xl">✕</div>
          ) : (
            <AiOutlineMenu className="text-2xl" />
          )}
        </button>

        {/* Navigation Links and Buttons */}
        <div className="hidden md:flex md:items-center md:space-x-10">
          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <div className="text-base hover:cursor-pointer text-gray-300 hover:text-green-400 transition-colors">
              Features
            </div>
            <div className="text-base hover:cursor-pointer text-gray-300 hover:text-green-400 transition-colors">
              How it Works
            </div>
            <div className="text-base hover:cursor-pointer text-gray-300 hover:text-green-400 transition-colors">
              Pricing
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-5">
            <Link
              href={"/login"}
              className="px-5 py-2.5 rounded-lg bg-transparent border border-green-600/50 text-green-400 text-base hover:cursor-pointer transition-all ease-in-out duration-150 hover:bg-green-600/50 hover:border-transparent hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href={"/signup"}
              className="px-5 py-2.5 rounded-lg bg-green-600 text-white text-base hover:cursor-pointer transition-all ease-in-out duration-150 hover:bg-green-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/*
      Mobile Dropdown Menu
      activates after the hamburger icon is clicked
      */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full w-[89%] md:w-[84%] lg:w-[79%] xl:w-[74%] max-w-7xl mx-auto mt-2 bg-black/30 border border-white/10 rounded-2xl backdrop-blur-lg">
          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            <div className="text-base text-gray-300 hover:text-green-400 hover:bg-gray-600/20 transition-all cursor-pointer py-3 px-4 rounded-lg">
              Features
            </div>
            <div className="text-base text-gray-300 hover:text-green-400 hover:bg-gray-600/20 transition-all cursor-pointer py-3 px-4 rounded-lg">
              How it Works
            </div>
            <div className="text-base text-gray-300 hover:text-green-400 hover:bg-gray-600/20 transition-all cursor-pointer py-3 px-4 rounded-lg">
              Pricing
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="p-4 pt-2 space-y-3">
            <Link
              href={"/login"}
              onClick={closeMobileMenu}
              className="w-full px-5 py-3 rounded-lg bg-transparent border border-green-600/50 text-green-400 text-center block hover:bg-green-600/50 hover:border-transparent hover:text-white transition-all font-medium"
            >
              Sign In
            </Link>
            <Link
              href={"/signup"}
              onClick={closeMobileMenu}
              className="w-full px-5 py-3 rounded-lg bg-green-600 text-white text-center block hover:bg-green-700 transition-all font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
