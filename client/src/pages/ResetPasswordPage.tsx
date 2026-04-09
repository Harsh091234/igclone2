import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import CustomButton from "../components/CustomButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  resetPasswordSchema,
  type ResetPasswordType,
} from "../schemas/auth.validator";
import { useResetPasswordMutation } from "../services/authApi";
import { useEffect, useState } from "react";
import { formatTimeVerbose } from "../utils/formatRecedingSeconds";

const ResetPasswordPage = () => {
  const [cooldown, setCooldown] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();
  const { token } = useParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
  });

   useEffect(() => {
      if (cooldown <= 0) return;
      const timer = setInterval(() => setCooldown((p) => p - 1), 1000);
      return () => clearInterval(timer);
    }, [cooldown]);

  const onSubmit = async (data: ResetPasswordType) => {
    try {
      await resetPassword({ ...data, token: token! }).unwrap();

      setMessage("Password reset successfully");
      setType("success");
        setSubmitted(true);

          setTimeout(() => {
      navigate("/");
    }, 4000);


    } catch (err: any) {
      const seconds = err?.data?.retryAfter;
   
      if (seconds) {
        setMessage("Too many attempts. Please wait.");
           setCooldown(seconds)
      } else {
        setMessage("Invalid or expired reset link");
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
            Reset Password
          </h1>

         {submitted ? (
  <div className="text-center space-y-4">
    <p
      className={`text-sm ${
        type === "success" ? "text-green-600" : "text-red-600"
      }`}
    >
      {message}
    </p>

    {type === "success" && (
      <p className="text-gray-500 text-sm">
        Redirecting to home...
      </p>
    )}

    {type === "error" && (
      <button
        onClick={() => navigate("/forgot-password")}
        className="text-blue-600 hover:underline text-sm"
      >
        Resend reset link
      </button>
    )}
  </div>
) : (
  <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          {...register("password")}
          placeholder="Enter new password"
          className="w-full px-4 py-2 border rounded-md pr-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {errors.password && (
        <p className="text-red-500 text-sm">
          {errors.password.message}
        </p>
      )}

      <CustomButton
        loaderClasses="h-6 w-6"
        loading={isLoading}
        text={
          cooldown > 0
            ? `Try again in ${formatTimeVerbose(cooldown)}`
            : "Update Password"
        }
        type="submit"
        disabled={cooldown > 0 || isLoading}
        className="w-full h-10"
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
  </>
)}

        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;