import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { customLocalStorage } from "../../utils/customLocalStorage";

type GlobalStateType = {
  theme: string;
  selectedSidebarOption: string;
};

const initialState: GlobalStateType = {
  theme: "light",
  selectedSidebarOption: "pending",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setUserTheme: (state, action: PayloadAction<string>) => {
      customLocalStorage.setData("userTheme", action.payload);
      return {
        ...state,
        theme: action.payload,
      };
    },
    setSelectedSidebarOption: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        selectedSidebarOption: action.payload,
      };
    },
  },
});

export const { setUserTheme, setSelectedSidebarOption } = globalSlice.actions;
export default globalSlice.reducer;
