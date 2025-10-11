import Link from "next/link";

export type Blog = {
  slug: string;
  cover: string;
  title: string;
  excerpt?: string;
  date?: string | Date;
  readingTime: number;
  tags: string[];
};

type BlogCardProps = {
  blog: Blog;
};

const BlogCard = ({ blog }: BlogCardProps) => {
  const dateLabel = blog.date
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(blog.date))
    : null;

  return (
    <div className="group w-full md:w-[95%] lg:w-[28%] p-[1.5px] rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 transition-all duration-300 hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
      <Link
        href={`/blogs/${blog.slug}`}
        className="w-full h-full rounded-2xl bg-gray-900/95 hover:bg-gray-900 transition-all duration-200 ease-in-out p-4 flex flex-col gap-y-3 backdrop-blur-md"
      >
        {/* The Cover Image */}
        <div className="w-full rounded-xl mb-2 overflow-hidden">
          <div
            className="relative w-full aspect-[16/9] bg-center bg-cover will-change-transform transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            style={{
              backgroundImage: `url(${blog.cover})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Tags */}
          <div className="flex justify-center items-center flex-wrap gap-1.5 mb-2">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-[10px] tracking-wide uppercase bg-emerald-400/15 text-emerald-300 border border-emerald-300/20 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title and Excerpt */}
          <div className="flex-1 mb-3 px-1">
            <h3 className="text-white text-lg font-semibold line-clamp-2 text-center mb-2">
              {blog.title}
            </h3>

            {blog.excerpt && (
              <p className="text-gray-300/90 text-sm line-clamp-2 text-center">
                {blog.excerpt}
              </p>
            )}
          </div>

          {/* Date And Reading Time */}
          <div className="flex justify-center items-center mb-2 mt-auto">
            <span className="px-2 py-0.5 text-[10px] uppercase bg-orange-500/80 text-white rounded mr-2">
              {dateLabel}
            </span>
            <span className="px-2 py-0.5 text-[10px] uppercase bg-slate-500/80 text-white rounded">
              {blog.readingTime} min read
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
