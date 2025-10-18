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
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

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
    <BackgroundGradientAnimation className="w-full min-h-screen">
      <div className="flex flex-col min-h-screen px-6 py-8 relative z-10">
        {/* Header with Logo and Back */}
        <div className="w-full mb-6 flex items-center justify-between">
          <Link
            href={"/"}
            className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
          >
            <FaArrowLeft className="text-sm text-gray-300/80" />
            <span className="text-gray-300/80">Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-3">
            <div
              className="w-10 h-10 bg-transparent rounded-lg"
              style={{
                backgroundImage: `url('/motif.svg')`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="text-2xl font-bold text-green-500">BolAi</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-md mx-auto w-full pb-6">
            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Verify Your Email
              </h1>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                We've sent a verification code to your email
              </p>
            </div>

            {/* Card */}
            <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
              {/* Subtitle */}
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Email Verification
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  Confirm your OTP to access your account
                </p>
              </div>

              {/* OTP */}
              <div className="flex justify-center items-center mb-6">
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={(value) => setOtpValue(value)}
                >
                  <InputOTPGroup className="w-full">
                    <InputOTPSlot
                      index={0}
                      className="w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl font-semibold focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 focus-visible:outline-none"
                    />
                    <InputOTPSlot
                      index={1}
                      className="w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl font-semibold focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 focus-visible:outline-none"
                    />
                    <InputOTPSlot
                      index={2}
                      className="w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl font-semibold focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 focus-visible:outline-none"
                    />
                    <InputOTPSlot
                      index={3}
                      className="w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl font-semibold focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 focus-visible:outline-none"
                    />
                    <InputOTPSlot
                      index={4}
                      className="w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl font-semibold focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 focus-visible:outline-none"
                    />
                    <InputOTPSlot
                      index={5}
                      className="w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl font-semibold focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 focus-visible:outline-none"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Submit */}
              <div className="relative group pt-2 mb-6">
                <Button
                  type="button"
                  onClick={validateOtp}
                  disabled={isLoading}
                  className="relative w-full h-12 bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 hover:from-green-600 hover:via-green-700 hover:to-emerald-800 text-white font-semibold rounded-lg transition-all duration-300 cursor-pointer shadow-xl border border-green-400/30 hover:border-green-300/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2 relative z-10">
                      <ImSpinner8 className="animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <span className="relative z-10">Submit</span>
                  )}
                </Button>
              </div>

              {/* Resend toggle */}
              <div
                className={`flex justify-center items-center ${
                  isResendClicked ? "mb-4" : "mb-0"
                }`}
                onClick={() => setIsResendClicked((prev) => !prev)}
              >
                <button className="text-white text-sm sm:text-base font-semibold transition-all duration-150 hover:underline hover:text-blue-400">
                  Didn't receive the code?
                </button>
              </div>

              {/* Resend form */}
              {isResendClicked ? (
                <div className="flex w-full max-w-md mx-auto items-center gap-3">
                  <Input
                    type="email"
                    placeholder="Email"
                    className="h-12 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-5 bg-green-500/80 text-white font-semibold border border-green-400/40 hover:bg-green-500"
                    onClick={() => resendTokenAndOtp()}
                  >
                    {isLoading ? (
                      <ImSpinner8 className="animate-spin" />
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
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
}
