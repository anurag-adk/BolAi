import Agent from "@/components/custom/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import React from "react";

const InterviewPage = async () => {
  const user = await getCurrentUser();
  const userName = (user as { name?: string })?.name ?? "You";

  return (
    <div className="min-h-screen w-full flex flex-col justify-start items-center overflow-auto">
      <div className="w-full h-full md:h-full lg:h-[85vh] flex justify-center items-center">
        <Agent
          userName={userName}
          userId={user?.id ?? ""}
          type="generate"
          profilePic={user?.profilePic ?? ""}
        />
      </div>
    </div>
  );
};

export default InterviewPage;
