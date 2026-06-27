import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./slices/dataSlice";
import gameSettingsReducer from "./slices/gameSettingsSlice"
import scheduleReducer from "./slices/scheduleSlice"
import newsReducer from "./slices/newsSlice"

export const store = configureStore({
  reducer: {
    data: dataReducer,
    gameSettings: gameSettingsReducer,
    schedule: scheduleReducer,
    news: newsReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;