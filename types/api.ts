import { InterviewData } from "./interview";

export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export type InterviewResponse = APIResponse<InterviewData>;
