import { UserButton } from "@clerk/clerk-react";
import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Home,
  Search,
  PlusSquare,
  Film,
  User,
} from "lucide-react";


import { Link } from "react-router-dom";


interface Story {
  id: number;
  user: string;
  avatar: string;
  isOwn?: boolean;
}

interface Post {
  id: number;
  user: string;
  avatar: string;
  location: string;
  image: string;
  likes: number;
  caption: string;
  timeAgo: string;
}

export default function FeedPage() {
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<number, boolean>>({});

  const stories: Story[] = [
    { id: 1, user: "Your Story", avatar: "😜", isOwn: true },
    { id: 2, user: "alice_wonder", avatar: "🐱‍👤" },
    { id: 3, user: "travel_diaries", avatar: "💋" },
    { id: 4, user: "foodie_life", avatar: "😎" },
    { id: 5, user: "tech_guru", avatar: "A" },
    { id: 6, user: "fitness_pro", avatar: "J" },
    { id: 7, user: "art_daily", avatar: "I" },
  ];

  const posts: Post[] = [
    {
      id: 1,
      user: "travel_diaries",
      avatar: "✈️",
      location: "Paris, France",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=600&fit=crop",
      likes: 1234,
      caption: "Sunset views from the Eiffel Tower 🌅",
      timeAgo: "2 hours ago",
    },
    {
      id: 2,
      user: "foodie_life",
      avatar: "🍕",
      location: "New York, NY",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop",
      likes: 892,
      caption: "Homemade pizza night! Recipe in bio 🍕",
      timeAgo: "5 hours ago",
    },
    {
      id: 3,
      user: "art_daily",
      avatar: "🎨",
      location: "Brooklyn, NY",
      image:
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=600&fit=crop",
      likes: 2156,
      caption: "New abstract piece finished today 🎨✨",
      timeAgo: "8 hours ago",
    },
  ];

  const toggleLike = (postId: number) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleSave = (postId: number) => {
    setSavedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };
  // if(!authUser) return;
  return (
    <div>
      <UserButton />
    </div>
    // <div className="min-h-screen bg-background text-foreground flex justify-center">
    //   {/* Main wrapper */}
    //   <div className="max-w-5xl w-full flex gap-8 pt-10  px-4">
    //     {/* Feed */}
    //     <div className="w-[65%] max-h-[calc(100vh-2.5rem)] my-scroll overflow-y-auto">
    //       {/* Stories */}
    //       <div className="bg-card border border-border rounded-lg px-4 pt-6 mb-6 overflow-hidden">
    //         <div className="flex gap-4 overflow-x-auto pb-3">
    //           {/* Own story */}
    //           <div className="flex flex-col justify-center items-center gap-1 flex-shrink-0">
    //             <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-muted">
    //               <div className="w-full h-full bg-card overflow-hidden rounded-full flex items-center justify-center">
    //                 {/* <img
    //                   src={authUser.profilePic || "/user avatar.png"}
    //                   alt="user image"
    //                   className="object-cover h-full w-full"
    //                 /> */}
    //               </div>
    //             </div>
    //             <span className="text-xs text-foreground truncate">
    //               Your Story
    //             </span>
    //           </div>

    //           {/* Other stories */}
    //           {stories.map((story) => (
    //             <div
    //               key={story.id}
    //               className="flex flex-col items-center gap-1 flex-shrink-0"
    //             >
    //               <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
    //                 <div className="w-full h-full bg-card rounded-full flex items-center justify-center">
    //                   {story.avatar}
    //                 </div>
    //               </div>
    //               <span className="text-xs text-foreground truncate">
    //                 {story.user}
    //               </span>
    //             </div>
    //           ))}
    //         </div>
    //       </div>

    //       {/* Posts */}
    //       {posts.map((post) => (
    //         <article
    //           key={post.id}
    //           className="bg-card border border-border rounded-lg mb-3 max-w-[500px] mx-auto"
    //         >
    //           <div className="flex items-center justify-between px-3 py-2">
    //             <div className="flex items-center gap-2">
    //               <div className="w-8 h-8 rounded-full p-[1px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
    //                 <div className="w-full h-full bg-card rounded-full flex items-center justify-center text-base">
    //                   {post.avatar}
    //                 </div>
    //               </div>
    //               <div>
    //                 <p className="font-semibold text-sm text-foreground">
    //                   {post.user}
    //                 </p>
    //                 <p className="text-xs text-muted-foreground">
    //                   {post.location}
    //                 </p>
    //               </div>
    //             </div>
    //             <MoreHorizontal className="w-4 h-4 cursor-pointer text-muted-foreground" />
    //           </div>

    //           <img
    //             src={post.image}
    //             alt={post.caption}
    //             className="w-full h-90 object-cover rounded-none"
    //           />

    //           <div className="px-3 py-2">
    //             <div className="flex items-center justify-between mb-1">
    //               <div className="flex items-center gap-3">
    //                 <Heart
    //                   className={`w-5 h-5 cursor-pointer ${
    //                     likedPosts[post.id]
    //                       ? "fill-destructive text-destructive"
    //                       : "text-foreground"
    //                   }`}
    //                   onClick={() => toggleLike(post.id)}
    //                 />
    //                 <MessageCircle className="w-5 h-5 cursor-pointer text-foreground" />
    //                 <Send className="w-5 h-5 cursor-pointer text-foreground" />
    //               </div>
    //               <Bookmark
    //                 className={`w-5 h-5 cursor-pointer ${
    //                   savedPosts[post.id]
    //                     ? "fill-accent text-accent"
    //                     : "text-foreground"
    //                 }`}
    //                 onClick={() => toggleSave(post.id)}
    //               />
    //             </div>

    //             <p className="font-semibold text-sm mb-1 text-foreground">
    //               {post.likes + (likedPosts[post.id] ? 1 : 0)} likes
    //             </p>

    //             <p className="text-sm mb-1 text-foreground">
    //               <span className="font-semibold mr-1">{post.user}</span>
    //               {post.caption}
    //             </p>

    //             <p className="text-xs text-muted-foreground uppercase">
    //               {post.timeAgo}
    //             </p>
    //           </div>
    //         </article>
    //       ))}
    //     </div>

    //     {/* Sidebar */}
    //     <aside className="hidden h-full overflow-y-hidden  lg:block w-[35%]">
    //       <div className="">
    //         {/* Current User */}
    //         <div className="flex items-center gap-3 mb-6">
    //           <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-2xl overflow-hidden">
    //             {/* <img
    //               src={authUser.profilePic}
    //               alt="Current User"
    //               className="w-full h-full rounded-full object-cover"
    //             /> */}
    //           </div>
    //           <div className="flex-1">
    //             <p className="font-semibold text-sm text-foreground">
    //               {/* {authUser.userName} */}
    //             </p>
    //             <p className="text-muted-foreground text-sm">
    //               {/* {authUser.fullName} */}
    //             </p>
    //           </div>
    //           <button className="text-accent text-xs font-semibold hover:underline transition">
    //             Switch
    //           </button>
    //         </div>

    //         {/* Suggestions */}
    //         <div>
    //           <div className="flex items-center justify-between mb-4">
    //             <p className="text-muted-foreground font-semibold text-sm">
    //               Suggestions For You
    //             </p>
    //             <button className="text-xs font-semibold text-accent hover:underline transition">
    //               See All
    //             </button>
    //           </div>

    //           {[
    //             { user: "photo_artist", name: "Photo Artist", avatar: "📷" },
    //             { user: "music_beats", name: "Music Beats", avatar: "🎵" },
    //             { user: "code_master", name: "Code Master", avatar: "⚡" },
    //             { user: "design_hub", name: "Design Hub", avatar: "🎯" },
    //             { user: "nature_lover", name: "Nature Lover", avatar: "🌿" },
    //           ].map((suggestion, i) => (
    //             <Link
    //               to={`/profile/${suggestion.user}`}
    //               key={i}
    //               className="flex items-center gap-3 mb-3 p-2 rounded-lg hover:bg-accent transition-colors"
    //             >
    //               <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
    //                 {suggestion.avatar}
    //               </div>
    //               <div className="flex-1">
    //                 <p className="font-semibold text-sm text-foreground">
    //                   {suggestion.user}
    //                 </p>
    //                 <p className="text-xs text-muted-foreground">
    //                   {suggestion.name}
    //                 </p>
    //               </div>
    //               <button className="text-accent text-xs font-semibold hover:underline transition">
    //                 Follow
    //               </button>
    //             </Link>
    //           ))}
    //         </div>

    //         {/* Footer */}
    //         <div className="mt-8 text-xs text-muted-foreground">
    //           <p className="mb-2">
    //             About · Help · Press · API · Jobs · Privacy
    //           </p>
    //           <p className="mb-2">
    //             Terms · Locations · Language · Meta Verified
    //           </p>
    //           <p className="mt-4">© 2024 INSTAGRAM FROM META</p>
    //         </div>
    //       </div>
    //     </aside>
    //   </div>
    // </div>
  );
}
