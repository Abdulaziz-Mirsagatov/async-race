import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  garagePageNum: 1,
  winnersPageNum: 1,
};

export const pagesSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    nextGaragePage: (state) => {
      state.garagePageNum += 1;
    },
    prevGaragePage: (state) => {
      state.garagePageNum -= 1;
    },
    nextWinnersPage: (state) => {
      state.winnersPageNum += 1;
    },
    prevWinnersPage: (state) => {
      state.winnersPageNum -= 1;
    },
  },
});

export const selectGaragePageNum = (state) => state.pages.garagePageNum;
export const selectWinnersPageNum = (state) => state.pages.winnersPageNum;

export const {
  nextGaragePage,
  prevGaragePage,
  nextWinnersPage,
  prevWinnersPage,
} = pagesSlice.actions;

export default pagesSlice.reducer;
