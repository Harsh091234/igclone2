import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import UserSetupPage from "./pages/UserSetupPage";
import SettingsPage from "./pages/SettingsPage";
import EditProfilePage from "./pages/SettingPages/EditProfilePage";
import LeftSideBar from "./components/LeftSideBar";
// import { useTheme } from "./utils/ThemeProvider";
// import { Moon, Sun } from "lucide-react";
import { useGetAuthUserQuery, useSyncUserMutation } from "./services/userApi";
// import CenterLoading from "./components/CenterLoading";
import NotFoundPage from "./pages/NotFoundPage";
import CenterLoading from "./components/CenterLoading";
import { ProtectedRoutes } from "./utils/ProtectedRoutes";
import SettingsIndexRedirect from "./utils/SettingIndexRedirect";
import ReelsPage from "./pages/ReelsPage";
import MessagePage from "./pages/MessagePage";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store/store";
import { connectSocket, disconnectSocket } from "./utils/socket";
import { setConnected, setOnlineUsers } from "./redux/socketSlice";
import { useAppSelector } from "./utils/hooks";
import NotificationPage from "./pages/NotificationPage";

const App = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [syncUser, { isLoading: syncUserLoading }] = useSyncUserMutation();
  const { onlineUsers, connected } = useAppSelector((state) => state.socket);

  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, refetch } = useGetAuthUserQuery(undefined, {
    skip: !isLoaded || !isSignedIn,
  });
  // const { theme, setTheme } = useTheme();
  const authUser = data?.user;

  useEffect(() => {
    if (isLoaded && isSignedIn && !syncUserLoading && !authUser) {
      syncUser()
        .unwrap()
        .then(() => {
          refetch(); // refetch after syncing
        })
        .catch(console.error);
    }
  }, [isLoaded, isSignedIn, syncUserLoading, authUser, syncUser, refetch]);

  useEffect(() => {
    console.log("🟢 Redux socket state:", {
      connected,
      onlineUsers,
    });
  }, [connected, onlineUsers]);

  useEffect(() => {
    if (!authUser?._id) return;

    const socket = connectSocket(authUser._id);

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      dispatch(setConnected(true));
    });
    socket.on(
      "getOnlineUsers",
      (users: { userId: string; lastActive: number }[]) => {
        const userMap: Record<string, number> = {};
        users.forEach((u) => (userMap[u.userId] = u.lastActive));
        dispatch(setOnlineUsers(userMap));
      },
    );

    socket.on("disconnect", () => {
      dispatch(setConnected(false));
    });

    return () => {
      socket.off("getOnlineUsers");
      disconnectSocket();
    };
  }, [authUser?._id, dispatch]);

  // const handleTheme = () => {
  //   if (theme === "light") {
  //     setTheme("dark");
  //   } else {
  //     setTheme("light");
  //   }
  // };

  if (!isLoaded || isLoading || syncUserLoading) return <CenterLoading />;
  return (
    <div className="h-screen ">
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="  h-full grid grid-cols-1 items-start   lg:grid-cols-[60px_1fr] xl:grid-cols-[75px_1fr] overflow-hidden">
          {/* <button
            onClick={handleTheme}
            className="
    flex absolute bottom-10 right-10 z-50
    items-center justify-center
    px-3 py-3
    rounded-full

    bg-neutral-200 dark:bg-neutral-900
    border border-neutral-300 dark:border-neutral-700
    text-foreground
   
    shadow-lg 
    hover:shadow-xl
    active:shadow-inner

    transition-all duration-300
  "
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button> */}

          <LeftSideBar />

          <div className="h-full">
            <Routes>
              <Route
                path="/sign-in/*"
                element={<SignIn path="/sign-in" routing="path" />}
              />
              <Route
                path="/"
                element={
                  <ProtectedRoutes>
                    <FeedPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="/messages"
                element={
                  <ProtectedRoutes>
                    <MessagePage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="/notifications"
                element={
                  <ProtectedRoutes>
                    <NotificationPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="/onboarding"
                element={
                  <ProtectedRoutes>
                    <UserSetupPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="/profile/:name"
                element={
                  <ProtectedRoutes>
                    <ProfilePage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="/reels"
                element={
                  <ProtectedRoutes>
                    <ReelsPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoutes>
                    <SettingsPage />
                  </ProtectedRoutes>
                }
              >
                {" "}
                <Route index element={<SettingsIndexRedirect />} />
                <Route
                  path="edit-profile"
                  element={
                    <ProtectedRoutes>
                      <EditProfilePage />
                    </ProtectedRoutes>
                  }
                />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </div>
      </SignedIn>
    </div>
  );
};

export default App;
