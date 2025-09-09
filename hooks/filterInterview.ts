/* eslint-disable @typescript-eslint/no-explicit-any */
//Imports:
import { useState, useMemo } from "react";
const useFilterInterview = (communityInterviews: any[]) => {
  //Create the UseState Variables:
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  //Filtering The Interviews:
  const filteredInterviews = useMemo(() => {
    if (!communityInterviews) return [];

    //Roles Which Are Ommitted For Other Option:
    const excludedRoles = [
      "Front End",
      "Back End",
      "DevOps",
      "Full Stack",
      "Mobile Developer",
    ];

    return communityInterviews.filter((interview: any) => {
      const levelMatch =
        !selectedLevel ||
        interview.level?.toLowerCase().replace(/\s+/g, "") ===
          selectedLevel.toLowerCase().replace(/\s+/g, "");

      const typeMatch =
        !selectedType ||
        interview.type?.toLowerCase().replace(/\s+/g, "") ===
          selectedType.toLowerCase().replace(/\s+/g, "");

      let roleMatch;
      if (!selectedRole) {
        roleMatch = true; //No Data Was Provided
      } else if (selectedRole === "Others") {
        roleMatch = !excludedRoles.some((role) =>
          interview.role
            ?.toLowerCase()
            .replace(/\s+/g, "")
            .includes(role.toLowerCase().replace(/\s+/g, ""))
        );
      } else {
        roleMatch = interview.role
          ?.toLowerCase()
          .replace(/\s+/g, "")
          .includes(selectedRole.toLowerCase().replace(/\s+/g, ""));
      }
      return levelMatch && typeMatch && roleMatch;
    });
  }, [communityInterviews, selectedLevel, selectedRole, selectedType]);
  //Return the values:
  return {
    filteredInterviews,
    selectedRole,
    setSelectedRole,
    selectedType,
    setSelectedType,
    selectedLevel,
    setSelectedLevel,
  };
};

//export the hook:
export default useFilterInterview;
