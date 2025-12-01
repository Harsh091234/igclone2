export interface User {
  
  email: string;
   fullName?: string;
  userName?: string;
  profilePic?: string;
  followers?: any[];
  following?: any[];
  posts?: any[];
  bio?: string,
 
}

export interface EditProfileData{
    userName: string;
    fullName?: string;
    bio?: string;
    profilePic?: string;
    gender: string;
}
