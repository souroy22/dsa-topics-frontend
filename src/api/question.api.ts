import AXIOS from "../configs/axios.confog";

export const getQuestions = async (
  topicSlug: string,
  page: number = 1,
  searchValue: string = "",
  isCompleted?: boolean,
  levels: string[] = []
) => {
  const params: any = { topicSlug };
  if (page) {
    params.page = page;
  }
  if (searchValue?.trim()) {
    params.searchValue = searchValue;
  }
  if (isCompleted !== undefined) {
    params.isCompleted = isCompleted;
  }
  if (levels?.length) {
    params.levels = levels;
  }

  const res: any = await AXIOS.get("/question/all", {
    params,
  });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const createQuestion = async (data: any) => {
  data = { ...data, topicSlug: data.topic.slug };
  delete data["topic"];
  const res: any = await AXIOS.post("/question/create", {
    ...data,
  });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const updateQuestion = async (data: any, slug: string) => {
  const res: any = await AXIOS.patch(`/question/update/${slug}`, {
    ...data,
  });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const deleteQuestion = async (slug: string) => {
  const res: any = await AXIOS.delete(`/question/delete/${slug}`);
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
