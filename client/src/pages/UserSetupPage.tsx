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
    <div className="min-h-screen flex justify-cente items-start p-4">
      <div className="w-full  max-w-lg shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-semibold mb-6 text-gray-200  text-center">
          Set Profile
        </h1>

        <form onSubmit={handleSubmit(handleSave)}>
          {" "}
          {/* Profile Picture */}
          <div className="flex justify-center mb-8 ">
            <div className="relative ">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-neutral-700">
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
                className="absolute bottom-1 right-1 bg-(--primary) text-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-(--primary-hover)"
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
          <div className="flex flex-col gap-5 text-sm">
            <div className="flex flex-col">
              <input
                placeholder="Full Name"
                {...register("fullName")}
                className="bg-neutral-800 py-2 px-4 rounded-md text-white border border-neutral-700 outline-0 focus:ring-2"
              />
              {errors.fullName && (
                <ErrorMessage text={errors.fullName.message} />
              )}
            </div>

            <div className="flex flex-col">
              <input
                placeholder="Username"
                {...register("userName")}
                className="bg-neutral-800 py-2 px-4 rounded-md text-white border border-neutral-700 outline-0 focus:ring-2"
              />
              {errors.userName && (
                <ErrorMessage text={errors.userName.message} />
              )}
            </div>

            <div className="flex flex-col">
              <select
                {...register("gender")}
                className="bg-neutral-800 text-white border border-neutral-700 rounded-md py-2 px-3 outline-none focus:ring-2 cursor-pointer"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && <ErrorMessage text={errors.gender.message} />}
            </div>

            <div className="flex flex-col">
              <textarea
                placeholder="Bio"
                {...register("bio")}
                className="bg-neutral-800 text-white border border-neutral-700 rounded-md py-2 px-4 min-h-24 resize-none outline-0 focus:ring-2"
              />
              {errors.bio && <ErrorMessage text={errors.bio.message} />}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`text-gray-100 font-medium py-2.5 px-3 rounded-lg 
      transition-all duration-200 flex items-center justify-center gap-2
      ${
        isLoading
          ? "opacity-70 cursor-not-allowed"
          : "hover:bg-(--primary-hover)"
      }`}
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
