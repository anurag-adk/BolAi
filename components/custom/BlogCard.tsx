import Link from "next/link";
import Image from "next/image";

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
      className="group relative w-full rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-colors flex flex-col overflow-hidden"
    >
      {/* Cover Photo*/}
      <div className="relative w-full aspect-[16/9]">
        <Image
          src={blog.cover}
          alt={blog.title}
          fill
          unoptimized
          className="object-cover"
           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] bg-black/60 text-gray-300 rounded">
          {blog.readingTime} min read
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] uppercase bg-green-900/25 text-green-300 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-white text-lg font-semibold mb-1 line-clamp-2">
          {blog.title}
        </h3>

        {blog.excerpt && (
          <p className="text-gray-300 text-sm line-clamp-3 mb-3">
            {blog.excerpt}
          </p>
        )}

        <div className="mt-auto flex justify-between text-xs text-gray-400">
          <span>{dateLabel}</span>
          <span>{blog.readingTime} min read</span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
