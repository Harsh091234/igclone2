import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {Link, useNavigate} from "react-router-dom"

import CustomButton from "../components/CustomButton";
import { useLazyGetCsrfTokenQuery } from "../services/authApi";
import { useDispatch } from "react-redux";
import { setCsrfToken } from "../redux/csrfSlice";

import { loginSchema, type LoginFormData,} from "../schemas/auth.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "../services/authApi";
import LeftSectionStartPage from "../components/LeftSectionStartPage";
export default function LoginPage() {
  const [login, {isLoading}] = useLoginMutation();
   const [showPassword, setShowPassword] = useState(false);
   const [getCsrfToken] = useLazyGetCsrfTokenQuery();
const dispatch = useDispatch();
const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
  });
  const {
  onBlur: rhfOnBlur,
  ...emailRegister
} = register("email");
const {
  onBlur: passwordBlur,
  ...passwordRegister
} = register("password");
  const [focused, setFocused] = useState<"email" | "password" | null>(null);

  const onSubmit = async (data: { email: string; password: string }) => {
  try {
    const res = await login(data).unwrap();

    console.log("Success:", res);

     const csrfRes = await getCsrfToken(undefined).unwrap();

       dispatch(setCsrfToken(csrfRes.csrfToken));
    toast.success("User authenticated successfully")
    navigate("/");


  } catch (error: any) {
    console.log("Error in authenticating user:", error.message || error?.data?.message || "Something went wrong!");

    
  }
};
  const emailValue = watch("email");
  const passwordValue = watch("password");

  return (
    <div className="h-screen flex flex-col w-screen md:flex-row">
      {/* Left Side (Image) */}
      <LeftSectionStartPage />

      {/* Right Side (Form) */}
      <div className="flex h-full  w-full md:flex-1 items-center justify-center px-8 py-10">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-3xl font-medium text-center">Login Account</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none
${
  focused === "email" || !!emailValue
    ? "top-1 text-xs  px-1 "
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
    rhfOnBlur(e);        // important ✅
    setFocused(null);    // your logic ✅
  }}
              
              />
             {errors.email && (
  <p className="text-red-500 text-xs mt-1 font-medium">
    {errors.email.message}
  </p>
)}

            </div>

            {/* Password */}
            <div className="relative">
             <div className="relative">
            <label
                            className={`absolute left-4 transition-all duration-200 pointer-events-none 
                            ${
                              focused === "password" || !!passwordValue
                                ? "top-0.5 text-xs px-1"
                                : "top-3.5 text-sm text-muted-foreground"
                            }`}
                          >
                            Password
                          </label>
                          <input
                            type={showPassword ? "text" : "password"} 
                           {...passwordRegister}
                            className="
            w-full text-sm px-4 pt-5 pb-2 rounded-lg
            bg-muted/20
            border border-border/80
            text-foreground
            placeholder:text-muted-foreground
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-ring
            "
                            onFocus={() => setFocused("password")}
                            onBlur={(e) => {
                passwordBlur(e);
                setFocused(null);
              }}
                          
                          />
                          <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
                         </div>
              {errors.password && (
  <p className="text-red-500 text-xs font-medium mt-1">
    {errors.password.message}
  </p>
)}
<div className="text-right mt-1">
 <Link
    to="/forgot-password"
    className="
      relative inline-block text-foreground text-xs
      after:content-['']
      after:absolute after:h-[1px] after:w-full
      after:bg-foreground
      after:-bottom-0.5 after:right-0
      after:scale-x-0
      after:origin-right
      after:transition-transform after:duration-300
      hover:after:scale-x-100
      hover:after:origin-left
    "
  >
    Forgot password?
  </Link>
</div>
            </div>

            {/* Submit */}
           <CustomButton 
           type="submit"
           text="Login"
           className="w-full  h-11  text-sm   font-semibold"
           loading={isLoading}
           loaderClasses="h-5.5 w-5.5"
           />
          </form>

          <p className="text-center text-sm text-muted-foreground">
            New to instagram?{" "}
           <Link
  to="/register"
 className="
      relative inline-block text-foreground
      after:content-['']
      after:absolute after:h-[1.5px] after:w-full
      after:bg-foreground
      after:-bottom-0.5 after:right-0
      after:scale-x-0
      after:origin-right
      after:transition-transform after:duration-300
      hover:after:scale-x-100
      hover:after:origin-left
    "
>
  Register 
</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
