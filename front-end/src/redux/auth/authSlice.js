import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import AuthServices from "../../services/auth-services";
import UserServices from "../../services/user-services";

//get user from localstorage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  isErr: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

//------------------------------login
export const login = createAsyncThunk("/login", async (user, thunkAPI) => {
  try {
    return await AuthServices.login(user);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

//-------------------------------signup
export const signup = createAsyncThunk("/signup", async (user, thunkAPI) => {
  try {
    return await AuthServices.signup(user);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

//--------------------------------logout
export const logout = createAsyncThunk("/logout", async () => {
  return AuthServices.logout();
});

//--------------------------------update
export const update = createAsyncThunk(
  "/update",
  async (userData, thunkAPI) => {
    try {
      return UserServices.uploadUserData(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isErr = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.isErr = true;
        state.message = action.payload;
        state.isSuccess = false;

        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isErr = true;
        state.message = action.payload;
        state.isSuccess = false;
        state.user = null;
      })
      .addCase(update.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(update.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.user.image = action.payload.thumbnail;
        state.user.background = action.payload.background;
      })
      .addCase(update.rejected, (state, action) => {
        state.isLoading = false;
        state.isErr = true;
        state.message = action.payload;
        state.isSuccess = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
