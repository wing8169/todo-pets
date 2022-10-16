import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SnackbarState {
  message: string;
  severity: string;
}

const initialState: SnackbarState = {
  message: "",
  severity: "info",
};

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    snackbarMessage: (state, action: PayloadAction<SnackbarState>) => {
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
  },
});

export const { snackbarMessage } = snackbarSlice.actions;

export default snackbarSlice.reducer;
