import { UserButton } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
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

import { Link, useNavigate } from "react-router-dom";
import { useGetAuthUserQuery } from "../services/userApi";
import CenterLoading from "../components/CenterLoading";
import { useGetAllPostsQuery } from "../services/postApi";
import FullPostSkeleton from "../components/Skeletons/FullPostSkeleton";
import UserPostCard from "../components/UserPostCard";
import type { Post } from "../types/post.types";

interface Story {
  id: number;
  user: string;
  avatar: string;
  isOwn?: boolean;
}



export default function FeedPage() {
 
  const {isLoading: isPostLoading, data: postData} = useGetAllPostsQuery();

 
  const navigate = useNavigate();
  const stories: Story[] = [
    { id: 1, user: "Your Story", avatar: "😜", isOwn: true },
    { id: 2, user: "alice_wonder", avatar: "🐱‍👤" },
    { id: 3, user: "travel_diaries", avatar: "💋" },
    { id: 4, user: "foodie_life", avatar: "😎" },
    { id: 5, user: "tech_guru", avatar: "A" },
    { id: 6, user: "fitness_pro", avatar: "J" },
    { id: 7, user: "art_daily", avatar: "I" },
  ];

  const posts = postData?.posts;

  // const toggleLike = (postId: number) => {
  //   setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  // };

  // const toggleSave = (postId: number) => {
  //   setSavedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  // };
 useEffect(() => { const fn = () => {
  if(!isPostLoading) {
 console.log("postin feed:", posts);
  }
 } 
fn()
}, [posts])
  const {data} = useGetAuthUserQuery();

  const authUser = data?.user;
  if(!authUser) return <CenterLoading />
 

  return (
    // <div>
    //   <UserButton />
    // </div>
    <div className="min-h-screen bg-background text-foreground flex justify-center">
      {/* Main wrapper */}
      <div className="max-w-5xl w-full flex gap-8 pt-10  px-4">
        {/* Feed */}
        <div className="w-[65%] max-h-[calc(100vh-2.5rem)] my-scroll overflow-y-auto">
          {/* Stories */}
          <div className="bg-card border border-border rounded-lg px-4 pt-6 mb-6 overflow-hidden">
            <div className="flex gap-4 overflow-x-auto pb-3">
              {/* Own story */}
              <div className="flex flex-col justify-center items-center gap-1 flex-shrink-0">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-muted">
                  <div className="w-full h-full bg-card overflow-hidden rounded-full flex items-center justify-center">
                    <img
                      src={authUser.profilePic || "/user avatar.png"}
                      alt="user image"
                      className="object-cover h-full w-full"
                    />
                  </div>
                </div>
                <span className="text-xs text-foreground truncate">
                  Your Story
                </span>
              </div>

              {/* Other stories */}
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="flex flex-col items-center gap-1 flex-shrink-0"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
                    <div className="w-full h-full bg-card rounded-full flex items-center justify-center">
                      {story.avatar}
                    </div>
                  </div>
                  <span className="text-xs text-foreground truncate">
                    {story.user}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Posts */}
          {isPostLoading ? (
            <FullPostSkeleton />
          ) : posts && posts.length > 0 ? (
            posts.map((post: Post) => (
              <UserPostCard key={post._id} post={post} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <p className="text-sm">No posts present on feed</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden h-full overflow-y-hidden  lg:block w-[35%]">
          <div className="">
            {/* Current User */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-14 h-14 rounded-full bg-muted flex items-center pointer justify-center text-2xl overflow-hidden"
                onClick={() => navigate(`/profile/${authUser.userName}`)}
              >
                <img
                  src={authUser.profilePic}
                  alt="Current User"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground">
                  {authUser.userName}
                </p>
                <p className="text-muted-foreground text-sm">
                  {authUser.fullName}
                </p>
              </div>
              <button className="text-accent text-xs font-semibold hover:underline transition">
                Switch
              </button>
            </div>

            {/* Suggestions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground font-semibold text-sm">
                  Suggestions For You
                </p>
                <button className="text-xs font-semibold text-muted-foreground  hover:text-foreground hover:underline transition">
                  See All
                </button>
              </div>

              {[
                { user: "photo_artist", name: "Photo Artist", avatar: "📷" },
                { user: "music_beats", name: "Music Beats", avatar: "🎵" },
                { user: "code_master", name: "Code Master", avatar: "⚡" },
                { user: "design_hub", name: "Design Hub", avatar: "🎯" },
                { user: "nature_lover", name: "Nature Lover", avatar: "🌿" },
              ].map((suggestion, i) => (
                <Link
                  to={`/profile/${suggestion.user}`}
                  key={i}
                  className="flex items-center gap-3 mb-3 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                    {suggestion.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {suggestion.user}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {suggestion.name}
                    </p>
                  </div>
                  <button
                    className="text-foreground/70 text-xs font-semibold
             hover:text-foreground hover:underline
             transition-colors"
                  >
                    Follow
                  </button>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-8 text-xs text-muted-foreground">
              <p className="mb-2">
                About · Help · Press · API · Jobs · Privacy
              </p>
              <p className="mb-2">
                Terms · Locations · Language · Meta Verified
              </p>
              <p className="mt-4">© 2024 INSTAGRAM FROM META</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
