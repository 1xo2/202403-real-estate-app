import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IAppError } from "../../errorHandlers/clientErrorHandler";

export interface IUser {
  userName: string;
  eMail: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string;
  userPhoto?: string;
  source?: 'local' | 'google';
}

export interface IUserState {
  currentUser?: IUser | null;
  error?: IAppError | null;
  loading: boolean;
}

const initialState: IUserState = {
  currentUser: null,
  error: null,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loading_start: (state) => {
      state.loading = true;
    },
    loading_end: (state) => {
      state.loading = false;
    },
    logIn_Start: (state) => {
      state.loading = true;
    },
    login_Success: (state, action: PayloadAction<IUser>) => {
      try {
        console.log('enter login_Success: redux')
        state.loading = false;
        state.error = null;
        state.currentUser = action.payload;
      } catch (error) {
        console.error("login_Success error:", error);
      }
    },
    login_Fail: (state, action: PayloadAction<IAppError>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logIn_End: (state) => {
      state.loading = false;
    },
    profile_updateAvatar: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.userPhoto = action.payload;
      }
    },
    logOutOrDeletion_Success: (state) => {
      state.currentUser = null;
    },
    logOutOrDeletion_fail: (state, action: PayloadAction<IAppError>) => {
      state.currentUser = null;
      state.error = action.payload;
    },
    general_failure: (state, action: PayloadAction<IAppError>) => {
      state.currentUser = null;
      state.error = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  logIn_Start, login_Success, login_Fail, logIn_End, profile_updateAvatar, logOutOrDeletion_Success,
  logOutOrDeletion_fail, loading_start, loading_end, general_failure } =
  userSlice.actions;

export default userSlice.reducer;
