import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import NotFoundPage from "../pages/NotFoundPage";
import EditProfilePage from "../pages/SettingPages/EditProfilePage";
import SettingsIndexRedirect from "../utils/SettingIndexRedirect";
import SettingsPage from "../pages/SettingsPage";

import UserSetupPage from "../pages/UserSetupPage";
import ExplorePage from "../pages/ExplorePage";
import ReelsPage from "../pages/ReelsPage";
import ProfilePage from "../pages/ProfilePage";
import NotificationPage from "../pages/NotificationPage";
import MessagePage from "../pages/MessagePage";
import FeedPage from "../pages/FeedPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResendVerificationPage from "../pages/ResendVerificationPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { PublicOnlyRoute } from "./PublicOnlyRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ONLY ROUTES */}
      <Route path="/register" element={
        <PublicOnlyRoute>
         <RegisterPage />
          </PublicOnlyRoute>
        } />
      <Route path="/login" element={
         <PublicOnlyRoute>
          <LoginPage />
           </PublicOnlyRoute> 
        } />
      


    {/* SHARED ROUTES */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    

      {/* MAIN APP (WITH SIDEBAR) */}
      {/* PROTECTED ROUTES */}
<Route element={<ProtectedRoutes />}>
  <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/resend-verification-url" element={<ResendVerificationPage />} />
      <Route path="/check-email" element={<CheckEmailPage />} />
    

</Route>
   
      <Route element={<ProtectedRoutes> <MainLayout /></ProtectedRoutes>   }>
        <Route path="/" element={<FeedPage />} />
       
        <Route
          path="/messages"
          element={<MessagePage />}
        />
        <Route
          path="/notifications"
          element={<NotificationPage />}
        />
        <Route
          path="/profile/:name"
          element={<ProfilePage />}
        />
        <Route
          path="/reels"
          element={<ReelsPage />}
        />
        <Route
          path="/explore"
          element={<ExplorePage />}
        />
        <Route
          path="/onboarding"
          element={<UserSetupPage />}
        />

        {/* SETTINGS */}
        <Route
          path="/settings"
          element={<SettingsPage />}
        >
          <Route index element={<SettingsIndexRedirect />} />
          <Route path="edit-profile" element={<EditProfilePage />} />
        </Route>

           {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
      </Route>

     
    </Routes>
  );
};

export default AppRoutes;