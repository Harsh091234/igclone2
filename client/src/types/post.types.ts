export interface Media {
  url: string;
  type: "image" | "video";
  publicId: string;

  isReel?: boolean;

  feedRatio?: "1/1" | "4/5" | "16/9";
  aspect?: "1/1" | "4/5" | "16/9" | "9/16";

  width?: number;
  height?: number;
  aspectRatio?: number;
}

export interface ReelAuthor {
  _id: string;
  userName?: string;
  profilePic?: string;
}


export interface Post {
  _id: string;
  author: Author;
  caption: string;
  media: Media[];
  likes: string[];
  comments: CommentT[];

  createdAt: string;
  updatedAt: string;
}

export interface CommentT {
  text: string;
  author: {
    _id: string;
    userName: string;
    profilePic: string;
  };
  _id: string;
  likes: string[];
  createdAt: string;
}

export interface Author {
  userName?: string;
  _id: string;
  profilePic: string;
  followers?: string[];
  fullName?: string;
}

export interface Reel {
  _id: string;
  author: Author;
  caption?: string;
  comments: string[];
  likes: string[];
  createdAt: string; // ISO date string
  video: {
    publicId: string;
    url: string;
    aspect?:"1/1" | "4/5" | "16/9" | "9/16";
  };
}
