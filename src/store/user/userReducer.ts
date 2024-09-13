import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type USER_TYPE = {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
};

type UserStateType = {
  user: null | USER_TYPE;
};

const initialState: UserStateType = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<null | USER_TYPE>) => {
      return {
        ...state,
        user: action.payload,
      };
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
