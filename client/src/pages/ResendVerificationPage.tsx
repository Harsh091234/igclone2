import { useForm } from "react-hook-form";
import { Card, CardContent } from "../components/ui/card";

import CustomButton from "../components/CustomButton";
import { resendVerificationUrlSchema, type resendVerificationUrlType } from "../schemas/auth.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResendVerificationUrlMutation } from "../services/authApi";
import { useEffect, useState } from "react";

const ResendVerificationPage = () => {
    const [resendVerificationUrl, {isLoading, isSuccess, isError}] = useResendVerificationUrlMutation();
    const [cooldown, setCooldown] = useState(0); // seconds
    const [message, setMessage] = useState<string | null>(null);
const [type, setType] = useState<"success" | "error" | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors},
  } = useForm<resendVerificationUrlType>({
    resolver: zodResolver(resendVerificationUrlSchema),
  });

  useEffect(() => {
  if (cooldown <= 0) return;

  const timer = setInterval(() => {
    setCooldown((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [cooldown]);

 const onSubmit = async (data: resendVerificationUrlType) => {
    try {
    await resendVerificationUrl(data).unwrap();
      reset();
        setCooldown(30);
    } catch (err: any) {
        const seconds = err?.data?.retryAfter;
   if (seconds) {
      setCooldown(seconds);
          setMessage("Too many attempts. Please wait.");
    }
     else {
      // 🔥 Generic failure
      setMessage("Failed to send verification email");
    }
        setType("error");
      console.error(err?.data?.message || "Something went wrong");
    }

      setTimeout(() => {
    setMessage(null);
    setType(null);
  }, 5000);
  };
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-800">
        <CardContent className="py-6 px-10 ">
          
          <h1 className="text-2xl font-semibold  mb-8 text-center text-gray-900 dark:text-gray-100">
            Resend Verification Url
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <input
             
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
               {...register("email")}
              />

              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <CustomButton 
            loading={isLoading}
            loaderClasses="h-6 w-6"
              text={
    cooldown > 0
      ? `Try again in ${cooldown}s`
      : "Submit"
  }
            className="w-full h-10 "
            type="submit"
            disabled={cooldown > 0 || isLoading}
            />
          </form>

          {
  message && (
    <p
      className={`mt-3 text-sm font-medium text-center ${
        type === "success"
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400"
      }`}
    >
      {message}
    </p>
  )
}
        </CardContent>
      </Card>
    </div>
  );
}

export default ResendVerificationPage
