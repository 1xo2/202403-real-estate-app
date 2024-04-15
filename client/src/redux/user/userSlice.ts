import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IAppError } from "../../errorHandlers/clientErrorHandler";

export interface IUser {
  userName: string;
  eMail: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userPhoto?:string;
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
    logIn_Start: (state) => {
      state.loading = true;
    },
    login_Success: (state, action: PayloadAction<IUser>) => {
      console.log('enter login_Success: redux')

      state.loading = false;
      state.error = null;
      try {
        console.log('**action:', action)
        console.log('**action.payload:', action.payload)
        state.currentUser = action.payload;
      } catch (error) {
        console.error("login_Success error:", error);
      }
      // console.log('action.payload:', action.payload)
    },
    login_Fail: (state, action: PayloadAction<IAppError>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logIn_End: (state) => {
      state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { logIn_Start, login_Success, login_Fail, logIn_End } =
  userSlice.actions;

export default userSlice.reducer;
