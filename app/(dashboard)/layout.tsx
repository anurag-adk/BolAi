import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Sidebar from "@/components/custom/Sidebar";

const dashboardLayout = async ({ children }: { children: ReactNode }) => {
  //Check Whether The User Is Authenticated:
  const isUserAuthenticated = await isAuthenticated();
  //If Not Authenticated Navigate Them Back:
  if (!isUserAuthenticated) {
    redirect("/login");
  }
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-900">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-900">{children}</div>
    </div>
  );
};

export default dashboardLayout;
