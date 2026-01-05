import React, { useEffect, useRef, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  editProfileSchema,
  type EditProfileInput,
} from "../schemas/user.validator";

import { useEditProfileMutation } from "../services/userApi";
import ErrorMessage from "../components/ErrorMessage";

const UserSetupPage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [setupProfile, { isLoading }] = useEditProfileMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: "",
      userName: "",
      gender: "male",
      bio: "",
     
    },
  });


 const [preview, setPreview] = useState<string>("");
 const [file, setFile] = useState<File | null>(null);

 useEffect(() => {
   if (file) {
     const url = URL.createObjectURL(file); // ✅ File
     setPreview(url);

     return () => URL.revokeObjectURL(url);
   }
 }, [file]);


 const handleSave = async (data: EditProfileInput) => {
   try {
     const formData = new FormData();
     formData.append("fullName", data.fullName || "");
     formData.append("userName", data.userName);
     formData.append("gender", data.gender);
     formData.append("bio", data.bio || "");

     if (file) {
       formData.append("profilePic", file); // Always a File
     }

     await setupProfile(formData).unwrap(); // send FormData
     navigate("/");
   } catch (error: any) {
     console.log("error", error);
   }
 };


  return (
    <div className="min-h-screen flex justify-center items-center p-3">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-4 shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center">Set Profile</h1>

        <form onSubmit={handleSubmit(handleSave)}>
          {" "}
          {/* Profile Picture */}
          <div className="flex justify-center mb-5 ">
            <div className="relative ">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border">
                <img
                  src={
                    file
                      ? URL.createObjectURL(file)
                      : "https://res.cloudinary.com/djt8dpogs/image/upload/v1764092240/instagram_clone_uploads/uwoxn6lq0lyrrlkw2tlo.png"
                  }
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute  bottom-0.5 right-0.5 bg-secondary text-secondary-foreground 
             hover:bg-[var(--secondary-hover)] rounded-full w-7 h-7 flex items-center 
             justify-center text-lg font-bold "
              >
                +
              </button>
            </div>
          </div>
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) setFile(selectedFile);
            }}
          />
          {/* Form Fields */}
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex flex-col gap-1.5">
              <input
                placeholder="Full Name"
                {...register("fullName")}
                className="bg-background  text-foreground border border-border 
             py-1.5 px-3 rounded-md outline-none
             focus:ring-2 focus:ring-ring"
              />
              {errors.fullName && (
                <ErrorMessage text={errors.fullName.message} />
              )}
            </div>

            <div className="flex flex-col  gap-1.5">
              <input
                placeholder="Username"
                {...register("userName")}
                className="bg-background text-foreground border border-border 
             py-1.5 px-3 rounded-md outline-none
             focus:ring-2 focus:ring-ring"
              />
              {errors.userName && (
                <ErrorMessage text={errors.userName.message} />
              )}
            </div>

            <div className="flex flex-col">
              <select
                {...register("gender")}
                className="bg-background text-foreground border border-border 
             rounded-md py-1.5 px-3 outline-none
             focus:ring-2 focus:ring-ring cursor-pointer"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="flex flex-col  gap-1.5">
              <textarea
                placeholder="Bio"
                {...register("bio")}
                className="bg-background text-foreground border border-border 
             rounded-md py-1.5 px-3 min-h-24 resize-none outline-none
             focus:ring-2 focus:ring-ring"
              />
              {errors.bio && <ErrorMessage text={errors.bio.message} />}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-primary text-primary-foreground 
    font-medium py-2 rounded-lg transition-all
    flex items-center justify-center gap-2
    ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"}`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSetupPage;
