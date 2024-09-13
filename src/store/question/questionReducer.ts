import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type QUESTION_TYPE = {
  title: string;
  slug: string;
  description: string;
  youtubeLink: string | null;
  leetcodeLink: string | null;
  articleLink: string | null;
  level: "EASY" | "MEDIUM" | "HARD";
  completed: boolean;
  topic: {
    title: string;
    slug: string;
  };
};

type QuestionStateType = {
  questions: null | QUESTION_TYPE[];
};

const initialState: QuestionStateType = {
  questions: null,
};

export const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<null | QUESTION_TYPE[]>) => {
      return {
        ...state,
        questions: action.payload,
      };
    },
  },
});

export const { setQuestions } = questionSlice.actions;
export default questionSlice.reducer;
