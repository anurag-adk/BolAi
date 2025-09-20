import { notFound } from "next/navigation";
import { blogs } from "@/constants/blogdata";
import ArticleLayout from "../Articlelayout";

export default function Page() {
  const blog = blogs.find(
    (b) => b.slug === "why-mock-interviews-are-your-secret-weapon"
  );
  if (!blog) return notFound();

  return (
    <div>
      <ArticleLayout blog={blog}>
        <p>
          Mock interviews are practice sessions where you simulate a real job
          interview (with a friend, coach, or AI) to sharpen your skills. Think
          of them like dress rehearsals before a big performance – they help you
          tackle common questions and get comfortable with the format. By
          role‑playing, candidates can identify their weak spots in answers and
          get constructive feedback in a low‑stakes setting. Over time, mock
          interview practice helps you speak more clearly and confidently about
          your experience.
        </p>

        <h2 className="text-xl font-semibold mt-6">Key benefits include:</h2>

        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Boosted confidence:</strong> Regular practice builds
            familiarity. Studies show structured mock‑interview training can
            increase confidence and reduce anxiety. Even Google reports that
            practicing answers can provide a big confidence boost.
          </li>

          <li>
            <strong>Spotting weaknesses:</strong> In a mock setting, feedback
            quickly highlights weak areas (like rambling or filler words) so you
            can improve before the real interview. Knowing where you stumble
            lets you strengthen your answers in advance.
          </li>

          <li>
            <strong>Reduced anxiety:</strong> Anxiety often comes from the
            unknown. Mock interviews simulate the pressure, so you feel calmer
            when the real thing comes. Some nerves show you care and can
            motivate better preparation. Practicing ahead helps channel that
            energy positively.
          </li>

          <li>
            <strong>Improved communication:</strong> Each practice session is a
            chance to polish your storytelling. Speaking a bit louder and making
            direct eye contact helps you appear confident. Mock drills let you
            experiment with tone and body language until you find a clear,
            concise style.
          </li>

          <li>
            <strong>Realistic practice:</strong> Mock interviews put you through
            varied question types (behavioral, technical, etc.) so nothing is a
            surprise. It’s like a football player running plays before the game
            – you build muscle memory for delivering strong answers.
          </li>

          <li>
            <strong>Testimonials:</strong> Many candidates swear by mocks.
            Google’s free Interview Warmup tool is designed as a “judgment‑free
            zone” for practicing answers. One user shared: “I was self‑employed
            for 13 years... Using the tool I learned how to answer questions in
            a much more professional way. It’s been a big confidence boost.”
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">AI and 24/7 access</h2>
        <p>
          Today’s AI tools take mocks further. You can do an AI mock interview
          anytime, anywhere – no appointments needed. These digital coaches run
          24/7 and give instant feedback. Products promise “24/7 access – no
          schedules, no stress” with realistic simulations and real‑time AI
          feedback. Harvard Business Review notes that AI can act as a personal
          career coach, helping reduce interview anxieties and teaching you what
          to expect. As recruiting goes virtual, many talent professionals plan
          to keep virtual interviews, making online practice more relevant than
          ever.
        </p>

        <h2 className="text-xl font-semibold mt-6">Action Items</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Schedule regular mock interviews:</strong> Use friends,
            career services, or an AI tool to practice weekly.
          </li>
          <li>
            <strong>Record yourself:</strong> Listen back to identify filler
            words or nervous tone, then refine.
          </li>
          <li>
            <strong>Practice common questions:</strong> Write and rehearse
            answers (e.g., “Tell me about yourself” or STAR‑method responses) to
            build fluency.
          </li>
          <li>
            <strong>Seek feedback:</strong> Treat each mock as real. Ask for
            honest critique on your answers, tone, and body language.
          </li>
          <li>
            <strong>Use AI tools:</strong> Try an AI mock‑interview platform for
            unlimited practice and instant analysis.
          </li>
        </ul>

        <p className="mt-4">
          By making mock interview practice a routine, you’ll gain confidence,
          reduce anxiety, and walk into your dream job interviews fully
          prepared.
        </p>

        {/* References */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
            References
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <li>
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/"
                target="_blank"
                rel="noreferrer"
                className="text-green-300 hover:text-green-200 underline"
              >
                pubmed.ncbi.nlm.nih.gov
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
                href="https://hbr.org/"
                target="_blank"
                rel="noreferrer"
                className="text-green-300 hover:text-green-200 underline"
              >
                hbr.org
              </a>
            </li>
          </ul>
        </div>
      </ArticleLayout>
    </div>
  );
}
