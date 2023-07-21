import { configureStore } from "@reduxjs/toolkit";
import viewsReducer from "../features/viewsSlice";
import carsReducer from "../features/carsSlice";
import pagesReducer from "../features/pagesSlice";

export default configureStore({
  reducer: {
    views: viewsReducer,
    pages: pagesReducer,
    cars: carsReducer,
  },
});
