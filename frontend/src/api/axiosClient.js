import { setAuthLoading } from "../features/auth/store/authSlice";
import { store } from "./store";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const axiosClient = axios.create({
  baseURL: `${backendUrl}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = () => {
  refreshSubscribers.map((cb) => cb());
  refreshSubscribers = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(axiosClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      console.log("originalRequest => --  ", originalRequest);
      isRefreshing = true;

      try {
        store.dispatch(setAuthLoading(true));

        await axiosClient.post("/auth/refresh-access-token");
        isRefreshing = false;
        store.dispatch(setAuthLoading(false));

        onRefreshed();

        return axiosClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        store.dispatch(setAuthLoading(false));

        window.location.href.replace("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default axiosClient;
