import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MatchNews } from "../../types/MatchNews";

type NewsState = {
  newsByWeek: Record<number, MatchNews[]>;
};

const initialState: NewsState = {
  newsByWeek: {},
};

export const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setAllNews(state, action: PayloadAction<Record<number, MatchNews[]>>) {
      state.newsByWeek = action.payload;
    },
    addWeekNews(state, action: PayloadAction<{ week: number; items: MatchNews[] }>) {
      const { week, items } = action.payload;
      const existing = state.newsByWeek[week] ?? [];
      state.newsByWeek[week] = [...existing, ...items];
    },
    clearNews(state) {
      state.newsByWeek = {};
    },
  },
});

export const { setAllNews, addWeekNews, clearNews } = newsSlice.actions;
export default newsSlice.reducer;
