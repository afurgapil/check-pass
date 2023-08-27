import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lang: "GB",
  thema: "dark",
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.lang = action.payload;
    },
    setThema: (state, action) => {
      state.thema = action.payload;
    },
  },
});

export const { setLanguage, setThema } = dataSlice.actions;

export default dataSlice.reducer;
