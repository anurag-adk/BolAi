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
    <div className="w-full md:w-[95%] lg:w-[28%] aspect-square p-[1px] rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 transition-all duration-300">
      <Link
        href={`/blogs/${blog.slug}`}
        className="w-full h-full rounded-2xl bg-gray-900 hover:bg-gray-800 transition-all duration-150 ease-in-out hover:scale-[0.98] p-4 flex flex-col gap-y-2"
      >
        {/* The Cover Image */}
        <div
          className="w-full h-[28vh] rounded-md mb-3"
          style={{
            backgroundImage: `url(${blog.cover})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Tags */}
          <div className="flex justify-center items-center flex-wrap gap-1 mb-3">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs uppercase bg-green-900/25 text-green-300 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title and Excerpt */}
          <div className="flex-1 mb-3">
            <h3 className="text-white text-base font-semibold line-clamp-2 text-center mb-2">
              {blog.title}
            </h3>

            {blog.excerpt && (
              <p className="text-gray-300 text-sm line-clamp-2 text-center">
                {blog.excerpt}
              </p>
            )}
          </div>

          {/* Date And Reading Time */}
          <div className="flex justify-center items-center mb-2 mt-auto">
            <span className="px-2 py-0.5 text-xs uppercase bg-orange-400/75 text-white rounded mr-2">
              {dateLabel}
            </span>
            <span className="px-2 py-0.5 text-xs uppercase bg-slate-400/75 text-white rounded">
              {blog.readingTime} min read
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
