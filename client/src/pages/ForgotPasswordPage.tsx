import { useForm } from "react-hook-form";
import { Card, CardContent } from "../components/ui/card";
import CustomButton from "../components/CustomButton";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
 type  ForgotPasswordType,
} from "../schemas/auth.validator";
import { useForgotPasswordMutation } from "../services/authApi";
import { useEffect, useState } from "react";
import { formatTimeVerbose } from "../utils/formatRecedingSeconds";

const ForgotPasswordPage = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error" | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

 const {
    onBlur: rhfOnBlur,
    ...emailRegister
  } = register("email");
  const emailValue = watch("email");
  const [focused, setFocused] = useState<"email" | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = async (data: ForgotPasswordType) => {
    try {
      await forgotPassword(data).unwrap();
      reset();

      setMessage("Password reset link sent successfully");
      setType("success");
      setCooldown(30);

    } catch (err: any) {
      const seconds = err?.data?.retryAfter;
      console.log("type:", typeof(seconds))

      if (seconds) {
        setCooldown(seconds);
        setMessage("Too many attempts. Please wait.");
      } else {
        setMessage("Failed to send reset email");
      }

      setType("error");
    }

    setTimeout(() => {
      setMessage(null);
      setType(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
     <Card className="w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-800">
  <CardContent className="p-8 space-y-6">
    
    {/* Heading */}
    <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">
      Forgot Password
    </h1>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
      {/* ✅ Floating Email Field */}
      <div className="relative">
        <label
          className={`absolute left-4 transition-all duration-200 pointer-events-none
          ${
            focused === "email" || !!emailValue
              ? "top-1 text-xs px-1 "
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

      {/* ✅ Submit Button */}
      <CustomButton
        type="submit"
        loading={isLoading}
        text={
          cooldown > 0
            ? `Try again in ${formatTimeVerbose(cooldown)}`
            : "Send Reset Link"
        }
        disabled={cooldown > 0 || isLoading}
        className="w-full h-11 font-semibold"
        loaderClasses="h-5 w-5"
      />

      {/* ✅ Message (RIGHT PLACE) */}
      {message && (
        <p
          className={`text-center text-sm font-medium transition-all duration-300 ${
            type === "success"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  </CardContent>
</Card>
    </div>
  );
};

export default ForgotPasswordPage;