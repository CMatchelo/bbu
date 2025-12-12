import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "../store/slices/dataSlice";
import gameSettingsReducer from "../store/slices/gameSettingsSlice"

export const store = configureStore({
  reducer: {
    data: dataReducer,
    gameSettings: gameSettingsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;