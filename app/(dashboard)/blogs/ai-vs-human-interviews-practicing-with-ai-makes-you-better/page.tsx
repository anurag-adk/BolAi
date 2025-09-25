import { notFound } from "next/navigation";
import { blogs } from "@/constants/blogdata";
import ArticleLayout from "../Articlelayout";

export default function Page() {
  const blog = blogs.find(
    (b) =>
      b.slug === "ai-vs-human-interviews-practicing-with-ai-makes-you-better"
  );
  if (!blog) return notFound();

  return (
    <div>
      <ArticleLayout blog={blog}>
        <h2 className="text-xl font-semibold mt-2">What is AI interviewing?</h2>
        <p>
          Instead of a human, AI interviewing uses algorithms or chatbots to
          evaluate candidates. This can mean uploading video responses or typing
          answers, which the AI analyzes for content and delivery. Companies use
          AI tools to quickly screen large numbers of applicants. Surveys cite
          that by 2025 over 83% of companies plan to use AI for resume screening
          and 99% of Fortune 500 firms already rely on automated systems in
          hiring. The bottom line: AI helps recruiters handle massive hiring
          volumes and reduce time‑to‑hire by up to 50%.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          Why companies use AI to screen
        </h2>
        <p>
          AI algorithms can standardize the first interview round, ensuring
          every candidate gets similar questions. This speeds up hiring and can
          reduce bias (less “gut feeling” involved). Companies save resources
          and reach more candidates, especially with remote and global hiring.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          Benefits of AI practice for job seekers
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Judgment‑free practice:</strong> Tools like Google’s
            Interview Warmup are designed as a “judgment‑free zone,” so you can
            improve at your own pace.
          </li>
          <li>
            <strong>Unlimited tries:</strong> Many platforms boast 24/7 access —
            no schedules, no stress. Repetition builds confidence, like batting
            practice before a game.
          </li>
          <li>
            <strong>Instant feedback:</strong> AI coaches analyze your responses
            in real time, highlighting pacing, filler words, and clarity.
          </li>
          <li>
            <strong>Tailored prep for humans:</strong> Running through tough or
            unexpected questions helps fix monotone speech, reduce “um,” and
            practice specific scenarios (technical, behavioral) to boost
            versatility.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          Common AI‑interview pitfalls
        </h2>
        <p>
          Even with AI, mistakes happen. Lack of eye contact or energy signals
          low interest. Rambling or unclear answers hurt; use concise frameworks
          like STAR. A cluttered background or poor lighting can distract both
          AI systems and real recruiters. Treat AI practice seriously: pause,
          breathe, and answer thoughtfully.
        </p>

        <h2 className="text-xl font-semibold mt-6">In short</h2>
        <p>
          Practicing with AI complements human interview prep. It provides
          unlimited, pressure‑free practice and precise feedback, helping you
          improve before the real interview. You’ll enter human interviews
          sounding more natural and confident than if you only practiced
          informally.
        </p>

        <h2 className="text-xl font-semibold mt-6">Action Steps</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Try an AI mock tool:</strong> Use an AI interview simulator
            to practice sample questions any time.
          </li>
          <li>
            <strong>Analyze your performance:</strong> Review AI feedback on
            tone, speed, and key terms. Adjust accordingly.
          </li>
          <li>
            <strong>Balance AI and human practice:</strong> After AI practice,
            also do a live mock interview (friend or coach).
          </li>
          <li>
            <strong>Avoid common pitfalls:</strong> Maintain eye contact, sit in
            a neutral background, and rehearse clear, concise answers (use the
            STAR method).
          </li>
          <li>
            <strong>Reflect and improve:</strong> After each AI session, note
            one thing to fix (e.g., reduce “um” or increase enthusiasm) and work
            on it next time.
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
                href="https://blog.theinterviewguys.com/"
                target="_blank"
                rel="noreferrer"
                className="text-green-300 hover:text-green-200 underline"
              >
                blog.theinterviewguys.com
              </a>
            </li>
            <li>
              <a
                href="https://grow.google/"
                target="_blank"
                rel="noreferrer"
                className="text-green-300 hover:text-green-200 underline"
              >
                grow.google
              </a>
            </li>
            <li>
              <a
                href="https://finalroundai.com/"
                target="_blank"
                rel="noreferrer"
                className="text-green-300 hover:text-green-200 underline"
              >
                finalroundai.com
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
            <li>
              <a
                href="https://lockedinai.com/"
                target="_blank"
                rel="noreferrer"
                className="text-green-300 hover:text-green-200 underline"
              >
                lockedinai.com
              </a>
            </li>
          </ul>
        </div>
      </ArticleLayout>
    </div>
  );
}
