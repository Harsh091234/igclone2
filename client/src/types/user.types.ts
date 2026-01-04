export interface User {
  clerkId: string;
  email: string;

  fullName?: string;
  userName?: string;
  gender: string;
  bio?: string;

  profilePic?: string;
  profilePicPublicId?: string;

  followers?: string[];
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
}

export interface SearchUser {
  _id: string;
  userName: string;
  profilePic: string;
  fullName: string;
}

//api responses
export interface SyncUserResponse {
  success: boolean;
  user: User;
}