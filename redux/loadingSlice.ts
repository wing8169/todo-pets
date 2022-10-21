import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface LoadingState {
  isLoading: boolean;
}

const initialState: LoadingState = {
  isLoading: false,
};

export const loadingSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    loading: (state, action: PayloadAction<LoadingState>) => {
      state.isLoading = action.payload.isLoading;
    },
  },
});

export const { loading } = loadingSlice.actions;

export default loadingSlice.reducer;
