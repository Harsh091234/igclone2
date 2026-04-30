export interface Post {
  _id: string;
  author: {
    _id: string;
    userName?: string;
    profilePic?: string;
  };
  caption: string;
  media: {
    url: string;
    type: "image" | "video";
    publicId: string;

    isReel?: boolean;

    feedRatio?: "1/1" | "4/5" | "16/9";

    width?: number;
    height?: number;
    aspectRatio?: number;
  }[];
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
  userName: string;
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
  };
}
