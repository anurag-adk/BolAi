"use client";

//React Components:
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getCurrentUser, clearSessionCookie } from "@/lib/actions/auth.action";
import {
  AiOutlineBarChart,
  AiOutlineMessage,
  AiOutlineHistory,
  AiOutlineRobot,
  AiOutlineQuestionCircle,
  AiOutlineBook,
  AiOutlineUser,
  AiOutlineCreditCard,
  AiOutlineThunderbolt,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";

// ShadCn Component
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

//For Navigation
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";

interface User {
  id: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

const Sidebar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  //Constant for routing:
  const pathname = usePathname();

  // Refs for scroll automation
  const navRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // Auto-scroll to active item when pathname changes
  useEffect(() => {
    const activeRef = navRefs.current[pathname];
    if (activeRef && scrollContainerRef.current) {
      setTimeout(() => {
        activeRef.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 100); // Small delay to ensure DOM is updated
    }
  }, [pathname]);

  // Function to set refs for navigation items
  const setNavRef = (path: string) => (el: HTMLAnchorElement | null) => {
    navRefs.current[path] = el;
  };

  // Get user initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Sidebar content component
  const SidebarContent = () => {
    //Function For Logging Out:
    const logout = async () => {
      await clearSessionCookie();
      toast.success("Successfully logged out!");
      redirect("/");
    };

    return (
      <>
        {/* Logo and Title */}
        <div className="p-6 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <div
                className="w-10 h-10"
                style={{
                  backgroundImage: `url('/motif.png')`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              ></div>
              {/* Title */}
              <div className="text-2xl font-bold text-green-500">BolAi</div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={closeMobileMenu}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <AiOutlineClose className="text-xl" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar"
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Navigation Menu */}
          <nav className="p-4">
            <div className="space-y-2">
              {/* Interview Prep Section */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Interview Prep
                </h3>
                <div className="space-y-1">
                  {/* My Feedbacks Tab */}
                  <Link
                    ref={setNavRef("/home")}
                    href="/home"
                    className={`flex items-center rounded-md transition-all duration-300 ease-in-out ${
                      pathname === "/home"
                        ? "text-white bg-gradient-to-r from-green-500/50 via-teal-500/50 to-emerald-500/50 py-2 px-3 mb-2 hover:from-green-600/80 hover:via-teal-600/80 hover:to-emerald-600/80 shadow-sm shadow-teal-400/50 scale-105"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 hover:scale-102"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <AiOutlineBarChart className="mr-3 text-lg" />
                    My Feedbacks
                  </Link>

                  {/* Generate Interview */}
                  <Link
                    ref={setNavRef("/interview")}
                    href="/interview"
                    className={`flex items-center rounded-md transition-all duration-300 ease-in-out ${
                      pathname === "/interview"
                        ? "text-white bg-gradient-to-r from-green-500/50 via-teal-500/50 to-emerald-500/50 py-2 px-3 mb-2 hover:from-green-600/80 hover:via-teal-600/80 hover:to-emerald-600/80 shadow-sm shadow-teal-400/50 scale-105"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 hover:scale-102"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <AiOutlineMessage className="mr-3 text-lg" />
                    Generate Interview
                  </Link>

                  {/* My Interviews */}
                  <Link
                    ref={setNavRef("/my-interviews")}
                    href="/my-interviews"
                    className={`flex items-center rounded-md transition-all duration-300 ease-in-out ${
                      pathname === "/my-interviews"
                        ? "text-white bg-gradient-to-r from-green-500/50 via-teal-500/50 to-emerald-500/50 py-2 px-3 mb-2 hover:from-green-600/80 hover:via-teal-600/80 hover:to-emerald-600/80 shadow-sm shadow-teal-400/50 scale-105"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 hover:scale-102"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <AiOutlineHistory className="mr-3 text-lg" />
                    My Interviews
                  </Link>

                  {/* Interview Hub */}
                  <Link
                    ref={setNavRef("/interviewHub")}
                    href="/interviewHub"
                    className={`flex items-center rounded-md transition-all duration-300 ease-in-out ${
                      pathname === "/interviewHub"
                        ? "text-white bg-gradient-to-r from-green-500/50 via-teal-500/50 to-emerald-500/50 py-2 px-3 mb-2 hover:from-green-600/80 hover:via-teal-600/80 hover:to-emerald-600/80 shadow-sm shadow-teal-400/50 scale-105"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 hover:scale-102"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <AiOutlineRobot className="mr-3 text-lg" />
                    Interview Hub
                  </Link>
                </div>
              </div>

              {/* Learning Center Section */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Learning Center
                </h3>
                <div className="space-y-1">
                  {/* Get Started */}
                  <Link
                    ref={setNavRef("/get-started")}
                    href="/get-started"
                    className={`flex items-center rounded-md transition-all duration-300 ease-in-out ${
                      pathname === "/get-started"
                        ? "text-white bg-gradient-to-r from-green-500/50 via-teal-500/50 to-emerald-500/50 py-2 px-3 mb-2 hover:from-green-600/80 hover:via-teal-600/80 hover:to-emerald-600/80 shadow-sm shadow-teal-400/50 scale-105"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 hover:scale-102"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <AiOutlineQuestionCircle className="mr-3 text-lg" />
                    Get Started
                  </Link>

                  {/* Blogs */}
                  <Link
                    ref={setNavRef("/blogs")}
                    href="/blogs"
                    className={`flex items-center rounded-md transition-all duration-300 ease-in-out ${
                      pathname === "/blogs"
                        ? "text-white bg-gradient-to-r from-green-500/50 via-teal-500/50 to-emerald-500/50 py-2 px-3 mb-2 hover:from-green-600/80 hover:via-teal-600/80 hover:to-emerald-600/80 shadow-sm shadow-teal-400/50 scale-105"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 hover:scale-102"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <AiOutlineBook className="mr-3 text-lg" />
                    Blogs
                  </Link>
                </div>
              </div>

              {/* Account Section */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Account
                </h3>
                <div className="space-y-1">
                  {/* My Profile */}
                  <Link
                    ref={setNavRef("/profile")}
                    href="/profile"
                    className={`flex items-center rounded-md transition-all duration-300 ease-in-out ${
                      pathname === "/profile"
                        ? "text-white bg-gradient-to-r from-green-500/50 via-teal-500/50 to-emerald-500/50 py-2 px-3 mb-2 hover:from-green-600/80 hover:via-teal-600/80 hover:to-emerald-600/80 shadow-sm shadow-teal-400/50 scale-105"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 hover:scale-102"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <AiOutlineUser className="mr-3 text-lg" />
                    My Profile
                  </Link>

                  {/* Subscription */}
                  <Link
                    ref={setNavRef("/subscription")}
                    href="/subscription"
                    className={`flex items-center rounded-md transition-all duration-300 ease-in-out ${
                      pathname === "/subscription"
                        ? "text-white bg-gradient-to-r from-green-500/50 via-teal-500/50 to-emerald-500/50 py-2 px-3 mb-2 hover:from-green-600/80 hover:via-teal-600/80 hover:to-emerald-600/80 shadow-sm shadow-teal-400/50 scale-105"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 hover:scale-102"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <AiOutlineCreditCard className="mr-3 text-lg" />
                    Subscription
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Free Plan Card */}
        <div className="p-4 flex-shrink-0">
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <AiOutlineThunderbolt className="mr-3 text-lg" />
              <span className="text-sm font-semibold text-white">
                Free Plan
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              Upgrade to access more interview credits & powerful features!
            </p>
            <Link href="/subscription" onClick={closeMobileMenu}>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors">
                Upgrade
              </button>
            </Link>
          </div>
        </div>

        {/* User Profile Section */}
        <AlertDialog>
          {/* The content being rendered using anurag's previous div */}
          <AlertDialogTrigger className="hover:cursor-pointer transition-all ease-in-out duration-150 hover:bg-gray-700/40">
            <div className="p-4 border-t border-gray-700 flex-shrink-0 flex justify-start items-center">
              <div className="flex justify-start items-center space-x-3">
                {user?.profilePic ? (
                  <div
                    className="w-8 h-8 rounded-full ml-2"
                    style={{
                      backgroundImage: `url(${user.profilePic})`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                    }}
                  ></div>
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center ml-2">
                    <span className="text-sm font-medium text-white">
                      {user?.name ? getInitials(user.name) : "U"}
                    </span>
                  </div>
                )}
                <div className="flex-1 ml-2 flex flex-col justify-start items-start">
                  <p className="text-sm font-medium text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400">Free Plan</p>
                </div>
              </div>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50">
            {/* Header Of Alert */}
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout? You will be signed out of your
                account, but your data will remain safe.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {/* Footer Of Alert */}
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-green-500/80 text-white hover:bg-green-500 hover:cursor-pointer"
                onClick={() => logout()}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  };

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="md:hidden bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div
              className="w-8 h-8"
              style={{
                backgroundImage: `url('/motif.png')`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></div>
            {/* Title */}
            <div className="text-xl font-bold text-green-500">BolAi</div>
          </div>
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="text-gray-400 hover:text-white p-2"
          >
            <AiOutlineMenu className="text-xl" />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 lg:w-72 bg-gray-800 border-r border-gray-700 flex-col h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={closeMobileMenu}
          ></div>
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 lg:w-72 bg-gray-800 border-r border-gray-700 flex flex-col">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
