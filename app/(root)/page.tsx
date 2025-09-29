/* eslint-disable react/no-unescaped-entities */
import HeroCard from "@/components/custom/HeroCard";
import HowItWorksCard from "@/components/custom/HowItWorksCard";
import NavBar from "@/components/custom/navBar";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen overflow-y-auto flex flex-col justify-start items-center">
      {/* Navbar */}
      <NavBar />
      {/* Hero-Banner */}
      <BackgroundBeamsWithCollision className="w-full h-[125vh] md:h-[105vh] lg:h-[105vh]">
        <div className="w-full h-full bg-transparent flex flex-col justify-center items-center mb-4">
          {/* Tagline */}
          <div className="w-[75%] md:w-[45%] lg:w-[20%] h-[5vh] p-2 rounded-md bg-green-600/80 text-center text-white text-sm flex justify-center items-center font-semibold my-6 lg:my-8 md:text-lg lg:text-sm">
            🎯 AI-Powered Interview Preparation
          </div>
          {/* Hero Text */}
          <div className="w-[95%] md:w-[75%] lg:w-[55%] flex justify-center items-center p-2 my-6">
            <div className="text-5xl md:text-6xl lg:text-6xl font-bold text-white mr-1 text-center">
              Master Your Next Interview with{" "}
              <span className="text-5xl md:text-6xl lg:text-6xl font-bold text-green-500">
                {" "}
                BolAi{" "}
              </span>
            </div>
          </div>
          {/* Hero Description */}
          <div className="w-[95%] md:w-[75%] lg:w-[55%] flex justify-center items-center p-2 my-6">
            <div className="text-lg md:text-xl lg:text-lg text-white mr-1 text-center lg:text-center md:text-center">
              Practice real interview scenarios with our advanced AI. Get
              personalized feedback, improve your confidence, and land your
              dream job. BolAi means "speak" in Nepali – and we'll help you
              speak with confidence.
            </div>
          </div>
          {/* Action Button */}
          <div className="w-[75%] md:w-[45%] lg:w-[20%] h-[8.5vh] bg-green-600/80 rounded-sm flex justify-center items-center p-2 transition-all ease-in-out duration-150 hover:cursor-pointer hover:scale-95 hover:bg-green-600/50">
            <div className="text-lg lg:text-lg md:text-2xl text-white font-bold">
              Start Practicing Now!
            </div>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
      {/* Features Section */}
      <div className="w-full h-[300vh] md:h-[135vh] lg:h-[120vh] bg-gray-900/80 flex flex-col justify-center items-center mt-2 overflow-y-auto">
        <div className="my-6 text-center text-4xl md:text-6xl lg:text-4xl text-white font-bold">
          Why Choose BolAi?
        </div>
        <div className="my-6 text-center text-lg md:text-xl text-white w-[75%] lg:w-[55%]">
          Our AI-powered platform provides comprehensive interview preparation
          tailored to your specific needs and industry.
        </div>
        <div className="w-[95%] flex flex-col justify-start items-center md:flex-row md:flex-wrap md:justify-evenly md:items-start lg:flex-row lg:flex-wrap lg:justify-evenly lg:items-start my-6">
          <HeroCard
            title={"Smart AI Interviewer"}
            description={
              "Practice with an AI that adapts to your responses and provides realistic interview scenarios."
            }
            icon={1}
          />
          <HeroCard
            title={"Personalized Feedback"}
            description={
              "Get detailed analysis of your responses, body language, and areas for improvement."
            }
            icon={2}
          />
          <HeroCard
            title={"Industry-Specific"}
            description={
              "Practice interviews tailored to your specific industry, role, and experience level."
            }
            icon={3}
          />
          <HeroCard
            title={"Real-time Conversation"}
            description={
              "Engage in natural, flowing conversations that simulate real interview conditions."
            }
            icon={4}
          />
          <HeroCard
            title={"Progress Tracking"}
            description={
              "Monitor your improvement over time with detailed feedback and suggestions."
            }
            icon={5}
          />
          <HeroCard
            title={"24/7 Availability"}
            description={
              "Practice anytime, anywhere. Our AI interviewer is always ready when you are."
            }
            icon={6}
          />
        </div>
      </div>
      {/* How It Works Section */}
      <div className="w-full h-[185vh] md:h-[90vh] lg:h-[95vh] bg-transparent flex flex-col justify-center items-center mb-4">
        {/* Title */}
        <div className="my-8 text-center text-4xl md:text-6xl lg:text-4xl text-white font-bold">
          How BolAi Works?
        </div>
        {/* Description */}
        <div className="my-8 text-center text-lg md:text-xl text-white w-[75%] lg:w-[45%]">
          Get started in minutes and begin improving your interview skills
          immediately.
        </div>
        {/* Cards Display */}
        <div className="w-[95%] flex flex-col justify-start items-center md:flex-row md:flex-wrap md:justify-evenly md:items-start lg:flex-row lg:flex-wrap lg:justify-evenly lg:items-start my-8">
          <HowItWorksCard
            motif={1}
            title={"Set Your Profile"}
            desc={"Share your job, field, and level for custom questions."}
          />
          <HowItWorksCard
            motif={2}
            title={"Practice with AI"}
            desc={"Have realistic AI interviews that adjust to your answers."}
          />
          <HowItWorksCard
            motif={3}
            title={"Get feedback and grow."}
            desc={"Get detailed feedback and track your improvement."}
          />
        </div>
      </div>
      {/* Banner */}
      <div className="w-full h-[85vh] lg:h-[50vh] bg-green-500/80 flex flex-col justify-center items-center">
        {/* Main_Tagline */}
        <div className="my-6 text-center text-4xl md:text-6xl lg:text-4xl text-white font-bold">
          Ready to Ace Your Next Interview?
        </div>
        {/* Description */}
        <div className="my-6 text-center text-lg md:text-xl text-white w-[95%] lg:w-[45%]">
          Join many inspiring professionals who have improved their interview
          skills with BolAi. Start your journey with us and speak with
          confidence.
        </div>
        {/* Buttons */}
        <div className="w-[95%] lg:w-[55%] flex flex-col justify-evenly items-center lg:flex-row lg:justify-center lg:items-center mb-2">
          <div className="w-[75%] lg:w-[35%] h-[8vh] rounded-md bg-white mr-4 transition-all ease-in-out duration-150 hover:scale-95 hover:cursor-pointer flex justify-center items-center text-center font-semibold text-xl text-green-500/80 hover:bg-gray-200 mb-4 md:lg-6 lg:mb-0">
            Start Today
            <span className="ml-2">
              <FaArrowRight className="text-xl text-green-500/80 font-semibold" />{" "}
            </span>
          </div>
          <div className="w-[75%] lg:w-[35%] h-[8vh] rounded-md bg-transparent border-1 border-white transition-all ease-in-out duration-150 hover:scale-95 hover:cursor-pointer flex justify-center items-center text-center font-semibold text-xl text-white hover:bg-white hover:text-green-500/80">
            Schedule Interview
          </div>
        </div>
      </div>
      {/* Footer Portion */}
      <div className="w-full h-[35vh] md:h-[25vh] lg:h-[20vh] bg-gray-900/80 flex flex-col justify-center items-center">
        <div className="w-[95%] flex flex-col justify-evenly items-center lg:flex-row lg:justify-around lg:items-center">
          {/* Description */}
          <div className="my-6 text-justify text-md md:text-xl lg:text-sm text-white p-2">
            © LSPP 2025 Team Future Frogs. All rights reserved.
          </div>
          {/* Logo */}
          <div className="w-[58%] md:w-[45%] lg:w-[20%] h-[12vh] flex justify-center items-center mr-2">
            <div
              className="w-[95%] h-[10vh] ml-4 md:ml-0 lg:ml-0 lg:w-[58%] lg:h-[9.5vh] md:w-[75%] md:h-[9.5vh] mr-2"
              style={{
                backgroundImage: `url('/wordmark-white.png')`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
