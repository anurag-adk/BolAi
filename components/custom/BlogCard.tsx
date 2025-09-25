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
    <Link
      href={`/blogs/${blog.slug}`}
      className="w-full md:w-[95%] h-[58vh] md:h-[52vh] lg:w-[30%] lg:h-[58vh] rounded-lg bg-black/60 hover:bg-gray-800 transition-all duration-150 ease-in-out aspect-square flex flex-col justify-start items-start gap-y-2 hover:scale-105 shadow-lg shadow-green-500/60 hover:shadow-none"
    >
      {/* The Cover Image */}
      <div
        className="w-full h-7/15 rounded-t-md"
        style={{
          backgroundImage: `url(${blog.cover})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* Tags, Content & Date-Time */}
      <div className="w-full flex flex-col justify-evenly items-center gap-y-1.5">
        {/* Tags */}
        <div className="w-full flex justify-center items-center flex-wrap gap-x-1">
          {blog.tags.map((tag) => (
            <div
              key={tag}
              className="px-2 py-0.5 text-[12px] md:text-[14px] lg:text-[10px] uppercase bg-green-900/25 text-green-300 rounded mb-1"
            >
              {tag}
            </div>
          ))}
        </div>
        {/* Content */}
        <div className="w-full flex flex-col flex-1 p-4 gap-y-2">
          <h3 className="text-white text-md font-semibold line-clamp-2 text-center text-lg md:text-xl lg:text-sm">
            {blog.title}
          </h3>

          {blog.excerpt && (
            <p className="text-gray-300 text-md md:text-lg lg:text-sm line-clamp-2 text-justify md:text-center lg:text-justify p-0.5">
              {blog.excerpt}
            </p>
          )}
        </div>
        {/* Date And Time */}
        <div className="w-full flex flex-row justify-center items-center p-1 mb-2">
          {/* Date */}
          <div className="px-2 py-0.5 text-[12px] md:text-[14px] lg:text-[10px] uppercase bg-orange-400/75 text-white rounded mr-2">
            {dateLabel}
          </div>
          {/* Time */}
          <div className="px-2 py-0.5 text-[12px] md:text-[14px] lg:text-[10px] uppercase bg-slate-400/75 text-white rounded">
            {blog.readingTime} min read
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
