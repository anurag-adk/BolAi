export interface AiInterviewProps {
  userName: string;
  type: "generate" | "interview"; // Only allow these two specific values
  userId: string;
  profilePic: string;
  interviewId?: string;
  questions?: string[]; // Array of question strings rather than any[]
}

export enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

export interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

export type VoiceId =
  | "Rohan"
  | "Neha"
  | "Spencer"
  | "Elliot"
  | "Kylie"
  | "Lily"
  | "Savannah"
  | "Hana"
  | "Cole"
  | "Harry"
  | "Paige";

// Voice interface matching the voices constant
export interface Voice {
  name: VoiceId;
  gender: "Male" | "Female";
  accent: string;
  age: string;
  characteristics: string[];
  default: boolean;
  audio: string;
}
