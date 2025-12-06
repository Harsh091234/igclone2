
import { useState } from "react";

import CustomButton from "../../components/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { editProfile, selectUser, selectUserLoading } from "../../features/user/userSlice";
import { useAuth } from "@clerk/clerk-react";
import type { AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import CustomGenderModal from "../../components/modals/CustomGenderModal";


const EditProfilePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const authUser = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);
  const [profilePic, setProfilePic] = useState<File | string>(authUser.profilePic); // 

  const [fullName, setFullName] = useState(authUser.fullName || "");
  const [userName, setUserName] = useState(authUser.userName || "");
  const [bio, setBio] = useState(authUser.bio || "");
  const [gender, setGender] = useState(authUser.gender || "");
  const dispatch = useDispatch<AppDispatch>();
  const {getToken} = useAuth()
  const navigate = useNavigate();

  const handlePicUpload = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePic(reader.result);
      }
    };
  }

   const handleCustomGender = (value: string) => {
    

     if (value === "custom") {
       setOpenModal(true);
     } else {
       setGender(value);
     }
   };

  const handleSubmit = async () => {
    const token: string | null = await getToken();
    if (!token) return;

    // Only include profilePic if it's a new file (Base64)
    const data: any = {
      fullName,
      userName,
      bio,
      gender,
    };

    if (
      profilePic &&
      typeof profilePic === "string" &&
      profilePic.startsWith("data:image")
    ) {
      data.profilePic = profilePic;
    }

    const res = await dispatch(editProfile({ token, data }));
    if (editProfile.fulfilled.match(res)) {
      navigate(`/profile/${authUser.userName}`);
    }
  };

  return (
    <div className="  mx-auto p-6 max-h-screen overflow-y-auto">
      <h1 className="text-xl font-semibold mb-8">Edit Profile</h1>

      <div className="flex gap-12 flex-col">
        {/* LEFT SIDE: PROFILE PHOTO */}
        <div className="w-full bg-neutral-100 px-4 py-3 rounded-xl flex items-center justify-between">
          {/* LEFT SIDE: avatar + username */}
          <div className="flex items-center gap-3">
            <img
              src={profilePic ||  authUser.profilePic}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border"
            />

            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">
                {userName || authUser.userName}
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: Change Photo */}
          <div>
            <label
              htmlFor="profilePicUpload"
              className="px-4 py-2 bg-(--primary) cursor-pointer text-white text-xs rounded-md  hover:bg-(--primary-hover) transition"
            >
              Change photo
            </label>

            <input
              id="profilePicUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files?.[0];
                  handlePicUpload(file);
                }
              }}
            />
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="flex-1 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full p-2 text-sm border border-(--secondary) rounded-lg outline-none"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              className="w-full p-2 text-sm border border-(--secondary) rounded-lg outline-none"
              placeholder="your_username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              className="w-full p-2 text-sm border border-(--secondary) rounded-lg outline-none resize-none"
              rows={3}
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>

            <div className="relative">
              <select
                className="
          w-full p-2 text-sm border border-(--secondary) rounded-lg outline-none
          appearance-none pr-8
        "
                value={gender}
                onChange={(e) => handleCustomGender(e.target.value)}
              >
                <option value="" disabled className="text-neutral-400">
                  Select gender
                </option>

                <option value="male">Male</option>
                <option value="female">Female</option>

                <option value="custom">Custom</option>
                {gender !== "male" &&
                  gender !== "female" &&
                  gender !== "prefer_not_say" &&
                  gender !== "custom" && (
                    <option value={gender}>{gender}</option>
                  )}
                <option value="prefer_not_say">Prefer not to say</option>
              </select>

              {/* Custom arrow - moved slightly left */}
              <div className="pointer-events-none text-xs absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                ▼
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-end mb-6">
            <CustomButton
              text={"Submit"}
              className={"text-sm py-2 px-3 w-30"}
              type="submit"
              onClick={handleSubmit}
              loading={loading}
            />
          </div>
        </div>
      </div>
      {openModal && (
        <CustomGenderModal
          onClose={() => setOpenModal(false)}
          onSave={(value: string) => {
            setGender(value);
            setOpenModal(false);
          }}
        />
      )}
    </div>
  );
};

export default EditProfilePage;
