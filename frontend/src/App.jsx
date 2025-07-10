import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import LandingPage from "./features/shared/pages/LandingPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import LoginPage from "./features/auth/pages/LoginPage";
import ProfilePage from "./features/user/pages/ProfilePage";
import PrivateRoute from "./routes/PrivateRoute";
import { setUser } from "./features/auth/store/authSlice";
import axiosClient from "./api/axiosClient";
import { Toaster } from "sonner";
import SpinLoader from "./features/shared/components/SpinLoader";
import VerifyEmailPage from "./features/auth/pages/VerifyEmailPage";

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      (async () => {
        try {
          const res = await axiosClient.get(`/user/me`);
          dispatch(setUser(res?.data?.data?.user));
        } catch (err) {
          dispatch(setUser(null));
          console.log("Error : ", err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []);

  if (isLoading || loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 to-zinc-900 text-zinc-100 px-4 py-10">
        <SpinLoader />
      </div>
    );

  return (
    <div className="dark">
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/profile" replace /> : <RegisterPage />}
        />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/profile" replace /> : <LoginPage />}
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<div>404 - Not Found</div>} />
      </Routes>
    </div>
  );
};

export default App;
