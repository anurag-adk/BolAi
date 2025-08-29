/* eslint-disable react/no-unescaped-entities */
//Client Side Rendering:
"use client";
//Use State Hook:
import { useState } from "react";
//Use Params Hook:
import { useParams } from "next/navigation";
//ShadCn Component:
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
//For Link:
import Link from "next/link";
import { useRouter } from "next/navigation";
//Icons:
import { FaArrowLeft } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { checkAndVerify, regenerateToken } from "@/lib/otpTokenUtils";

export default function VerifyPage() {
  const params = useParams();
  const token = params.token as string;
  const [otpValue, setOtpValue] = useState("");
  const [isResendClicked, setIsResendClicked] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const emailRegex =
    /^(?!.*\.\.)[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;
  const otpRegex = /^\d{6}$/;
  const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
  const router = useRouter();
  //Function To Resend Or Submit The OTP With The New Token And Value
  const resendTokenAndOtp = async () => {
    //Set The Loading To True
    setIsLoading(true);
    //Checking The Provided Email
    if (
      emailValue.length <= 0 ||
      !emailValue.trim() ||
      !emailRegex.test(emailValue)
    ) {
      setIsLoading(false);
      setIsResendClicked(false);
      return toast.error("Must provide a valid email address.");
    }
    //If Valid Call The Function
    const data = await regenerateToken({ email: emailValue });

    setIsLoading(false);
    setIsResendClicked(false);

    //If Error Show The Toast
    if (!data.success && data.type === "stay") {
      return toast.error(data.message);
    }
    //If Error Is Resend
    if (!data.success && data.type === "resend") {
      toast.error(data.message);
      router.push("/signup");
      return; // Prevent further execution
    }
    //If Valid
    if (data.success) {
      toast.success(data.message);
      router.push(`/verify/${data.token}`);
    } else {
      toast.error(data.message || "Failed to resend OTP. Please try again.");
    }
  };
  //Function To Verify The OTP
  const validateOtp = async () => {
    //Set The Loading To True:
    setIsLoading(true);
    //Checking the provided otp code:
    if (otpValue.length <= 5 || !otpValue.trim() || !otpRegex.test(otpValue)) {
      setIsLoading(false);
      return toast.error("Must provide a valid OTP.");
    }
    //Checking whether the provided jwt token is valid:
    if (!token.trim() || !jwtRegex.test(token)) {
      setIsLoading(false);
      return toast.error("Must provide a valid JWT Token.");
    }
    //Call the verify function:
    const data = await checkAndVerify({ otpCode: otpValue, token });

    setIsLoading(false);

    //If Error Show The Toast
    if (!data.success && data.type === "stay") {
      return toast.error(data.message);
    }
    //If Error And Type Resend
    if (!data.success && data.type === "resend") {
      toast.error(data.message);
      router.push("/signup");
      return; // Prevent further execution
    }
    //If Valid (only runs if success is true)
    if (data.success) {
      toast.success(data.message);
      router.push("/login");
    } else {
      // Fallback for any other error cases
      toast.error(data.message || "Verification failed. Please try again.");
    }
  };
  return (
    <>
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
        {/* Logo And Title */}
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
        {/* Text And Description */}
        <div className="w-[95%] lg:w-[75%] flex flex-col justify-around items-center mb-[2rem]">
          <div className="text-2xl md:text-3xl lg:text-2xl font-bold text-white mb-2">
            Verify Your Email
          </div>
          <div className="text-sm md:text-xl lg:text-sm text-gray-200 text-center">
            We've sent a verification code to your email.
          </div>
        </div>
        {/* Otp Fields And Buttons */}
        <div
          className={`w-[95%] bg-gray-900 border-1 border-gray-200/25 rounded-md flex flex-col justify-center items-center ${
            isResendClicked ? "h-[65vh]" : "h-[55vh]"
          }`}
        >
          {/* Title And SubTitles   */}
          <div className="w-full flex flex-col justify-evenly items-center mb-[2rem]">
            <div className="text-2xl md:text-3xl lg:text-2xl font-bold text-white mb-[1rem]">
              Email Verification
            </div>
            <div className="text-sm md:text-xl lg:text-sm text-white text-center">
              Confirm your OTP to access your account.
            </div>
          </div>
          {/* Otp Fields */}
          <div className="flex justify-center items-center mb-[1rem] md:mb-[2rem] lg:mb-[1rem]">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value) => setOtpValue(value)}
            >
              <InputOTPGroup className="w-full">
                <InputOTPSlot
                  index={0}
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-12 lg:h-12 text-xl md:text-2xl lg:text-xl font-semibold focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 focus-visible:outline-none"
                />
                <InputOTPSlot
                  index={1}
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-12 lg:h-12 text-xl md:text-2xl lg:text-xl font-semibold focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 focus-visible:outline-none"
                />
                <InputOTPSlot
                  index={2}
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-12 lg:h-12 text-xl md:text-2xl lg:text-xl font-semibold focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 focus-visible:outline-none"
                />
                <InputOTPSlot
                  index={3}
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-12 lg:h-12 text-xl md:text-2xl lg:text-xl font-semibold focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 focus-visible:outline-none"
                />
                <InputOTPSlot
                  index={4}
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-12 lg:h-12 text-xl md:text-2xl lg:text-xl font-semibold focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 focus-visible:outline-none"
                />
                <InputOTPSlot
                  index={5}
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-12 lg:h-12 text-xl md:text-2xl lg:text-xl font-semibold focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 focus-visible:outline-none"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {/* Verify Button */}
          <div
            className="w-[45%] md:w-[65%] lg:w-[45%] h-12 md:h-20 lg:h-12 rounded-md bg-green-500/80 flex justify-center items-center transition-all ease-in-out duration-150 hover:scale-105 hover:cursor-pointer hover:bg-green-500 mb-[2rem]"
            onClick={validateOtp}
          >
            {isLoading ? (
              <ImSpinner8 className="text-2xl font-semibold text-white animate-spin" />
            ) : (
              <div className="text-lg md:text-3xl lg:text-lg font-semibold text-white">
                Submit
              </div>
            )}
          </div>
          {/* Resend Otp Link */}
          <div
            className={`flex justify-center items-center ${
              isResendClicked ? "mb-[2rem]" : ""
            }`}
            onClick={() => setIsResendClicked((prev) => !prev)}
          >
            <div className="text-white text-sm md:text-xl lg:text-sm font-semibold transition-all ease-in-out duration-150 hover:scale-105 hover:cursor-pointer hover:underline hover:text-blue-400">
              Didn't receive the code?
            </div>
          </div>
          {/* Show The Email Field */}
          {isResendClicked ? (
            <div className="flex w-[95%] max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl items-center gap-4">
              <Input
                type="email"
                placeholder="Email"
                className="h-12 md:h-14 lg:h-12 text-sm lg:text-sm md:text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
              />
              <Button
                type="submit"
                variant="outline"
                className="h-12 md:h-14 lg:h-12 !bg-green-500/80 !text-semibold transition-all ease-in-out duration-150 hover:scale-105 hover:cursor-pointer hover:!bg-green-500 text-md lg:text-sm md:text-xl"
                onClick={() => resendTokenAndOtp()}
              >
                {isLoading ? (
                  <ImSpinner8 className="text-2xl font-semibold animate-spin" />
                ) : (
                  "Resend"
                )}
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
