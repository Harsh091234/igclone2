import mongoose from "mongoose";
import Post from "../../modules/post/post.model.js"; // adjust path
import User from "../../modules/user/user.model.js"; // adjust path
import dotenv from "dotenv";
dotenv.config();
// 🔥 Unsplash sample images
const mediaPool = [
  { url: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d" },
  { url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7" },
  { url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" },
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
  { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba" },
  { url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e" },
  { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
  { url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e" },
  { url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d" },
  { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
];

// 🔥 helper functions
const getRandom = <T>(arr: readonly T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const getRandomCount = () => {
  const options = [1, 2, 3, 5];
  return getRandom(options);
};

// 🔥 map ratio to dimensions
const ratioMap = {
  "1/1": { width: 1080, height: 1080 },
  "4/5": { width: 1080, height: 1350 },
  "16/9": { width: 1280, height: 720 },
  "9/16": { width: 720, height: 1280 },
};

const aspectOptions = ["1/1", "4/5", "16/9", "9/16"] as const;

// 🔥 generate media object
const createMedia = () => {
  const base = getRandom(mediaPool);
  const aspect = getRandom(aspectOptions);
  const dims = ratioMap[aspect];

  return {
    url: base.url,
    publicId: `seed-${Math.random().toString(36).slice(2)}`,
    type: "image",
    isReel: aspect === "9/16",
    feedRatio: aspect === "9/16" ? "4/5" : aspect, // reels fallback
    aspect,
    width: dims.width,
    height: dims.height,
    aspectRatio: dims.height / dims.width,
  };
};

// 🔥 main seed function
export const seedPosts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
    const users = await User.find().select("_id userName");

    if (!users.length) {
      console.log("No users found");
      return;
    }

    let totalPosts = 0;

    for (const user of users) {
      const postCount = Math.floor(Math.random() * 2) + 2; // 2–3 posts

      const userPosts = [];

      for (let i = 0; i < postCount; i++) {
        const mediaCount = getRandomCount();

        const media = Array.from({ length: mediaCount }, () => createMedia());

        userPosts.push({
          author: user._id,
          caption: `Sample post ${i + 1}`,
          media,
          likes: [],
          comments: [],
        });
      }

      const inserted = await Post.insertMany(userPosts);

      totalPosts += inserted.length;

      // ✅ 🔥 LOG PER USER
      console.log(
        `✅ User ${user.userName || user._id} → ${inserted.length} posts created`,
      );
    }

    // ✅ FINAL SUMMARY
    console.log(`🎉 Seeding complete. Total posts: ${totalPosts}`);
     process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding posts:", err);
 process.exit(1);  
}
};
 seedPosts();
