// src/config/user.seed.ts

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../../modules/user/user.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const demoUsers = [
  {
    email: "alice@example.com",
    fullName: "Alice Johnson",
    userName: "alice_j",
    password: "password123",
    gender: "female",
    bio: "Love traveling and photography.",
    profilePic: "https://images.unsplash.com/photo-1468186376524-b53e47314061",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "bob@example.com",
    fullName: "Bob Smith",
    userName: "bob_smith",
    password: "password123",
    gender: "male",
    bio: "Coffee lover and coder.",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "carol@example.com",
    fullName: "Carol White",
    userName: "carol_white",
    password: "password123",
    gender: "female",
    bio: "Music enthusiast.",
    profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    isProfileComplete: true,
    isEmailVerified: true,
  },

  {
    email: "david@example.com",
    fullName: "David Miller",
    userName: "david_m",
    password: "password123",
    gender: "male",
    bio: "Fitness and travel lover.",
    profilePic: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "emma@example.com",
    fullName: "Emma Davis",
    userName: "emma_d",
    password: "password123",
    gender: "female",
    bio: "Yoga and healthy living.",
    profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "frank@example.com",
    fullName: "Frank Wilson",
    userName: "frank_w",
    password: "password123",
    gender: "male",
    bio: "Developer and gamer.",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "grace@example.com",
    fullName: "Grace Lee",
    userName: "grace_l",
    password: "password123",
    gender: "female",
    bio: "Nature photographer.",
    profilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "henry@example.com",
    fullName: "Henry Walker",
    userName: "henry_w",
    password: "password123",
    gender: "male",
    bio: "Sports fan and blogger.",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "isabella@example.com",
    fullName: "Isabella Moore",
    userName: "isabella_m",
    password: "password123",
    gender: "female",
    bio: "Fashion enthusiast.",
    profilePic: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "jack@example.com",
    fullName: "Jack Harris",
    userName: "jack_h",
    password: "password123",
    gender: "male",
    bio: "Music producer.",
    profilePic: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    isProfileComplete: true,
    isEmailVerified: true,
  },

  {
    email: "kate@example.com",
    fullName: "Kate Adams",
    userName: "kate_a",
    password: "password123",
    gender: "female",
    bio: "Food blogger.",
    profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "leo@example.com",
    fullName: "Leo Martin",
    userName: "leo_m",
    password: "password123",
    gender: "male",
    bio: "Movie lover.",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "mia@example.com",
    fullName: "Mia Clark",
    userName: "mia_c",
    password: "password123",
    gender: "female",
    bio: "Coffee addict.",
    profilePic: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "nathan@example.com",
    fullName: "Nathan Young",
    userName: "nathan_y",
    password: "password123",
    gender: "male",
    bio: "Traveler.",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "olivia@example.com",
    fullName: "Olivia Scott",
    userName: "olivia_s",
    password: "password123",
    gender: "female",
    bio: "Writer and dreamer.",
    profilePic: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    isProfileComplete: true,
    isEmailVerified: true,
  },

  {
    email: "peter@example.com",
    fullName: "Peter Hall",
    userName: "peter_h",
    password: "password123",
    gender: "male",
    bio: "Cyclist.",
    profilePic: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "quinn@example.com",
    fullName: "Quinn Allen",
    userName: "quinn_a",
    password: "password123",
    gender: "other",
    bio: "Photographer.",
    profilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "rachel@example.com",
    fullName: "Rachel Scott",
    userName: "rachel_s",
    password: "password123",
    gender: "female",
    bio: "Nature lover.",
    profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "sam@example.com",
    fullName: "Sam Harris",
    userName: "sam_h",
    password: "password123",
    gender: "male",
    bio: "Tech and gaming.",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "tina@example.com",
    fullName: "Tina Baker",
    userName: "tina_b",
    password: "password123",
    gender: "female",
    bio: "Traveler.",
    profilePic: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
    isProfileComplete: true,
    isEmailVerified: true,
  },

  {
    email: "uma@example.com",
    fullName: "Uma Patel",
    userName: "uma_p",
    password: "password123",
    gender: "female",
    bio: "Designer.",
    profilePic: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "victor@example.com",
    fullName: "Victor Reed",
    userName: "victor_r",
    password: "password123",
    gender: "male",
    bio: "Startup founder.",
    profilePic: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "wendy@example.com",
    fullName: "Wendy Stone",
    userName: "wendy_s",
    password: "password123",
    gender: "female",
    bio: "Makeup artist.",
    profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "xavier@example.com",
    fullName: "Xavier Green",
    userName: "xavier_g",
    password: "password123",
    gender: "male",
    bio: "Fitness coach.",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "yasmin@example.com",
    fullName: "Yasmin Khan",
    userName: "yasmin_k",
    password: "password123",
    gender: "female",
    bio: "Artist.",
    profilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    isProfileComplete: true,
    isEmailVerified: true,
  },
  {
    email: "zane@example.com",
    fullName: "Zane Cooper",
    userName: "zane_c",
    password: "password123",
    gender: "male",
    bio: "Photographer.",
    profilePic: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    isProfileComplete: true,
    isEmailVerified: true,
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    for (const userData of demoUsers) {
      const exists = await User.findOne({
        $or: [{ email: userData.email }, { userName: userData.userName }],
      });

      if (exists) {
        console.log(`Skipped: ${userData.userName}`);
        continue;
      }

      await User.create(userData); // pre-save hook hashes password
      console.log(`Created: ${userData.userName}`);
    }

    console.log("Seeding complete");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seedUsers();