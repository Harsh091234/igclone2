import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Grid, PlaySquare, Tag } from "lucide-react";
import Highlights from "../components/Highlights";
import PostCard from "../components/PostCard";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProfileUser,
  getProfile,
  selectUserLoading,
} from "../features/user/userSlice";
import { selectUser, getAuthUser } from "../features/user/userSlice";
import { useAuth } from "@clerk/clerk-react";
import type { AppDispatch } from "../store/store";
import CenterLoading from "../components/CenterLoading";
import useDragScroll from "../utils/useDragScroll";


const ProfilePage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
 
  
  const { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove } =
    useDragScroll();
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();
  const user = useSelector(selectProfileUser);
  const authUser = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);

  const handleClick = () => {
    
    navigate('/settings/edit-profile');
  }

  useEffect(() => {
    const getDetails = async () => {
      const token: string | null = await getToken();
      if (!token) return;

      if (name) {
        const res = await dispatch(getProfile({ token, name }));
        if (getProfile.rejected.match(res)) return navigate("/");

        dispatch(getAuthUser(token));
      }
    };

    getDetails();
  }, [name, dispatch]);
  const isAuthUser = authUser?._id === user?._id;

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

  if (loading || !user) return <CenterLoading />;

  return (
    <div
      className="min-h-screen 
     flex justify-center px-30 py-6"
    >
      <div className="w-full max-w-4xl mt-13">
        {/* TOP SECTION */}

        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-30 mb-8">
          <img
            src={user.profilePic || "/default user.jpg"}
            alt="Profile"
            className="w-24 h-24 sm:w-32 sm:h-32 md:h-39 md:w-39 rounded-full object-cover border border-zinc-700 mx-auto sm:mx-0"
          />

          <div className="flex-1 flex flex-col sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div className="flex items-center gap-8">
                <h2 className="text-2xl font-semibold">@{user.userName}</h2>

                {isAuthUser && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleClick}
                      className="
      px-4 py-1.5 rounded-lg text-xs font-medium
      bg-secondary text-secondary-foreground
      border border-border
      hover:bg-secondary/80
      transition-all duration-200
    "
                    >
                      Edit Profile
                    </button>

                    <button
                      className="
      px-4 py-1 rounded-lg text-xs font-medium
      bg-secondary text-secondary-foreground
      border border-border
      hover:bg-secondary/80
      transition-all duration-200
    "
                    >
                      Settings
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4 text-center sm:text-left">
              <p className="font-semibold text-lg">{user.fullName}</p>
              <p className="text-zinc-400 text-sm">
                {user.bio || "No bio yet"}
              </p>
            </div>

            <div className="flex justify-center sm:justify-start gap-6  mb-2">
              <button>
                <strong>{posts.length}</strong> posts
              </button>
              <button>
                <strong>{user.followers?.length || 0}</strong> followers
              </button>
              <button>
                <strong>{user.following?.length || 0}</strong> following
              </button>
            </div>
          </div>
        </div>

        {/* HIGHLIGHTS */}

        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto mb-6 my-scroll"
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
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
