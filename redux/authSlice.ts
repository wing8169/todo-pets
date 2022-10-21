import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  id: string;
}

const initialState: AuthState = {
  id: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    auth: (state, action: PayloadAction<AuthState>) => {
      state.id = action.payload.id;
    },
  },
});

export const { auth } = authSlice.actions;

export default authSlice.reducer;
