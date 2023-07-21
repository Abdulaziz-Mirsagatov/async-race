import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "garage",
};

export const viewsSlice = createSlice({
  name: "views",
  initialState,
  reducers: {
    goToGarage: (state) => {
      state.value = "garage";
    },
    goToWinners: (state) => {
      state.value = "winners";
    },
  },
});

export const selectView = (state) => state.views.value;

export const { goToGarage, goToWinners } = viewsSlice.actions;

export default viewsSlice.reducer;
