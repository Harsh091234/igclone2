import type { follower } from "../components/modals/FollowersModal";
import type { FollowingUser } from "../components/modals/FollowingModal";

export interface User {
  clerkId: string;
  email: string;
  _id: string;
  fullName?: string;
  userName?: string;
  gender: string;
  bio?: string;
  location?: string;
  profilePic?: string;
  profilePicPublicId?: string;

  followers?: follower[];
  following?: FollowingUser[];

  bookmarks?: string[];
  posts?: string[];
  publicKey?: number[];
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
  publicKey?: number[];
}

//api responses
