"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaHome, FaArrowLeft } from "react-icons/fa";
import Sidebar from "@/components/custom/Sidebar";

const NotFoundPage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-900">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-300 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* 404 Error */}
          <div className="mb-6 flex justify-center">
            <Image
              src="/404Page.svg"
              alt="404 Error"
              width={280}
              height={210}
              className="max-w-full h-auto"
              priority
            />
          </div>

          <div className="mb-4">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 bg-clip-text leading-none tracking-tight">
              404
            </h1>
          </div>

          <div className="mb-6 space-y-3">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
              Page Not Found
            </h2>
            <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
              Oops! The page you are looking for does not exist. It might have
              been moved, deleted or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
            <Button
              asChild
              size="default"
              className="font-semibold flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/home">
                <FaHome className="text-sm" />
                Return to Dashboard
              </Link>
            </Button>

            <Button
              variant="outline"
              size="default"
              className="font-semibold flex items-center gap-2 px-6 py-2 border-green-500 text-green-400 hover:bg-green-500/10 hover:text-green-300"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft className="text-sm" />
              Go Back
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-gray-400 text-xs">
            <p>
              The page you are looking for could not be found. Please use the
              navigation menu or go back to the dashboard.
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-32 left-1/3 w-1 h-1 bg-emerald-300 rounded-full animate-ping pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-3 h-3 bg-green-500 rounded-full animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-20 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-ping pointer-events-none"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;
