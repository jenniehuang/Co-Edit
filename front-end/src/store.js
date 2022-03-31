import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./redux/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
