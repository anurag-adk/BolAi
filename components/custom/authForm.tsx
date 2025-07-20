/* eslint-disable @typescript-eslint/no-explicit-any */

//Client-Side Render:
"use client";

//Imports:
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./formField";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signup } from "@/lib/actions/auth.action";

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

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "signup") {
        //Get The Values From The Form
        const { name, email, password } = values;
        //Using The Firebase In-Built Function
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        //Using the signup method
        const result = await signup({
          uid: userCredentials.user.uid,
          name: name!,
          email: email,
          password: password,
        });
        //If The Signup Failed
        if (!result?.success) {
          toast.error(result?.message);
          return;
        }
        toast.success("Successfully Registered! Redirecting To Login Page!");
        router.push("/login");
        console.log("Signed Up!", values);
      } else {
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
          return;
        }
        //Login Success
        const loggedInUser = await signIn({ email, idToken });
        //Check If It Was Failed
        if (!loggedInUser?.success) {
          toast.error(loggedInUser?.message);
          return;
        }
        toast.success("Successfully LoggedIn!");
        router.push("/home");
        console.log("Signed In!", values);
      }
    } catch (error) {
      console.error(error);
      toast.error(`There was an error ${error}`);
    }
  }

  // 3. Boolean to check the formType
  const isSignup = type === "signup";

  return (
    <div className="w-full bg-black/25 flex flex-col justify-start items-center">
      <div className="w-[95%] lg:w-[30%] md:w-[75%] mb-[2rem] lg:mb-[1.5rem] flex flex-col justify-evenly items-center">
        {/* Back To Home Button */}
        <Link
          className="w-[55%] p-2 hover:cursor-pointer hover:text-green-400/90 flex justify-center items-center mt-[2rem] hover:underline"
          href={"/"}
        >
          <FaArrowLeft className="text-md font-semibold text-gray-300/70 mr-6 hover:text-green-400/90" />
          <div className="text-md sm:text-lg lg:text-md text-gray-300/70 hover:text-green-400/90">
            Back to Home
          </div>
        </Link>
        {/* Logo and Title */}
        <div className="w-[55%] flex justify-center items-center p-2 mb-2">
          {/* Logo */}
          <div
            className="w-[45%] h-[15vh] bg-transparent mr-2"
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
          <div className="text-sm md:text-lg lg:text-sm text-gray-200 text-center">
            {isSignup
              ? "Start your interview preparation journey today"
              : "Sign in to continue your interview preparation"}
          </div>
        </div>
      </div>
      <div className="p-8 border-1 border-gray-200/25 rounded-2xl w-[95%] lg:w-[30%] md:w-[75%] bg-gray-900 flex flex-col justify-center items-center mb-6">
        <div className="w-full flex flex-col justify-evenly items-center mb-[2rem]">
          <div className="text-2xl md:text-3xl lg:text-2xl font-bold text-white mb-[1rem]">
            {isSignup ? "Sign Up" : "Sign In"}
          </div>
          <div className="text-sm md:text-lg lg:text-sm text-white text-center">
            {isSignup
              ? "Create your account to get started with BolAi"
              : "Enter your email and password to access your account"}
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            {isSignup ? (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
              />
            ) : (
              <></>
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="Your Email Address"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Your Password"
            />
            <Button
              type="submit"
              className="hover:cursor-pointer bg-green-500/60 hover:bg-green-600 text-white md:text-xl lg:text-sm transition-all ease-in-out duration-150 hover:scale-105 p-2 w-[85%] lg:w-[60%] h-[7.5vh] md:h-[6.5vh]"
            >
              {isSignup ? "Create an account" : "Access the account"}
            </Button>
          </form>
        </Form>
        <div className="m-[1.5rem] w-[85%] flex justify-center items-center">
          <p className="text-center text-white text-sm md:text-lg lg:text-sm mr-2">
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
