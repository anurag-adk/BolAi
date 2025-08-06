import Agent from "@/components/custom/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import React from "react";

const InterviewPage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="min-h-screen w-full flex flex-col justify-start items-center overflow-auto">
      <Agent userName="You" userId={user?.id ?? ""} type="generate" />
    </div>
  );
};

export default InterviewPage;
