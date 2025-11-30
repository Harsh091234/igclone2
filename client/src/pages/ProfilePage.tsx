import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Settings, Grid, PlaySquare, Tag } from "lucide-react";
import Highlights from "../components/Highlights";
import PostCard from "../components/PostCard";
import { useDispatch, useSelector } from "react-redux";
import {selectUser, getProfile, selectUserLoading} from "../features/user/userSlice"
import {selectUser as selectAuthUser, getAuthUser} from "../features/user/userSlice"
import { useAuth } from "@clerk/clerk-react";
import type { AppDispatch } from "../store/store";


const ProfilePage = () => {
  const { userName } = useParams();
  const dispatch = useDispatch<AppDispatch>();
    const {getToken} = useAuth()
  const user = useSelector(selectUser);
  const authUser = useSelector(selectAuthUser);
  const loading = useSelector(selectUserLoading)


  useEffect(() => {
    const getDetails = async() => {
       
    
        const token: string | null= await getToken();
        if(!token) return;
      
        
    if (userName) {
     
      dispatch(getProfile({token, userName }));
         
    //   dispatch(getAuthUser(token));
    }
    }
 
    getDetails();
  }, [userName, dispatch]);
    const isAuthUser = authUser?.userName === user?.userName;


    const highlightsData = [
  {
    title: "Travel",
    img: "https://picsum.photos/200?1",
  },
  {
    title: "Travel",
    img: "https://picsum.photos/200?1",
  },
  {
    title: "Travel",
    img: "https://picsum.photos/200?1",
  },
  {
    title: "Travel",
    img: "https://picsum.photos/200?1",
  },

  {
    title: "Food",
    img: "https://picsum.photos/200?2",
  },
  {
    title: "Art",
    img: "https://picsum.photos/200?3",
  },
  {
    title: "Friends",
    img: "https://picsum.photos/200?4",
  },
  {
    title: "Pets",
    img: "https://picsum.photos/200?5",
  },
];

  // Mock user data – replace with your fetched data
 

  // Mock posts
 
  const posts = [
  { id: 1, img: "https://picsum.photos/600?10" },
  { id: 2, img: "https://picsum.photos/600?11" },
  { id: 3, img: "https://picsum.photos/600?12" },
  { id: 4, img: "https://picsum.photos/600?13" },
  { id: 5, img: "https://picsum.photos/600?14" },
  { id: 6, img: "https://picsum.photos/600?15" },
];

if(!user) return <>Loading .....</>
  return (
  <div className="min-h-screen bg-black text-white flex justify-center">
    <div className="w-full max-w-4xl px-4 py-6">

      {/* TOP SECTION */}
      
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
          <img
            src={user.profilePic || "/default user.jpg"}
            alt="Profile"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border border-zinc-700 mx-auto sm:mx-0"
          />

          <div className="flex-1 flex flex-col sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">@{user.userName}</h2>

                {isAuthUser && (
                  <div className="flex gap-2">
                    <button className="px-3 py-1 border rounded hover:bg-zinc-700">
                      Edit Profile
                    </button>
                    <button className="px-3 py-1 border rounded hover:bg-zinc-700">
                      Settings
                    </button>
                  </div>
                )}
              </div>

              <button className="bg-zinc-800 px-2 py-1 rounded hover:bg-zinc-700">
                <Settings size={18} />
              </button>
            </div>

            <div className="mb-4 text-center sm:text-left">
              <p className="font-semibold text-lg">{user.fullName}</p>
              <p className="text-zinc-400 text-sm">{user.bio || "No bio yet"}</p>
            </div>

            <div className="flex justify-center sm:justify-start gap-6 text-sm mb-2">
              <span><strong>{posts.length}</strong> posts</span>
              <span><strong>{user.followers?.length || 0}</strong> followers</span>
              <span><strong>{user.following?.length || 0}</strong> following</span>
            </div>
          </div>
        </div>
      
       
      

      {/* HIGHLIGHTS */}
      


      <div className="flex gap-4 overflow-x-auto mb-6 ">
        {highlightsData.map((h, i) => (
          <Highlights key={i} title={h.title} img={h.img} />
          
        ))}
      </div>

      {/* TABS */}
      <div className="flex justify-around border-t border-zinc-800 mb-2">
        <button className="flex items-center gap-1 px-4 py-2 text-sm border-t border-white">
          <Grid size={16} /> Posts
        </button>
        <button className="flex items-center gap-1 px-4 py-2 text-sm text-zinc-400">
          <PlaySquare size={16} /> Reels
        </button>
        <button className="flex items-center gap-1 px-4 py-2 text-sm text-zinc-400">
          <Tag size={16} /> Tagged
        </button>
      </div>

      {/* POSTS GRID */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-1 mt-2">
        {posts.map((post) => (
          <PostCard key={post.id} img={post.img} />
        ))}
      </div>
    </div>
  </div>
);

};

export default ProfilePage;