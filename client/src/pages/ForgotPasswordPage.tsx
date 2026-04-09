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
    formState: { errors },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

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
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-xl font-semibold text-center">
            Forgot Password
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("email")}
              placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
            />

            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}

            <CustomButton
              type="submit"
              loading={isLoading}
              text={
                cooldown > 0
                  ? `Try again in ${formatTimeVerbose(cooldown)}`
                  : "Send Reset Link"
              }
              disabled={cooldown > 0 || isLoading}
              className="w-full h-10"
              loaderClasses="h-6 w-6"
            />
          </form>

          {message && (
            <p
              className={`text-center text-sm ${
                type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;