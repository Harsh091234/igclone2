export type MediaType =
  | "image"
  | "video"
  | "audio"
  | "gif"
  | "pdf"
  | "doc"
  | "xls";

export interface Media {
  url: string;
  type: MediaType;
}

export interface SeenBy {
  userId: string;
  seenAt: string; 
}



export interface Message {
  _id: string;
  senderId: {
    _id: string;
    userName?: string;
    profilePic?: string;
  };
  receiverId: {
    _id: string;
    userName?: string;
    profilePic?: string;
  };
  text?: string;
  media?: Media[];
  seenBy: SeenBy[];
  createdAt: string;
  updatedAt: string;
}

