import axiosClient from "@/api/axiosClient";
import { store } from "@/api/store";
import { clearUser } from "@/features/auth/store/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const getUserProfile = () => axiosClient.get("/user/me");
export const updateUserProfile = (data) =>
  axiosClient.put("/user/update", data);

export const handleLogout = async () => {
  try {
    const response = await axiosClient.post("/auth/logout");
    if (response.status === 200) {
      toast.success("Logged out successfully!", {
        duration: 3000,
        position: "top-right",
      });
    }
    store.dispatch(clearUser());
    return response.data.data.user;
  } catch (error) {
    toast.error("Logout failed. Please try again.", {
      duration: 3000,
      position: "top-right",
    });
    console.error("Logout failed:", error);
  }
};
