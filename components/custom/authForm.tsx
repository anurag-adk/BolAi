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
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "signup") {
        toast.success("Successfully Registered!");
        router.push("/login");
        console.log("Signed Up!", values);
      } else {
        toast.success("Successfully LoggedIn!");
        router.push("/");
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
    <div className="p-8 border-1 border-gray-200/25 rounded-2xl flex flex-col justify-center items-center w-[95%] lg:w-[30%] md:w-[55%] bg-black/25 lg:m-[2rem]">
      <div className="w-full flex flex-col justify-start items-center mb-4 p-2  rounded-2xl bg-transparent">
        <div className="w-full lg:w-[55%] flex justify-center items-center bg-transparent mb-2 lg:mb-0">
          <div className="w-[55%] h-[10vh] lg:h-[22vh] bg-transparent bg-motif mr-1"></div>
          <h2 className="text-4xl font-semibold text-green-500/70">BolAi</h2>
        </div>
        <h3 className="text-md md:text-2xl lg:text-[1.05rem] text-green-400/90">
          Speak. Practice. Succeed.
        </h3>
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
            className="hover:cursor-pointer bg-green-500/60 hover:bg-green-600 text-white transition-all ease-in-out duration-150 hover:scale-105 p-2 w-[85%] lg:w-[60%] h-[6.5vh]"
          >
            {isSignup ? "Create an account" : "Access the account"}
          </Button>
        </form>
      </Form>
      <div className="m-[1.5rem] w-[85%] flex justify-center items-center">
        <p className="text-center text-white text-sm lg:text-md mr-2">
          {isSignup ? "Have an account?" : "No account yet?"}
        </p>
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-bold text-sm lg:text-md text-blue-400 underline transition-all ease-in-out duration-150 hover:scale-110"
        >
          {isSignup ? "Sign In" : "Sign Up"}
        </Link>
      </div>
    </div>
  );
};

export default AuthForm;
