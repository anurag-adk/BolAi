import Agent from "@/components/custom/Agent";
import React from "react";

const InterviewPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-start items-center overflow-auto">
      <Agent userName="You" userId="user1" type="generate" />
    </div>
  );
};

export default InterviewPage;
