import axiosClient from "@/api/axiosClient";
import { store } from "@/api/store";
import { toast } from "sonner";
import { setUser } from "../store/authSlice";

export const handleLogin = async (data) => {
  try {
    const response = await axiosClient.post("/auth/login", data);
    toast("Login successful", {
      variant: "success",
    });
    const userData = response.data.data.user;
    store.dispatch(setUser(userData));
    return response.data;
  } catch (error) {
    toast(
      "Login failed:" + (error.response?.data?.message || "Unknown error"),
      {
        variant: "destructive",
      }
    );
    store.dispatch(setUser(null));
    console.log("Login error:", error);
  }
};

export const handleRegister = async (data) => {
  try {
    const response = await axiosClient.post("/auth/register", data);
    toast.success(response.data.data.message || "User registred");
    return response.data;
  } catch (error) {
    toast(
      "Register failed:" + (error.response?.data?.message || "Unknown error"),
      {
        variant: "destructive",
      }
    );
    throw error;
  }
};

export const handleVerifyEmail = async (token) => {
  try {
    const response = await axiosClient.post(`/auth/verify-email/${token}`);
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Verification failed";
    return { success: false, error: errorMessage, raw: error };
  }
};

export const handleGetCurrentUser = () => axiosClient.get("/auth/me");
