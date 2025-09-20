import BlogCard from "@/components/custom/BlogCard";
import Sidebar from "@/components/custom/Sidebar";
import { blogs } from "@/constants/blogdata";


const BlogPage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 text-gray-200">
        <h1 className="text-xl font-semibold mb-4">Blogs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <BlogCard key={b.slug} blog={b} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
