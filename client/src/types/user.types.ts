import type { follower } from "../components/modals/FollowersFollowingModal";

export interface User {
  clerkId: string;
  email: string;
  _id: string,
  fullName?: string;
  userName?: string;
  gender: string;
  bio?: string;

  profilePic?: string;
  profilePicPublicId?: string;

  followers?: follower[];
  following?: string[];

  bookmarks?: string[];
  posts?: string[];

  isProfileComplete: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EditProfileData {
  userName: string;
  fullName?: string;
  bio?: string;
  profilePic?: string;
  gender: string;
  customGender?: string;
}

export interface SearchUser {
  _id: string;
  userName: string;
  profilePic: string;
  fullName: string;
}

//api responses
