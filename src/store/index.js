import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slicers/user";
import dataSlice from "./slicers/data";
export const store = configureStore({
  reducer: {
    user: userSlice,
    data: dataSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});
