import type { Post } from "../types/post.types";

export const toggleLike = (post: Post, userId: string) => {
  const index = post.likes.findIndex(
    (id) => id.toString() === userId.toString(),
  );

  if (index !== -1) {
    // unlike
    post.likes.splice(index, 1);
  } else {
    // like
    post.likes.push(userId);
  }
};
