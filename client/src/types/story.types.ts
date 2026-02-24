export interface Story {
  _id: string;
  user: {
    _id: string;
    userName: string;
    profilePic: string;
  };
  media: {
    type: "image" | "video";
    url: string;
    publicId: string;
  };
  textLayers: Array<{
    _id: string;
    text: string;
    x: number;
    y: number;
    color: string;
  }>;
  likes: string[]; // array of user IDs who liked
  views: string[]; // array of user IDs who viewed
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  expiresAt: string; // ISO date string
}
