/* eslint-disable @typescript-eslint/no-explicit-any */
//Client-Side Render:
"use client";
//Imports:
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./formField";
import { useRouter } from "next/navigation";
import { ImSpinner8 } from "react-icons/im";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signup } from "@/lib/actions/auth.action";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

//For JWT:
import { generateToken } from "@/lib/otpTokenUtils";

//ShadCn Components:
import { Button } from "@/components/ui/button";
import { BackgroundGradientAnimation } from "../ui/background-gradient-animation";

//ShadCn Form Component:
const authFormSchema = (type: any) => {
  return z.object({
    name:
      type === "signup"
        ? z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name must be less than 50 characters")
        : z.string().optional(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z.string().min(3, "Password must be at least 3 characters"),
  });
};
const AuthForm = ({ type }: any) => {
  //Router To Navigate
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  //UseState Hook For Loading State:
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "signup") {
        setIsLoading(true);
        //Get The Values From The Form
        const { name, email, password } = values;
        //Using the signup method (OTP is now generated securely on server-side):
        const result = await signup({
          name: name!,
          email: email,
          password: password,
        });
        //If The Signup Failed
        if (!result?.success) {
          toast.error(result?.message);
          setIsLoading(false);
          return;
        }
        //Now Creating A Jwt Token With name and email
        const token = await generateToken({ name, email });
        //Response:
        setIsLoading(false);
        toast.success(
          "Successfully registered! Verify your email to login into the system. An OTP has been sent to your provided email."
        );
        router.push(`/verify/${token}`);
      } else {
        setIsLoading(true);
        //Values coming from zod
        const { email, password } = values;
        //Firebase In-Built Function For Auth
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await userCredential.user.getIdToken();
        //If Token Creation Failed
        if (!idToken) {
          toast.error("Sign-In Failed!");
          setIsLoading(false);
          return;
        }
        //Login Success
        const loggedInUser = await signIn({ email, idToken });
        //Check If It Was Failed
        if (!loggedInUser?.success) {
          toast.error(loggedInUser?.message);
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        toast.success("Successfully LoggedIn!");
        router.push("/home");
      }
    } catch (error: any) {
      console.error(error);
      setIsLoading(false);
      toast.error(
        `Something went wrong while performing the operation. Please try again later. (Error Code: ${error.code})`
      );
    }
  }
  // 3. Boolean to check the formType
  const isSignup = type === "signup";

  return (
    <BackgroundGradientAnimation className="w-full min-h-screen">
      <div className="flex flex-col min-h-screen px-6 py-8 relative z-10">
        {/* Header with Logo */}
        <div className="w-full mb-6 flex-shrink-0">
          <Link
            href={"/"}
            className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
          >
            {/* Logo */}
            <div
              className="w-12 h-12 bg-transparent rounded-lg"
              style={{
                backgroundImage: `url('/motif.svg')`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            {/* Title */}
            <div className="text-3xl font-bold text-green-500">BolAi</div>
          </Link>
        </div>
        {/* Main Content - Scrollable container */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-md mx-auto w-full pb-6">
            {/* Welcome Section */}
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                {isSignup ? "Create Your Account" : "Welcome Back"}
              </h1>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                {isSignup
                  ? "Start your interview preparation journey today"
                  : "Sign in to continue your interview preparation"}
              </p>
            </div>

            {/* The Form */}
            <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
              {/* Title And Description For The Form */}
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  {isSignup ? "Sign Up" : "Sign In"}
                </h2>
              </div>

              {/* Form Elements */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-4"
                >
                  {isSignup && (
                    <div className="[&_input]:!h-12 [&_label]:!text-gray-300 [&_label]:!font-medium">
                      <FormField
                        control={form.control}
                        name="name"
                        label="Full Name"
                        placeholder="Enter your full name"
                      />
                    </div>
                  )}
                  <div className="[&_input]:!h-12 [&_label]:!text-gray-300 [&_label]:!font-medium">
                    <FormField
                      control={form.control}
                      name="email"
                      label="Email Address"
                      type="email"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div className="relative">
                    <div className="[&_input]:!h-12 [&_label]:!text-gray-300 [&_label]:!font-medium [&_input]:!pr-12">
                      <FormField
                        control={form.control}
                        name="password"
                        label="Password"
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="* * * * * * * * * * * *"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute right-3 top-9 w-8 h-8 transition-all duration-200 flex justify-center items-center group"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      {isPasswordVisible ? (
                        <IoMdEyeOff className="text-lg text-gray-400 group-hover:text-white transition-colors duration-200" />
                      ) : (
                        <IoMdEye className="text-lg text-gray-400 group-hover:text-white transition-colors duration-200" />
                      )}
                    </button>
                  </div>
                  <div className="relative group pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="relative w-full h-12 bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 hover:from-green-600 hover:via-green-700 hover:to-emerald-800 hover:scale-97 text-white font-semibold rounded-lg transition-all duration-300 cursor-pointer shadow-xl border border-green-400/30 hover:border-green-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 z-10"
                    >
                      {/* Inner highlight */}
                      <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2 relative z-10">
                          <ImSpinner8 className="animate-spin" />
                          <span>
                            {isSignup ? "Creating Account..." : "Signing In..."}
                          </span>
                        </div>
                      ) : isSignup ? (
                        <span className="relative z-10">Create Account</span>
                      ) : (
                        <span className="relative z-10">Sign In</span>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>

              {/* The Link For Transition To Signup And Login */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  {isSignup
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <Link
                    href={isSignup ? "/login" : "/signup"}
                    className="text-green-500 hover:text-green-400 font-semibold transition-colors duration-200 hover:underline"
                  >
                    {isSignup ? "Sign In" : "Sign Up"}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
};

export default AuthForm;
