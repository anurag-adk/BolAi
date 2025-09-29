import React from "react";

const Particles = () => {
  return (
    <div className="w-full h-32 particles-container">
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {/* Large particles */}
        <div className="particle particle-large absolute top-4 left-1/4"></div>
        <div className="particle particle-medium particle-emerald absolute top-8 right-1/3"></div>
        <div className="particle particle-small absolute top-12 left-1/2"></div>
        <div className="particle particle-large particle-green absolute top-6 right-1/4"></div>
        <div className="particle particle-medium particle-emerald absolute top-16 left-1/6"></div>

        {/* Medium particles */}
        <div className="particle particle-small particle-green absolute top-10 left-3/4"></div>
        <div className="particle particle-medium absolute top-14 right-1/6"></div>
        <div className="particle particle-large particle-emerald absolute top-20 left-1/3"></div>

        {/* Small particles */}
        <div className="particle particle-small absolute top-5 left-2/3"></div>
        <div className="particle particle-small particle-emerald absolute top-9 right-2/3"></div>
        <div className="particle particle-small particle-green absolute top-24 left-5/6"></div>
        <div className="particle particle-small absolute top-18 right-1/2"></div>
      </div>
    </div>
  );
};

export default Particles;
