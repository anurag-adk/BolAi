import z from "zod";

export const myInterviews = [
  {
    id: "1",
    userId: "user1",
    role: "FrontEnd Developer",
    type: "Technical",
    techstack: ["React", "TailwindCSS", "JavaScript"],
    level: "Junior",
    questions: [
      "What is React?",
      "Explain the virtual DOM.",
      "How does useState work?",
    ],
    finalized: true,
    imagePath: "/vectornator.jpeg",
    createdAt: "2025-07-16T11:30:00.000Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "UI/UX Engineer",
    type: "Mixed",
    techstack: ["Figma", "TailwindCSS", "Next.js"],
    level: "Junior",
    questions: [
      "How do you ensure accessibility in your designs?",
      "What is TailwindCSS used for?",
    ],
    finalized: false,
    imagePath: "/google.png",
    createdAt: "2025-07-14T09:15:45.000Z",
  },
  {
    id: "3",
    userId: "user1",
    role: "Frontend Developer",
    type: "Behavioral",
    techstack: ["React", "TypeScript", "Next.js"],
    level: "Junior",
    questions: [
      "Tell me about a time you faced a challenge in a project.",
      "How do you handle tight deadlines?",
    ],
    finalized: true,
    imagePath: "/figma.png",
    createdAt: "2025-07-12T17:45:30.000Z",
  },
];

export const dummyInterviews = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TailwindCSS", "JavaScript"],
    level: "Junior",
    questions: [
      "What is React?",
      "Explain the virtual DOM.",
      "How does useState work?",
    ],
    finalized: true,
    imagePath: "/uxacademy.png",
    createdAt: "2025-07-16T11:30:00.000Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "UI/UX Engineer",
    type: "Mixed",
    techstack: ["Figma", "TailwindCSS", "Next.js"],
    level: "Junior",
    questions: [
      "How do you ensure accessibility in your designs?",
      "What is TailwindCSS used for?",
    ],
    finalized: false,
    imagePath: "/google.png",
    createdAt: "2025-07-14T09:15:45.000Z",
  },
  {
    id: "3",
    userId: "user1",
    role: "Frontend Developer",
    type: "Behavioral",
    techstack: ["React", "TypeScript", "Next.js"],
    level: "Junior",
    questions: [
      "Tell me about a time you faced a challenge in a project.",
      "How do you handle tight deadlines?",
    ],
    finalized: true,
    imagePath: "/vscode.webp",
    createdAt: "2025-07-12T17:45:30.000Z",
  },
  {
    id: "4",
    userId: "user2",
    role: "Backend Developer",
    type: "Technical",
    techstack: ["Node.js", "Express", "MongoDB"],
    level: "Mid",
    questions: [
      "Explain the event loop in Node.js.",
      "How do you handle authentication in Express?",
    ],
    finalized: false,
    imagePath: "/notion.png",
    createdAt: "2025-07-10T10:25:00.000Z",
  },
  {
    id: "5",
    userId: "user3",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["Vue", "Laravel", "MySQL"],
    level: "Mid",
    questions: [
      "How do Vue components communicate?",
      "How does Laravel handle routing?",
      "Difference between MySQL and PostgreSQL?",
    ],
    finalized: true,
    imagePath: "/figma.png",
    createdAt: "2025-07-08T14:00:00.000Z",
  },
  {
    id: "6",
    userId: "user4",
    role: "QA Engineer",
    type: "Technical",
    techstack: ["Cypress", "Jest", "TypeScript"],
    level: "Junior",
    questions: [
      "How do you write unit tests in Jest?",
      "Explain the difference between Cypress and Selenium.",
    ],
    finalized: true,
    imagePath: "/tesla.png",
    createdAt: "2025-07-06T08:45:00.000Z",
  },
];

export const feedbackSchema = z.object({
  totalScore: z.number(), //Out of 100 marks
  categorySchema: z
    .array(
      z.object({
        name: z.enum([
          "Understanding & Relevance",
          "Depth of Knowledge & Accuracy",
          "Problem-Solving & Reasoning Ability",
          "Communication & Articulation",
          "Professionalism & Attitude",
        ]),
        score: z.number(),
        comment: z.string(),
      })
    )
    .length(5), // The total scoring will be done in this 5 areas.
  strengths: z.array(z.string()), //Array of the strengths of the users answer.
  areasForImprovement: z.array(z.string()), //Array of the weakness of the users answer.
  finalAssessment: z.string(), //The recommendation that will be provided.
});

export type Feedback = z.infer<typeof feedbackSchema>;
