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
import { FaArrowLeft } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signup } from "@/lib/actions/auth.action";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

//For Otp And JWT:
import { generateOtp, generateToken } from "@/lib/otpTokenUtils";

//ShadCn Components:
import { Button } from "@/components/ui/button";

//ShadCn Form Component:
const authFormSchema = (type: any) => {
  return z.object({
    name: type === "signup" ? z.string().min(2).max(50) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
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
        //Creating The Otp Value:
        const otp = await generateOtp();
        //Using the signup method:
        const result = await signup({
          name: name!,
          email: email,
          password: password,
          otp: otp,
        });
        //If The Signup Failed
        if (!result?.success) {
          toast.error(result?.message);
          setIsLoading(false);
          return;
        }
        //Now Creating A Jwt Token With name, email and otp
        const token = await generateToken({ name, email });
        //Response:
        setIsLoading(false);
        toast.success(
          "Successfully registered! Verify your email to login into the system. An OTP has been sent to your provided email."
        );
        router.push(`/verify/${token}`);
        console.log("Signed Up!", values);
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
        console.log("Signed In!", values);
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
    <div className="w-full bg-black/25 flex flex-col justify-start items-center">
      {/* The Title, Back To Home And Other Elements */}
      <div className="w-[95%] lg:w-[30%] md:w-[75%] mb-[2rem] lg:mb-[1.5rem] flex flex-col justify-evenly items-center">
        {/* Back To Home Button */}
        <Link
          className="w-[55%] p-2 hover:cursor-pointer hover:text-green-400/90 flex justify-center items-center mt-[2rem] hover:underline mb-2"
          href={"/"}
        >
          <FaArrowLeft className="text-md font-semibold text-gray-300/70 mr-6 hover:text-green-400/90" />
          <div className="text-md md:text-xl lg:text-md text-gray-300/70 hover:text-green-400/90">
            Back to Home
          </div>
        </Link>
        {/* Logo and Title */}
        <div className="w-[55%] flex justify-center items-center p-2 mb-[2rem]">
          {/* Logo */}
          <div
            className="w-[45%] h-20 md:h-32 lg:h-22 bg-transparent mr-2"
            style={{
              backgroundImage: `url('/motif.png')`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          {/* Title */}
          <div className="text-4xl font-bold text-green-600">BolAi</div>
        </div>
        {/* Text and Description */}
        <div className="w-[95%] lg:w-[75%] flex flex-col justify-around items-center">
          <div className="text-2xl md:text-3xl lg:text-2xl font-bold text-white mb-2">
            {isSignup ? "Create your account" : "Welcome back"}
          </div>
          <div className="text-sm md:text-xl lg:text-sm text-gray-200 text-center">
            {isSignup
              ? "Start your interview preparation journey today"
              : "Sign in to continue your interview preparation"}
          </div>
        </div>
      </div>
      {/* The Form */}
      <div className="p-8 border-1 border-gray-200/25 rounded-2xl w-[95%] lg:w-[30%] md:w-[75%] bg-gray-900 flex flex-col justify-center items-center mb-6">
        {/* Title And Description For The Form */}
        <div className="w-full flex flex-col justify-evenly items-center mb-[2rem]">
          <div className="text-2xl md:text-3xl lg:text-2xl font-bold text-white mb-[1rem]">
            {isSignup ? "Sign Up" : "Sign In"}
          </div>
          <div className="text-sm md:text-xl lg:text-sm text-white text-center">
            {isSignup
              ? "Create your account to get started with BolAi"
              : "Enter your email and password to access your account"}
          </div>
        </div>
        {/* Form Elements */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            {isSignup ? (
              <div className="[&_input]:!h-12 [&_input]:md:!h-14 [&_input]:lg:!h-12 [&_textarea]:!h-12 [&_textarea]:md:!h-14 [&_textarea]:lg:!h-12 [&_.form-control]:!h-12 [&_.form-control]:md:!h-14 [&_.form-control]:lg:!h-12">
                <FormField
                  control={form.control}
                  name="name"
                  label="Name"
                  placeholder="Your Name"
                />
              </div>
            ) : (
              <></>
            )}
            <div className="[&_input]:!h-12 [&_input]:md:!h-14 [&_input]:lg:!h-12 [&_textarea]:!h-12 [&_textarea]:md:!h-14 [&_textarea]:lg:!h-12 [&_.form-control]:!h-12 [&_.form-control]:md:!h-14 [&_.form-control]:lg:!h-12">
              <FormField
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="Your Email Address"
              />
            </div>
            <div className="w-full flex justify-around items-center">
              <div className="w-[85%] [&_input]:!h-12 [&_input]:md:!h-14 [&_input]:lg:!h-12 [&_textarea]:!h-12 [&_textarea]:md:!h-14 [&_textarea]:lg:!h-12 [&_.form-control]:!h-12 [&_.form-control]:md:!h-14 [&_.form-control]:lg:!h-12">
                <FormField
                  control={form.control}
                  name="password"
                  label="Password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Your Password"
                />
              </div>
              <div
                className="ml-2 w-[13%] md:ml-1 md:w-[12%] lg:w-[10%] h-12 md:h-14 lg:h-12 bg-white rounded-md mt-6 transition-all ease-in-out duration-150 hover:cursor-pointer hover:scale-110 flex justify-center items-center"
                onClick={() => {
                  setIsPasswordVisible(!isPasswordVisible);
                }}
              >
                {isPasswordVisible ? (
                  <IoMdEyeOff className="text-3xl lg:text-2xl md:text-5xl font-semibold text-gray-900/80" />
                ) : (
                  <IoMdEye className="text-3xl lg:text-2xl md:text-5xl font-semibold text-gray-900/80" />
                )}
              </div>
            </div>
            <Button
              type="submit"
              className="hover:cursor-pointer bg-green-500/60 hover:bg-green-600 text-white text-md md:text-2xl lg:text-sm transition-all ease-in-out duration-150 hover:scale-105 p-2 w-[85%] lg:w-[60%] h-12 md:h-18 lg:h-12"
            >
              {isLoading ? (
                <ImSpinner8 className="transition-all ease-in-out duration-150 animate-spin" />
              ) : isSignup ? (
                "Create an account"
              ) : (
                "Access the account"
              )}
            </Button>
          </form>
        </Form>
        {/* The Link For Transition To Signup And Login */}
        <div className="m-[1.5rem] w-[85%] flex justify-center items-center mb-[1.5rem] text-md md:text-xl lg:text-sm">
          <p className="text-center text-white mr-2">
            {isSignup ? "Have an account?" : "No account yet?"}
          </p>
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-bold text-sm md:text-lg lg:text-sm text-blue-400 underline transition-all ease-in-out duration-150 hover:scale-110"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
