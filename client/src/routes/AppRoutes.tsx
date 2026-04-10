import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import NotFoundPage from "../pages/NotFoundPage";
import EditProfilePage from "../pages/SettingPages/EditProfilePage";
import SettingsIndexRedirect from "../utils/SettingIndexRedirect";
import SettingsPage from "../pages/SettingsPage";
import { ProtectedRoutes } from "../utils/ProtectedRoutes";
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

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/resend-verification-url" element={<ResendVerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* MAIN APP (WITH SIDEBAR) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<FeedPage />} />

        <Route
          path="/messages"
          element={<ProtectedRoutes><MessagePage /></ProtectedRoutes>}
        />
        <Route
          path="/notifications"
          element={<ProtectedRoutes><NotificationPage /></ProtectedRoutes>}
        />
        <Route
          path="/profile/:name"
          element={<ProtectedRoutes><ProfilePage /></ProtectedRoutes>}
        />
        <Route
          path="/reels"
          element={<ProtectedRoutes><ReelsPage /></ProtectedRoutes>}
        />
        <Route
          path="/explore"
          element={<ProtectedRoutes><ExplorePage /></ProtectedRoutes>}
        />
        <Route
          path="/onboarding"
          element={<UserSetupPage />}
        />

        {/* SETTINGS */}
        <Route
          path="/settings"
          element={<ProtectedRoutes><SettingsPage /></ProtectedRoutes>}
        >
          <Route index element={<SettingsIndexRedirect />} />
          <Route path="edit-profile" element={<EditProfilePage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;