import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import UserSetupPage from "./pages/UserSetupPage";
import { useInitUser } from "./utils/syncUser";
import { useSelector } from "react-redux";
import { selectUser } from "./features/user/userSlice";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import SettingsPage from "./pages/SettingsPage";
import EditProfilePage from "./pages/SettingPages/EditProfilePage";

const App = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const initUser = useInitUser();
  const authUser = useSelector(selectUser);

  //for auth user
  useEffect(() => {
    console.log("auth user:", authUser);
  }, [[authUser]]);

  useEffect(() => {
    if (isSignedIn && user && isLoaded) {
      initUser(user);
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <header>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <Routes>
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
            <Route index element={<Navigate to="edit-profile" replace />} />
            <Route path="edit-profile" element={<EditProfilePage />} />
          </Route>
        </Routes>
      </SignedIn>
    </header>
  );
};

export default App;
