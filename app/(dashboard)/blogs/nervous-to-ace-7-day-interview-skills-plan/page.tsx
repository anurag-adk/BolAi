import { notFound } from "next/navigation";
import { blogs } from "@/constants/blogdata";
import ArticleLayout from "../Articlelayout";

export default function Page() {
  const blog = blogs.find(
    (b) => b.slug === "nervous-to-ace-7-day-interview-skills-plan"
  );
  if (!blog) return notFound();

  return (
    <div>
      <ArticleLayout blog={blog}>
        <p>
          Feeling anxious about interviews is normal. Psychologists note that a
          bit of stress means you care and can even drive you to prepare better,
          but too much anxiety can make you freeze. Follow this 7-day plan to
          tackle your fears, sharpen your skills, and approach interviews with
          confidence:
        </p>

        <h2 className="text-xl font-semibold mt-6">
          Day 1: Identify Your Fears
        </h2>
        <p>
          Write down what worries you most (e.g., answering tough questions,
          sounding nervous, body language). Challenge negative thoughts.
          Practice deep breathing or mindfulness (slow breaths for 5 minutes) to
          calm nerves. Reframe anxiety as excitement and use that energy
          constructively.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          Day 2–3: Master the Basics
        </h2>
        <p>
          Review common interview questions (e.g., “Tell me about yourself”,
          “What are your strengths?”). Write bullet‑point answers. Practice the
          STAR framework: Situation, Task, Action, Result. Rehearse out loud,
          stand tall, and project your voice slightly louder — it signals
          confidence. Practice with a friend or record yourself.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          Day 4–5: Tackle Advanced Questions
        </h2>
        <p>
          Dive into difficult scenarios: technical problems or tough behavioral
          prompts. Think aloud to simulate live problem‑solving. Ask a
          friend/mentor to throw curveballs. Keep answers concise to avoid
          rambling — concise delivery helps interviewers catch the key details.
          If possible, do a quick AI mock interview to expose unknowns.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          Day 6: Confidence &amp; Body Language
        </h2>
        <p>
          Rehearse posture and presence: sit/stand upright, smile, and maintain
          steady “eye contact” with the camera. Direct eye contact conveys
          confidence. Try a quick power pose to boost confidence. Keep using
          mindfulness if nerves creep in.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          Day 7: Final Mock Interview + Reflection
        </h2>
        <p>
          Simulate the real thing: dress up, set a quiet space, and answer a
          full sequence in one go. Use an AI coach, friend, or mentor.
          Afterwards, note what went well and what needs work (clarity, pacing,
          nervous gestures). Then relax — you’ve prepared well.
        </p>

        <h2 className="text-xl font-semibold mt-6">Actionable Takeaways</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Prepare daily:</strong> Follow the 7‑day plan for focused
            practice.
          </li>
          <li>
            <strong>Use psychological tricks:</strong> Try deep breathing or
            positive visualization on tough days.
          </li>
          <li>
            <strong>Public‑speaking training:</strong> Consider joining a group
            like Toastmasters.
          </li>
          <li>
            <strong>Record and review:</strong> Use AI tools or video to spot
            filler words and distractions; refine your delivery.
          </li>
          <li>
            <strong>Stay positive:</strong> Each interview is progress. Reflect
            and iterate.
          </li>
        </ul>

        {/* References */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
            References
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <li>
              <a
                href="https://www.psychologytoday.com/"
                target="_blank"
                rel="noreferrer"
                className="text-green-300 hover:text-green-200 underline"
              >
                psychologytoday.com
              </a>
            </li>
            <li>
              <a
                href="https://www.toastmasters.org/"
                target="_blank"
                rel="noreferrer"
                className="text-green-300 hover:text-green-200 underline"
              >
                toastmasters.org
              </a>
            </li>
            <li>
              <a
                href="https://ca.indeed.com/"
                target="_blank"
                rel="noreferrer"
                className="text-green-300 hover:text-green-200 underline"
              >
                ca.indeed.com
              </a>
            </li>
          </ul>
        </div>
      </ArticleLayout>
    </div>
  );
}
