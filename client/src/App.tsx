import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { useEffect } from "react";
import {  Route, Routes } from "react-router-dom";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import UserSetupPage from "./pages/UserSetupPage";

import SettingsPage from "./pages/SettingsPage";
import EditProfilePage from "./pages/SettingPages/EditProfilePage";
import LeftSideBar from "./components/LeftSideBar";
import { useTheme } from "./utils/ThemeProvider";
import { Sun } from "lucide-react";
import { useGetAuthUserQuery, useSyncUserMutation } from "./services/userApi";
// import CenterLoading from "./components/CenterLoading";
import NotFoundPage from "./pages/NotFoundPage";
import CenterLoading from "./components/CenterLoading";
import { ProtectedRoutes } from "./utils/ProtectedRoutes";
import SettingsIndexRedirect from "./utils/SettingIndexRedirect";

const App = () => {
  const {  isSignedIn, isLoaded } = useUser();
  const [syncUser, {isLoading: syncUserLoading}] = useSyncUserMutation();
 
  const { data, isLoading, refetch} = useGetAuthUserQuery(undefined, {
    skip: !isLoaded || !isSignedIn,
  });
  const { theme, setTheme } = useTheme();
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
  


  const handleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  
  if (!isLoaded || isLoading || syncUserLoading) return <CenterLoading />;
  return (
    <div className="">
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <div className="flex h-screen   flex-col sm:flex-row overflow-hidden ">
          <button
            onClick={handleTheme}
            className="
        flex  absolute bottom-10 z-50 right-10 items-center justify-center
        px-3 py-3
        rounded-full
        bg-muted
        text-foreground
        shadow-md
        hover:shadow-lg
        active:shadow-inner
        transition-all duration-300
      "
          >
            <Sun className="w-5 h-5  transition-colors duration-300 text-foreground" />
          </button>

          <div className="sm:w-[7%] order-2 sm:order-1  h-[10%] sm:h-full w-full">
            <LeftSideBar />
          </div>
          <div className="w-full order-1 sm:order-2 sm:w-[93%] h-[90%] sm:h-full">
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
                path="/onboarding"
                element={
                  <ProtectedRoutes>
                    <UserSetupPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="profile/:name"
                element={
                  <ProtectedRoutes>
                    <ProfilePage />
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
