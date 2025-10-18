export interface QuestionData {
  question: string;
  answer: string;
}

export interface InterviewData {
  id: string;
  role: string;
  type: string;
  imagePath: string;
  techstack: string[];
  questions: QuestionData[];
}
