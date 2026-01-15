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
  comments: string[];

  createdAt: string;
  updatedAt: string;
}
