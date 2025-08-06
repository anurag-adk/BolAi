import { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen overflow-y-auto w-full flex flex-col justify-center items-center">
      {children}
    </div>
  );
};

export default RootLayout;
