import { ReactNode } from "react";

const dashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full flex flex-col justify-start items-center">
      {/* Navbar After Login */}
      <div className="w-[95%] bg-transparent mt-4 flex flex-col justify-evenly items-center lg:flex-row lg:justify-around lg:items-center mb-4">
        {/* Logo and Title*/}
        <div className="w-[75%] lg:w-[35%] flex justify-center items-center lg:justify-start lg:items-center">
          {/* Logo */}
          <div
            className="w-[25%] h-[12vh] lg:w-[17%] lg:h-[10vh]"
            style={{
              backgroundImage: `url('/motif.png')`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></div>
          {/* Title */}
          <div className="text-4xl md:text-5xl lg:text-4xl font-bold text-green-500/90">
            BolAi
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default dashboardLayout;
