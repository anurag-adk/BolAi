import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  //Check Whether The User Is Authenticated:
  const isUserAuthenticated = await isAuthenticated();
  //If Not Authenticated Navigate Them Back:
  if (isUserAuthenticated) {
    redirect("/home");
  }
  return (
    <div className="min-h-screen overflow-y-auto w-full flex flex-col justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
