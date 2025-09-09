/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, updateUserProfile } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineCalendar,
  AiOutlineEdit,
  AiOutlineSave,
  AiOutlineClose,
  AiOutlineCamera,
} from "react-icons/ai";
import { ImSpinner8 } from "react-icons/im";

//ShadCn Component:
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

interface User {
  id: string;
  name?: string;
  email?: string;
  createdAt?: string;
  profilePic?: string;
  [key: string]: unknown;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser as User);
        setName(user?.name!);
        console.log(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [mounted, user?.name]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setName(user?.name!);
    setProfilePicUrl(user?.profilePic!);
    setEditing(false);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    // Call The Save Action:
    const data = await updateUserProfile({
      id: user?.id!,
      name: name || user?.name!,
      profilePic: profilePic!,
    });
    //If Save Failed:
    if (!data.success) {
      setSaveLoading(false);
      setEditing(false);
      return toast.error(data.message);
    }
    //Success:
    toast.success(data.message);
    console.log("Saving user data:");
    setSaveLoading(false);
    setEditing(false);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Unknown";
    }
  };

  const handleProfilePic = () => {
    console.log(profilePic);
    if (!profilePic || !(profilePic instanceof File)) {
      return toast.error("Please select a profile picture before uploading.");
    }
    if (profilePic.size > 5 * 1024 * 1024) {
      return toast.error("File size exceeds 5MB.");
    }
    setProfilePicUrl(URL.createObjectURL(profilePic));
    setOpen(false);
    setEditing(true);
  };

  if (!mounted || loading) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center px-5">
        <div className="text-white text-lg">Loading profile...</div>
      </div>
    );
  }

  const renderImageUrl = profilePicUrl || user?.profilePic! || null;

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center py-4 px-5 md:pt-4 pt-0">
      {/* Profile Header */}
      <div className="w-[95%] md:w-[95%] lg:w-[90%] bg-gray-900/80 rounded-md p-6 mb-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Avatar */}
          <AlertDialog open={open} onOpenChange={setOpen}>
            {/* The Trigger For The Dialog */}
            <AlertDialogTrigger asChild>
              <div className="relative hover:cursor-pointer">
                <div
                  className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg"
                  style={
                    renderImageUrl
                      ? {
                          backgroundImage: `url(${renderImageUrl})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                        }
                      : {}
                  }
                >
                  {!renderImageUrl && getInitials(user?.name)}
                </div>
                <button className="absolute bottom-2 right-2 bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-colors">
                  <AiOutlineCamera className="text-white text-lg" />
                </button>
              </div>
            </AlertDialogTrigger>
            {/* The Content For The Dialog */}
            <AlertDialogContent>
              {/* The title and description */}
              <AlertDialogHeader>
                <AlertDialogTitle>Change Profile Picture</AlertDialogTitle>
                <AlertDialogDescription>
                  Select a new image to update your profile picture. Supported
                  formats: JPG, PNG. Max size: 5MB.
                </AlertDialogDescription>
              </AlertDialogHeader>
              {/* Section For The Input */}
              <div className="w-[95%] py-2 flex justify-center items-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
                  placeholder="Choose the image"
                  className="font-bold text-green-600 text-sm text-center hover:cursor-pointer transition-all ease-in-out duration-150 hover:ring-2 hover:ring-green-600"
                />
              </div>
              {/* The Action Buttons */}
              <AlertDialogFooter>
                <AlertDialogCancel className="hover:cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleProfilePic()}
                  className="bg-green-600/90 text-white text-center hover:bg-green-500/90 hover:cursor-pointer"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl lg:text-3xl text-white font-semibold">
                {user?.name || "User"}
              </h1>
              {!editing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors self-center md:self-start"
                >
                  <AiOutlineEdit className="text-xl text-white" />
                </button>
              )}
            </div>
            <p className="text-md md:text-lg lg:text-md text-white mb-2">
              {user?.email}
            </p>
            <p className="text-gray-400 text-sm">
              Member since {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="w-[95%] md:w-[95%] lg:w-[90%] bg-gray-900/80 rounded-md p-6 mb-4">
        {/* Section For Showing The Save And Cancel Button If Pressed Edit */}
        <div className="flex items-center justify-between mb-4 md:mb-6 lg:mb-4">
          <h2 className="text-2xl md:text-3xl lg:text-2xl font-semibold text-white">
            Profile Information
          </h2>
          {editing && (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors hover:cursor-pointer"
              >
                {saveLoading ? (
                  <ImSpinner8 className="text-lg" />
                ) : (
                  <>
                    <AiOutlineSave className="text-lg" /> Save
                  </>
                )}
              </Button>
              <Button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                <AiOutlineClose className="text-lg" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Section For Inputs   */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-white flex items-center gap-2"
            >
              <AiOutlineUser className="text-lg" />
              Full Name
            </Label>
            {editing ? (
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:border-green-500"
                placeholder="Enter your full name"
              />
            ) : (
              <div className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white">
                {user?.name || "Not provided"}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-white flex items-center gap-2"
            >
              <AiOutlineMail className="text-lg" />
              Email Address
            </Label>
            {editing ? (
              <Input id="email" type="email" value={user?.email} disabled />
            ) : (
              <div className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white">
                {user?.email || "Not provided"}
              </div>
            )}
          </div>

          {/* Member Since */}
          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <AiOutlineCalendar className="text-lg" />
              Member Since
            </Label>
            <div className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white">
              {formatDate(user?.createdAt)}
            </div>
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <AiOutlineUser className="text-lg" />
              Account Type
            </Label>
            <div className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white">
              Free Plan {/* REMAINING: hardcoded for now*/}
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        {/* REMAINING: Data are all hardcoded yesko ni logic baki xa */}
        <div className="mt-8 pt-6 border-t border-gray-700 mb-4">
          <h3 className="text-2xl md:text-3xl lg:text-2xl font-semibold text-white mb-4 md:mb-6 lg:mb-4">
            Interview Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">0</div>
              <div className="text-gray-300 text-sm">Interviews Completed</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">0</div>
              <div className="text-gray-300 text-sm">Hours Practiced</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">0</div>
              <div className="text-gray-300 text-sm">Skills Improved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
