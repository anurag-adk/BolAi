import Image from "next/image";
import Link from "next/link";
import type { Blog } from "@/components/custom/BlogCard";

type ArticleLayoutProps = {
  blog: Blog;
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
};

export default function ArticleLayout({
  blog,
  children,
  backHref = "/blogs",
  backLabel = "Back to blogs",
}: ArticleLayoutProps) {
  const dateLabel = blog.date
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(blog.date))
    : null;

  return (
    <div className="bg-gray-900 mt-6 flex flex-col justify-start items-start">
      <article className="max-w-3xl mx-auto p-4 md:p-6 lg:p-4 text-gray-200 flex flex-col justify-start items-start gap-y-4 text-justify">
        {/* Back link  */}
        <Link
          href={backHref}
          className="mb-4 inline-flex items-center text-sm md:text-base font-medium text-gray-300 hover:text-green-300 transition-colors group mt-4 hover:underline p-4 bg-green-500/30 rounded-md"
        >
          <span className="mr-2 h-6 w-6 rounded-full bg-green-600/30 border border-green-500/40 flex items-center justify-center group-hover:bg-green-600/60 group-hover:scale-95 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-green-300"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </span>
          {backLabel}
        </Link>
        {/* Blog Title */}
        <h1 className="text-3xl font-bold mb-2 mt-2">{blog.title}</h1>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[12px] md:text-[14px] lg:text-[10px] uppercase bg-green-900/25 text-green-300 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* Date And Time */}
        <div className="flex justify-start items-center text-gray-400 text-sm mb-4">
          {dateLabel && <span className="mr-4">{dateLabel}</span>}
          <span>{blog.readingTime} min read</span>
        </div>
        {/* Blog Pictures */}
        <div className="relative w-full aspect-[16/9] mb-6">
          <Image
            src={blog.cover}
            alt={blog.title}
            fill
            unoptimized
            className="object-cover rounded"
          />
        </div>
        {/* The Blog Content */}
        <div className="text-gray-300 space-y-4">{children}</div>
        {/* Copyright */}
        <div className="w-full flex justify-center items-center mt-4 mb-2">
          <div className="text-sm text-white">
            {" "}
            &copy; 2025 BolAi. Blogs are contributed for educational and
            informational purposes only. All rights reserved.
          </div>
        </div>
      </article>
    </div>
  );
}
