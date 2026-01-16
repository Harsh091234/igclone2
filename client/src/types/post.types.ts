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
  }[];
  likes: string[];
  comments: CommentT[];

  createdAt: string;
  updatedAt: string;
}

export interface CommentT {
  text: string;
  author: {
    userName: string;
    profilePic: string;
  };
  _id: string;
  likes: string[];
  createdAt: string;
}