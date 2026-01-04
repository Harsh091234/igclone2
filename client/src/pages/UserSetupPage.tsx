import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editProfile, selectUserLoading } from "../features/user/userSlice";
import type { AppDispatch } from "../store/store";
import { useAuth } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";


const UserSetupPage = () => {
  const {getToken} = useAuth();
  const [profilePic, setProfilePic] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false)
  const [gender, setGender] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectUserLoading);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate  = useNavigate();
  const convertToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePic(reader.result);
      }
    };
  };

  const handleSave = async(e: React.FormEvent<HTMLFormElement>) => {
    const token: string | null = await getToken();
    if (!token) return;
    e.preventDefault();
    const data = {
      fullName,
      userName,
      gender,
      bio,
      profilePic,
    };
    
    await dispatch(editProfile({ token, data })).unwrap();
    setSaved(true);
    
    //clear usestates
  
      setUserName("");
      setFullName("");
      setBio("");
      setGender("");
      setProfilePic("");

      navigate("/");
   
  };

  return (
    <div className="min-h-screen flex justify-center bg-green-700 items-start p-4">
      <div className="w-full  max-w-lg shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-semibold mb-6 text-gray-200  text-center">
          Set Profile
        </h1>

        <form onSubmit={handleSave}>
          {" "}
          {/* Profile Picture */}
          <div className="flex justify-center mb-8 ">
            <div className="relative ">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-neutral-700">
                <img
                  src={
                    profilePic ||
                    "https://res.cloudinary.com/djt8dpogs/image/upload/v1764092240/instagram_clone_uploads/uwoxn6lq0lyrrlkw2tlo.png"
                  }
                  alt="profile"
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
              const file = e.target.files?.[0];
              if (file) convertToBase64(file);
            }}
          />
          {/* Form Fields */}
          <div className="flex flex-col gap-5 text-sm ">
            <input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-neutral-800 py-2 px-4 rounded-md text-white border border-neutral-700 outline-0 focus:ring-2"
            />

            <input
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-neutral-800 py-2 px-4  rounded-md text-white border border-neutral-700  outline-0  focus:ring-2"
            />

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="bg-neutral-800 text-white border border-neutral-700 rounded-md py-2 px-3 outline-none focus:ring-2  cursor-pointer"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option className="rounded-bl-md" value="other">
                Other
              </option>
            </select>

            <textarea
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-neutral-800 text-white border border-neutral-700 rounded-md py-2 px-4  min-h-24 resize-none  outline-0  focus:ring-2"
            />

            <button
              type="submit"
              disabled={loading}
              className={`
     text-gray-100 font-medium py-2.5 px-3 rounded-lg 
    transition-all duration-200 flex items-center justify-center gap-2
    ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-(--primary-hover)"}
  `}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : saved ? (
                "Saved"
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
