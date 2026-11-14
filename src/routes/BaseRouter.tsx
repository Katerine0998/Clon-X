import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth/pages/LoginPage";
import { RegisterPage } from "../auth/pages/RegisterPage";
import { PrivateRoute } from "./PrivateRoute";
import { HomePage } from "../pages/HomePage";
import { ComposeTweetPage } from "../pages/ComposeTweetPage";
import { FeedPage } from "../pages/FeedPage";
import { FollowingPage } from "../pages/FollowingPage";
import { FollowersPage } from "../pages/FollowersPage";
import { UserTweetsPage } from "../pages/UserTweetsPage";
import { NewPostPage } from "../blog/Pages/NewPostPage";

export const BaseRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Private routes (require login) */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tweet" element={<ComposeTweetPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/following" element={<FollowingPage />} />
        <Route path="/followers" element={<FollowersPage />} />
        <Route path="/user/:username" element={<UserTweetsPage />} />
        <Route path="/user/:username/following" element={<FollowingPage />} />
        <Route path="/user/:username/followers" element={<FollowersPage />} />
        {/* Base example from the course (blog) */}
        <Route path="/new-post" element={<NewPostPage />} />
      </Route>

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};
