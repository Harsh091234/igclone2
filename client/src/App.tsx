import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import FeedPage from "./pages/FeedPage";
// import ProfilePage from "./pages/ProfilePage";
// import UserSetupPage from "./pages/UserSetupPage";



// import ProtectedRoutes from "./utils/ProtectedRoutes";
// import SettingsPage from "./pages/SettingsPage";
// import EditProfilePage from "./pages/SettingPages/EditProfilePage";
// import LeftSideBar from "./components/LeftSideBar";
import { useTheme } from "./utils/ThemeProvider";
import { Sun } from "lucide-react";
import { useGetAuthUserQuery, useSyncUserMutation } from "./services/userApi";
import CenterLoading from "./components/CenterLoading";

const App = () => {
  const { user, isSignedIn, isLoaded } = useUser();
 const [syncUser] = useSyncUserMutation();
 const { data, isLoading, refetch} = useGetAuthUserQuery(undefined, {
  skip: !isLoaded || !isSignedIn,
 });
  const {theme, setTheme} = useTheme();
const authUser = data?.user;
  
  useEffect(() => {
    console.log("auth user:", authUser);
  }, [authUser]);

  useEffect(() => {
    if (isSignedIn && user && isLoaded && !isLoading && !authUser) {
      //if not then store user
         (async () => {
           await syncUser().unwrap(); // 👈 wait until user is stored
           refetch(); // 👈 now fetch again
         })();
      
       
      
    
    }
  }, [isLoaded, isSignedIn, user, authUser, isLoading]);

  const handleTheme = () => {
    if(theme === "light"){
      setTheme("dark");
    }
    else{
      setTheme("light");
    }
  }
    if (isLoading) return <CenterLoading />;

  return (
    <div className="">
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <div className="flex max-h-screen overflow-hidden ">
          <button
            onClick={handleTheme}
            className="
        flex absolute bottom-10 z-50 right-10 items-center justify-center
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

          <div className="w-[7%]">
            {/* <LeftSideBar /> */}
          </div>
          <div className="w-[93%] overflow-y-auto">
            <Routes>
              <Route
                path="/"
                element={
                  
                   <FeedPage />
                
                }
              />

              {/* <Route
                path="/onboarding"
                element={
                  
                    <UserSetupPage />
                
                }
              /> */}

              {/* <Route
                path="profile/:name"
                element={
              
                    <ProfilePage />
                 
                }
              />

              <Route
                path="/settings"
                element={
                
                    <SettingsPage />
               
                }
              >
                {" "}
                <Route index element={<Navigate to="edit-profile" replace />} />
                <Route path="edit-profile" element={<EditProfilePage />} />
              </Route> */}
            </Routes>
          </div>
        </div>
      </SignedIn>
    </div>
  );
};

export default App;
