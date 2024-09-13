import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TOPIC_TYPE = {
  title: string;
  slug: string;
  isCompleted: boolean;
};

type TopicStateType = {
  topics: null | TOPIC_TYPE[];
};

const initialState: TopicStateType = {
  topics: null,
};

export const topicSlice = createSlice({
  name: "topic",
  initialState,
  reducers: {
    setTopics: (state, action: PayloadAction<null | TOPIC_TYPE[]>) => {
      return {
        ...state,
        topics: action.payload,
      };
    },
  },
});

export const { setTopics } = topicSlice.actions;
export default topicSlice.reducer;
