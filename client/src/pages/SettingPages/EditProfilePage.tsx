import { useEffect, useState } from "react";

import CustomButton from "../../components/CustomButton";

import { useNavigate } from "react-router-dom";
import {
  useEditProfileMutation,
 
} from "../../services/userApi";
import { useForm } from "react-hook-form";
import {
  editProfileSchema,
  type EditProfileInput,
} from "../../schemas/user.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EditProfileData } from "../../types/user.types";

import { useGetMeQuery } from "../../services/authApi";
import BackButton from "../../components/BackButton";

const EditProfilePage = () => {
  const { data } = useGetMeQuery(undefined);
  const [editProfile, { isLoading }] = useEditProfileMutation();
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const authUser = data?.user;

  if (!authUser) return;

  const { register, handleSubmit, watch } = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: authUser.fullName,
      userName: authUser.userName,
      gender: authUser.gender as
        | "male"
        | "female"
        | "other"
        | "prefer not to say",
      bio: authUser.bio,
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file); // ✅ File
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleSave = async (data: EditProfileData) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName || "");
      formData.append("userName", data.userName);

      const finalGender =
        data.gender === "other" ? data.customGender : data.gender;
      if (finalGender) {
        formData.append("gender", finalGender);
      }

      formData.append("bio", data.bio || "");

      if (file) {
        formData.append("profilePic", file); // Always a File
      }

      await editProfile(formData).unwrap(); // send FormData
      navigate("/");
    } catch (error: any) {
      console.log("error", error);
    }
  };

  return (
    <div className="mx-auto max-w-3xl py-6 px-13 h-full overflow-y-auto">
      <h1 className="text-xl flex justify-between  font-semibold mb-8 text-foreground">
        Edit Profile
       <BackButton />
      </h1>

      <div className="flex gap-7 sm:gap-12 flex-col">
        {/* PROFILE PHOTO */}
        <div className="w-full bg-card px-4  py-2 sm:py-3 rounded-xl flex items-center justify-between border border-border">
          <div className="flex items-center gap-3">
            <img
              src={preview || authUser.profilePic}
              alt="Profile"
              className="h-9 sm:w-12 h-9 sm:h-12 rounded-full object-cover border border-border"
            />

            <div className="flex flex-col">
              <span className="font-semibold text-sm sm:text-base  text-foreground">
                {authUser.userName}
              </span>
            </div>
          </div>

          <label
            htmlFor="profilePicUpload"
            className="
              px-3 sm:px-4 py-1 sm:py-2 text-[0.71rem] sm:text-xs font-medium cursor-pointer rounded-md
              bg-primary text-primary-foreground
              hover:bg-primary/90 transition
            "
          >
            Change photo
          </label>

          <input
            id="profilePicUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) setFile(selectedFile);
            }}
          />
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(handleSave)}
          className="flex-1      space-y-4 sm:space-y-6"
        >
          {/* Full Name */}
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 text-foreground">
              Full Name
            </label>
            <input
              type="text"
              className="
                w-full p-2 text-xs sm:text-sm  rounded-lg outline-none
                bg-background text-foreground
                border border-input
              "
              placeholder="Your full name"
              {...register("fullName")}
            />
            {/* {errors.fullName && <ErrorMessage text={errors.fullName.message} />} */}
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs sm:text-sm  font-medium mb-1 text-foreground">
              Username
            </label>
            <input
              type="text"
              className="
                w-full p-2 text-xs sm:text-sm  rounded-lg outline-none
                bg-background text-foreground
                border border-input
              "
              placeholder="your_username"
              {...register("userName")}
            />
            {/* {errors.userName && <ErrorMessage text={errors.userName.message} />} */}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs sm:text-sm  font-medium mb-1 text-foreground">
              Bio
            </label>
            <textarea
              className="
                w-full p-2 text-xs sm:text-sm  rounded-lg outline-none resize-none
                bg-background text-foreground
                border border-input
              "
              rows={3}
              placeholder="Tell us about yourself"
              {...register("bio")}
            />
            {/* {errors.bio && <ErrorMessage text={errors.bio.message} />} */}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs sm:text-sm  font-medium mb-1 text-foreground">
              Gender
            </label>

            <div className="relative">
              <select
                className="
                  w-full p-2 text-xs sm:text-sm  rounded-lg outline-none pr-8
                  bg-background text-foreground
                  border border-input
                  appearance-none
                "
                {...register("gender")}
              >
                <option value="" disabled>
                  Select gender
                </option>

                <option value="male">Male</option>
                <option value="female">Female</option>

                <option value="other">Other</option>

                <option value="prefer not to say">Prefer not to say</option>
              </select>

              {watch("gender") === "other" && (
                <input
                  type="text"
                  placeholder="Enter your gender"
                  className="
      mt-3 w-full p-2 text-sm rounded-lg
      bg-background text-foreground
      border border-input
      outline-none
    "
                  {...register("customGender")}
                />
              )}
              {/* {errors.gender && (
                <ErrorMessage text={errors.gender.message} />
              )} */}

              <div className="pointer-events-none text-[0.5rem] sm:text-[0.67rem] absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ▼
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mb-6">
            <CustomButton
              text="Submit"
              className="text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-1.5 sm:px-2 w-full sm:w-24"
              type="submit"
              loading={isLoading}
              loaderClasses="h-4 w-4 sm:h-5 sm:w-5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
