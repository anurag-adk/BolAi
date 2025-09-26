import { notFound } from "next/navigation";
import { blogs } from "@/constants/blogdata";
import ArticleLayout from "../Articlelayout";

export default function Page() {
  const slug = "friends-vs-formal-mock-interview";
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) return notFound();

  return (
    <div>
      <ArticleLayout blog={blog}>
        <p>
          Chatting through questions with friends is helpful, but it’s not the same as a real
          mock interview. A casual Q&amp;A lacks the stakes and expertise of a structured
          session. True mock interviews — with a career coach, professional mentor, or AI —
          include realistic pressure, objective feedback, and often industry‑specific questions.
        </p>

        <h2 className="text-xl font-semibold mt-6">Feedback quality</h2>
        <p>
          Friends may be well‑meaning but often lack hiring insight. They might say “Sounds
          good!” just to be nice. Career services and interview coaches know what employers look
          for. Many university career centers explicitly encourage students to meet with career
          coaches for interview practice. Coaches provide expert critique on your resume,
          answers, and demeanor — something friends usually can’t do.
        </p>

        <h2 className="text-xl font-semibold mt-6">Professional setting</h2>
        <p>
          A formal mock interview simulates a real interview environment. You dress
          professionally, use a quiet room or video call, and treat it as the real thing. That
          formality trains you to sit up straight, make eye contact, and manage nerves — a casual
          couch chat can’t replicate that pressure.
        </p>

        <h2 className="text-xl font-semibold mt-6">AI practice advantages</h2>
        <p>
          AI mock‑interview tools add structure and scale. They tailor questions to your field
          and analyze your responses. Many platforms act as “digital interview agents,” available
          24/7. Many support voice or video, so you practice speaking to a virtual interviewer
          without scheduling conflicts.
        </p>

        <h2 className="text-xl font-semibold mt-6">Missed opportunities vs. investment</h2>
        <p>
          Skipping structured practice can cost you offers. Investing in a mock interview (even a
          free career‑center session) pays off. It’s the difference between a few practice swings
          and a full batting‑cage session — the latter builds real skill. Many universities and
          some companies offer free mocks; paid platforms add advanced feedback. The opportunity
          cost of not practicing is usually higher than the price of a good mock.
        </p>

        <h2 className="text-xl font-semibold mt-6">Free vs. paid resources</h2>
        <p>
          Start free where possible: campus career centers often provide mock interviews and
          coaching. Professional organizations sometimes host mock‑interview days. Paid AI tools
          or private coaches are great for extra reps and deeper feedback. The key is structured,
          expert‑driven practice — not just casual conversation.
        </p>

        <h2 className="text-xl font-semibold mt-6">In short</h2>
        <p>
          Friends can quiz you, but only a structured mock interview builds true readiness: real
          feedback, realistic pressure, and personalized guidance. Combine professional coaching
          (or AI tools) with self‑prep to cover all bases — so when it counts, you’ll think fast
          and answer clearly.
        </p>

        <h2 className="text-xl font-semibold mt-6">Key Takeaways</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Use career services:</strong> Schedule at least one mock interview with a campus coach or mentor — often free and invaluable.</li>
          <li><strong>Try AI tools:</strong> Use an AI mock‑interview app for extra practice (many offer free trials).</li>
          <li><strong>Balance approaches:</strong> Mix informal practice (friends/mirror) with formal mocks to hone professionalism.</li>
          <li><strong>Commit to feedback:</strong> After every session, ask for honest critique and track patterns to improve.</li>
          <li><strong>Treat it seriously:</strong> Dress up, remove distractions, and deliver your best — even for “mock” interviews.</li>
        </ul>

        {/* References */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">References</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <li><a href="https://careerservices.cns.utexas.edu/" target="_blank" rel="noreferrer" className="text-green-300 hover:text-green-200 underline">careerservices.cns.utexas.edu</a></li>
            <li><a href="https://www.youtube.com/" target="_blank" rel="noreferrer" className="text-green-300 hover:text-green-200 underline">youtube.com</a></li>
            <li><a href="https://www.workitdaily.com/" target="_blank" rel="noreferrer" className="text-green-300 hover:text-green-200 underline">workitdaily.com</a></li>
          </ul>
        </div>
      </ArticleLayout>
    </div>
  );
}
