//Imports:
import BlogCard from "@/components/custom/BlogCard";
import { blogs } from "@/constants/blogdata";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { BackgroundLines } from "@/components/ui/background-lines";

const BlogPage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center p-2 bg-gray-900 gap-y-10">
      {/* Banner And CTA */}
      <BackgroundLines className="w-[95%] md:w-[98%] lg:w-[90%] h-[38vh] md:h-[38vh] lg:h-[40vh] mt-6">
        <div className="w-full h-full bg-transparent rounded-md flex flex-col justify-start items-start md:flex-row md:justify-between md:items-center lg:flex-row lg:justify-between lg:items-center mb-4">
          {/* Banner Actions */}
          <div className="w-full lg:w-[55%] md:w-[58%] flex flex-col justify-center items-start lg:items-start md:items-start p-6 mt-2">
            {/* Title */}
            <div className="text-2xl md:text-4xl lg:text-3xl text-white font-semibold mb-4">
              Learn, Grow, and Get Inspired with Our Community Blogs
            </div>
            {/* SubText */}
            <div className="text-md md:text-xl lg:text-md text-white mb-6">
              Read blogs sharing experiences and fresh perspectives.
            </div>
            {/* CTA Button */}
            <Link
              href="/home"
              className="w-[55%] md:w-[58%] md:p-2 lg:w-[28%] h-[8.5vh] md:h-[6.8vh] lg:h-[6.85vh] rounded-md hover:cursor-pointer transition-all ease-in-out duration-150 hover:scale-105 bg-green-500/80 hover:bg-green-400/80 mb-1 flex justify-center items-center"
            >
              <FaHome className="mr-2 text-2xl md:text-3xl lg:text-xl" />
              <div className="text-xl md:text-3xl lg:text-lg text-white">
                Home
              </div>
            </Link>
          </div>
          {/* Banner Image */}
          <div
            className="max-sm:hidden md:w-[40%] md:h-[32vh] lg:w-[35%] lg:h-[34vh]"
            style={{
              backgroundImage: `url(/blogPage.svg)`,
              backgroundPosition: "center center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
      </BackgroundLines>

      {/* Display The Blogs Card */}
      <div className="w-full lg:w-[98%] p-4 flex flex-col md:flex-col justify-start items-center md:justify-start md:items-center lg:flex-row lg:justify-center lg:items-center lg:flex-wrap gap-x-8 gap-y-10 overflow-hidden mb-2 bg-transparent">
        {blogs.map((b) => (
          <BlogCard key={b.slug} blog={b} />
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
