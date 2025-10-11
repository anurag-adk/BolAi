/* eslint-disable react/no-unescaped-entities */
import HeroCard from "@/components/custom/HeroCard";
import HowItWorksCard from "@/components/custom/HowItWorksCard";
import NavBar from "@/components/custom/navBar";
import Footer from "@/components/custom/footer";
import SubscriptionCards from "@/components/custom/subscriptionCards";
import Particles from "@/components/custom/particles";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen overflow-y-auto flex flex-col justify-start items-center bg-gray-900">
      {/* Navbar */}
      <NavBar />
      {/* Hero-Banner */}
      <BackgroundBeamsWithCollision className="w-full h-[110vh] md:h-[105vh] lg:h-[105vh]">
        <div className="w-full h-full hero-gradient hero-gradient-overlay floating-lights flex flex-col justify-center items-center mb-12">
          {/* Tagline */}
          <div className="w-[75%] md:w-[45%] lg:w-[20%] h-[5vh] p-2 rounded-md bg-green-600/80 border border-gray-600 text-center text-white text-sm flex justify-center items-center font-semibold my-6 lg:my-8 md:text-lg lg:text-sm">
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
          <div className="w-[75%] md:w-[45%] lg:w-[20%] h-[8.5vh] bg-green-600 hover:bg-green-700 rounded-md border border-gray-600 flex justify-center items-center p-2 transition-all ease-in-out duration-150 hover:cursor-pointer hover:scale-95">
            <div className="text-lg lg:text-lg md:text-2xl text-white font-bold">
              Start Practicing Now!
            </div>
          </div>
        </div>
      </BackgroundBeamsWithCollision>

      <Particles />
      {/* Features Section */}
      <div className="w-full min-h-screen flex flex-col justify-center items-center mt-4">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl lg:text-4xl font-bold text-white mb-4">
            Why Choose BolAi?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-600 mx-auto rounded-full"></div>
        </div>

        {/* Description */}
        <div className="text-center mb-16">
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Our AI-powered platform provides comprehensive interview preparation
            tailored to your specific needs and industry.
          </p>
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

      <Particles />

      {/* How It Works Section */}
      <div className="w-full pb-32 bg-gray-900 relative overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl lg:text-4xl font-bold text-white mb-4">
              How BolAi Works?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-600 mx-auto rounded-full"></div>
          </div>

          {/* Description */}
          <div className="text-center mb-16">
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Get started in minutes and begin improving your interview skills
              immediately with our streamlined process.
            </p>
          </div>

          {/* Cards Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            <HowItWorksCard
              motif={1}
              title={"Set Your Profile"}
              desc={
                "Share your job, field, and level for custom questions tailored to your career path."
              }
            />
            <HowItWorksCard
              motif={2}
              title={"Practice with AI"}
              desc={
                "Have realistic AI interviews that adjust to your answers and provide real-time interaction."
              }
            />
            <HowItWorksCard
              motif={3}
              title={"Get Feedback & Grow"}
              desc={
                "Get detailed feedback and track your improvement with personalized insights and analytics."
              }
            />
          </div>
        </div>
      </div>

      {/* Wave Separator From Internet */}
      <div
        className="w-full h-24 bg-gray-800/50"
        style={{
          clipPath: "ellipse(70% 80px at 50% 100%)",
        }}
      ></div>
      {/* Pricing Section */}
      <div className="w-full relative bg-gradient-to-b from-gray-800/50 via-gray-900/50 to-gray-900 pt-0 pb-10">
        <Particles />
        <div className="w-full py-20 relative -mt-32 z-10">
          <div className="max-w-7xl mx-auto px-12">
            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-4xl md:text-5xl lg:text-4xl font-bold text-white mb-4">
                Simple, Transparent Pricing
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-600 mx-auto rounded-full"></div>
            </div>

            {/* Description */}
            <div className="text-center mb-16">
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Choose the plan that fits your needs. All plans include core
                features to help you ace your interviews.
              </p>
            </div>

            {/* Subscription Cards */}
            <SubscriptionCards />
          </div>
        </div>
        <Particles />
      </div>
      {/* Banner */}
      <div className="w-full px-12 pt-0 pb-20 mb-4">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-emerald-600 via-green-400 to-green-800 p-12 text-center shadow-xl rounded-2xl backdrop-blur-md">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join many inspiring professionals who have improved their interview
            skills with BolAi. Start your journey with us and speak with
            confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-emerald-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:cursor-pointer hover:scale-105 shadow-lg flex items-center gap-2">
              Start Today
              <FaArrowRight className="text-sm" />
            </button>
            <button className="border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-lg hover:cursor-pointer hover:bg-white/20 transition-all duration-200 hover:scale-105">
              Schedule Interview
            </button>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
