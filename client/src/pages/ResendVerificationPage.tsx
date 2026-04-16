import { useForm } from "react-hook-form";


import CustomButton from "../components/CustomButton";
import { resendVerificationUrlSchema, type resendVerificationUrlType } from "../schemas/auth.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResendVerificationUrlMutation } from "../services/authApi";
import { useEffect, useState } from "react";
import LeftSectionStartPage from "../components/LeftSectionStartPage";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";


const ResendVerificationPage = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [resendVerificationUrl, {isLoading}] = useResendVerificationUrlMutation();
    const [cooldown, setCooldown] = useState(0); // seconds
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();
const [type, setType] = useState<"success" | "error" | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors},
  } = useForm<resendVerificationUrlType>({
    resolver: zodResolver(resendVerificationUrlSchema),
  });

      const {
  onBlur: rhfOnBlur,
  ...emailRegister
} = register("email");

const emailValue = watch("email");
const [focused, setFocused] = useState<"email" | null>(null);

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
          setMessage(`Verification link sent to ${data.email}`);
    setType("success");
    } catch (err: any) {
        const seconds = err?.data?.retryAfter;
   if (seconds) {
      setCooldown(seconds);
          setMessage("Too many attempts. Please wait.");
    }
     else {
      // 🔥 Generic failure
      setMessage(err?.data?.message === "User already verified"? err.data.message : "Failed to send verification email");
    }
        setType("error");
      console.error(err?.data?.message || "Something went wrong");
    }

      setTimeout(() => {
    setMessage(null);
    setType(null);
  }, 5000);
  };

  useEffect(() => {
     if (user?.isEmailVerified) {
      navigate("/");
      return;
    }
  
  
  },[user, navigate])
  

  return (
    <div className="h-screen flex">
      <LeftSectionStartPage />

      <div className="flex w-full h-full flex-col md:flex-1 items-center justify-center px-6 py-10">
    
  
     
        
        <h1 className="text-3xl font-medium mb-8 text-center">
          Resend Verification Url
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-sm">
          
          {/* Email Field */}
         <div className="relative">
  <label
    className={`absolute left-4 transition-all duration-200 pointer-events-none
    ${
      focused === "email" || !!emailValue
        ? "top-1 text-xs px-1"
        : "top-3.5 text-sm text-muted-foreground"
    }`}
  >
    Email
  </label>

  <input
    {...emailRegister}
    className="
      w-full text-sm px-4 pt-5 pb-2 rounded-lg
      bg-muted/20
      border border-border/80
      text-foreground
      placeholder:text-muted-foreground
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary focus:border-ring
    "
    onFocus={() => setFocused("email")}
    onBlur={(e) => {
      rhfOnBlur(e);
      setFocused(null);
    }}
  />

  {errors.email && (
    <p className="text-red-500 text-xs mt-2 ml-1 font-medium">
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
            className="w-full h-10 font-semibold"
            type="submit"
            disabled={cooldown > 0 || isLoading}
          />
        </form>

        {message && (
          <p
          className={`mt-3 text-sm font-medium text-center transition-all duration-300 ${
    type === "success"
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400"
  }`}
          >
            {message}
          </p>
        )}
   
    
  </div>
    </div>
  );
}

export default ResendVerificationPage
