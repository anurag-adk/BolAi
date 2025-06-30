import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="overflow-y-auto w-full flex justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
