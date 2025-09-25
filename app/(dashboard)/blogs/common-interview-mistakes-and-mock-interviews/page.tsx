import { notFound } from "next/navigation";
import { blogs } from "@/constants/blogdata";
import ArticleLayout from "../Articlelayout";

export default function Page() {
  const slug = "common-interview-mistakes-and-mock-interviews";
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) return notFound();

  return (
    <div>
      <ArticleLayout blog={blog}>
        <p>
          Even strong candidates trip up with simple errors. Here are five
          mistakes recruiters often see – and how mock interviews train you to
          avoid each one:
        </p>

        <h2 className="text-xl font-semibold mt-6">1) No company research</h2>
        <p>
          Walking in blind is a red flag. A top career site notes that
          insufficient research about the company is a very common blunder. In a
          mock interview, you’re more conscious of questions like “Why do you
          want this job?” so you’ll practice answering with specifics (e.g.,
          citing recent projects or values). Rehearsing this makes it second
          nature to say: “I’m excited by your mission to… which aligns with my
          experience…” instead of vague praise.
        </p>

        <h2 className="text-xl font-semibold mt-6">2) Poor body language</h2>
        <p>
          Slouching, avoiding eye contact, or a weak handshake send the wrong
          message. Toastmasters experts explain that direct eye contact and good
          posture project confidence. During mocks, you learn to maintain eye
          contact with the “interviewer,” smile, and sit up straight. Video
          reviews often reveal fidgeting or disengagement — you can fix it
          before the real interview.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          3) Rambling or unfocused answers
        </h2>
        <p>
          Talking in circles wastes time and annoys interviewers. One career
          guide warns against “talking too much” without structure. In mocks,
          you get timed and coached on brevity. Coaches push frameworks like
          STAR and pausing before you answer. Instead of rambling, you deliver
          key points quickly, which makes you easier to follow.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          4) Not asking any questions
        </h2>
        <p>
          Ending without questions can look like disinterest. Always prepare
          thoughtful questions about the role or company. Mocks remind you
          there’s a final round — practice asking “What does success look like
          in this position?” so you don’t blank in the real interview.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          5) Over‑ or under‑confidence
        </h2>
        <p>
          Bragging can be off‑putting; timidity can signal low initiative.
          Feedback during mocks helps you find balanced confidence. Raising your
          voice slightly and using natural gestures conveys enthusiasm. Mocks
          highlight when you’re too modest or boastful, so you project assurance
          without going overboard.
        </p>

        <p className="mt-6">
          By regularly doing mock interview practice, you internalize
          professional habits. You’ll naturally research companies, refine
          posture and communication, keep answers focused, and remember to
          prepare questions. In short, mock interviews are your training ground
          to dodge these pitfalls before they happen.
        </p>

        {/* References */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
            References
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
          </ul>
        </div>
      </ArticleLayout>
    </div>
  );
}
