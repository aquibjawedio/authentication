import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/store/authSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

export { store };
