// run | npx tsx src/config/user.seed.ts | for seeding
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js"; // adjust path if needed
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));
const demoUsers = [
    {
        clerkId: "clerk_1",
        email: "alice@example.com",
        fullName: "Alice Johnson",
        userName: "alice_j",
        profilePic: "https://images.unsplash.com/photo-1468186376524-b53e47314061",
        bio: "Love traveling and photography.",
        password: "password123",
        gender: "female",
    },
    {
        clerkId: "clerk_2",
        email: "bob@example.com",
        fullName: "Bob Smith",
        userName: "bob_smith",
        profilePic: "https://plus.unsplash.com/premium_photo-1721779216858-23fdc076c308",
        bio: "Coffee lover and coder.",
        password: "password123",
        gender: "male",
    },
    {
        clerkId: "clerk_3",
        email: "carol@example.com",
        fullName: "Carol White",
        userName: "carol_white",
        profilePic: "https://images.unsplash.com/photo-1669199148548-028995f5d045",
        bio: "Music enthusiast.",
        password: "password123",
        gender: "female",
    },
    {
        clerkId: "clerk_4",
        email: "dave@example.com",
        fullName: "Dave Brown",
        userName: "dave_b",
        profilePic: "https://media.istockphoto.com/id/1216965659/photo/smiling-mature-woman-sitting-on-her-patio-drinking-water.webp",
        bio: "Tech geek and gamer.",
        password: "password123",
        gender: "male",
    },
    {
        clerkId: "clerk_5",
        email: "emma@example.com",
        fullName: "Emma Davis",
        userName: "emma_d",
        profilePic: "https://media.istockphoto.com/id/2177231592/photo/smiling-asian-woman-posing-with-crossed-arms.webp",
        bio: "Yoga and wellness lover.",
        password: "password123",
        gender: "female",
    },
    {
        clerkId: "clerk_6",
        email: "frank@example.com",
        fullName: "Frank Miller",
        userName: "frank_m",
        profilePic: "https://media.istockphoto.com/id/2167525503/photo/woman-wearing-sunglasses-in-illuminated-room.webp",
        bio: "Traveler and foodie.",
        password: "password123",
        gender: "male",
    },
    {
        clerkId: "clerk_7",
        email: "grace@example.com",
        fullName: "Grace Lee",
        userName: "grace_lee",
        profilePic: "https://images.unsplash.com/photo-1542305983-c4100e4b8cd2",
        bio: "Nature photographer.",
        password: "password123",
        gender: "female",
    },
    {
        clerkId: "clerk_8",
        email: "henry@example.com",
        fullName: "Henry Wilson",
        userName: "henry_w",
        profilePic: "https://images.unsplash.com/photo-1722328714912-667f731c1829",
        bio: "Guitarist and composer.",
        password: "password123",
        gender: "male",
    },
    {
        clerkId: "clerk_9",
        email: "isabella@example.com",
        fullName: "Isabella Martinez",
        userName: "isabella_m",
        profilePic: "https://images.unsplash.com/photo-1673289202760-82cfba941b21",
        bio: "Bookworm and writer.",
        password: "password123",
        gender: "female",
    },
    {
        clerkId: "clerk_10",
        email: "jack@example.com",
        fullName: "Jack Taylor",
        userName: "jack_t",
        profilePic: "https://images.unsplash.com/photo-1542305983-c4100e4b8cd2",
        bio: "Sports fan and blogger.",
        password: "password123",
        gender: "male",
    },
    {
        clerkId: "clerk_11",
        email: "kate@example.com",
        fullName: "Kate Anderson",
        userName: "kate_a",
        profilePic: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
        bio: "Food blogger.",
        password: "password123",
        gender: "female",
    },
    {
        clerkId: "clerk_12",
        email: "leo@example.com",
        fullName: "Leo Robinson",
        userName: "leo_r",
        profilePic: "https://images.unsplash.com/photo-1598777882245-c1535b4a2e62",
        bio: "Movie lover and reviewer.",
        password: "password123",
        gender: "male",
    },
    {
        clerkId: "clerk_13",
        email: "mia@example.com",
        fullName: "Mia Clark",
        userName: "mia_c",
        profilePic: "https://plus.unsplash.com/premium_photo-1723485666740-65043a449611",
        bio: "Fashion enthusiast.",
        password: "password123",
        gender: "female",
    },
    {
        clerkId: "clerk_14",
        email: "nate@example.com",
        fullName: "Nate Lewis",
        userName: "nate_l",
        profilePic: "https://plus.unsplash.com/premium_photo-1723485666740-65043a449611",
        bio: "Tech reviewer and gamer.",
        password: "password123",
        gender: "male",
    },
    {
        clerkId: "clerk_15",
        email: "olivia@example.com",
        fullName: "Olivia Young",
        userName: "olivia_y",
        profilePic: "https://images.unsplash.com/photo-1580843420014-33eea1abeae6",
        bio: "Traveler and blogger.",
        password: "password123",
        gender: "female",
    },
    {
        clerkId: "clerk_16",
        email: "peter@example.com",
        fullName: "Peter Hall",
        userName: "peter_h",
        profilePic: "https://images.unsplash.com/photo-1592214468571-0a38317ef79e",
        bio: "Cyclist and adventurer.",
        password: "password123",
        gender: "male",
    },
    {
        clerkId: "clerk_17",
        email: "quinn@example.com",
        fullName: "Quinn Allen",
        userName: "quinn_a",
        profilePic: "https://images.unsplash.com/photo-1592214468571-0a38317ef79e",
        bio: "Photographer and artist.",
        password: "password123",
        gender: "other",
    },
    {
        clerkId: "clerk_18",
        email: "rachel@example.com",
        fullName: "Rachel Scott",
        userName: "rachel_s",
        profilePic: "https://images.unsplash.com/photo-1586299485759-f62264d6b63f",
        bio: "Nature lover.",
        password: "password123",
        gender: "female",
    },
    {
        clerkId: "clerk_19",
        email: "sam@example.com",
        fullName: "Sam Harris",
        userName: "sam_h",
        profilePic: "https://images.unsplash.com/photo-1665827139274-90f460a688b2",
        bio: "Tech and gaming enthusiast.",
        password: "password123",
        gender: "male",
    },
    {
        clerkId: "clerk_20",
        email: "tina@example.com",
        fullName: "Tina Baker",
        userName: "tina_b",
        profilePic: "https://plus.unsplash.com/premium_photo-1723489222201-7e86252e426a",
        bio: "Blogger and traveler.",
        password: "password123",
        gender: "female",
    },
];
const seedUsers = async () => {
    try {
        // Iterate over demoUsers array
        for (const userData of demoUsers) {
            const userExists = await User.findOne({ email: userData.email });
            if (!userExists) {
                const newUser = new User(userData);
                await newUser.save();
                console.log(`Created user: ${userData.userName}`);
            }
            else {
                console.log(`User already exists: ${userData.userName}`);
            }
        }
        console.log("All demo users processed!");
        mongoose.connection.close();
    }
    catch (error) {
        console.error("Error creating demo users:", error);
        mongoose.connection.close();
    }
};
seedUsers();
