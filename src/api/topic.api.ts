import AXIOS from "../configs/axios.confog";

export const getAllTopics = async (
  page: number = 1,
  isCompleted: boolean | undefined = undefined,
  searchValue: string = ""
) => {
  const query: any = { page };
  if (isCompleted !== undefined) {
    query.isCompleted = isCompleted;
  }
  if (searchValue?.trim()) {
    query.searchValue = searchValue;
  }
  const res: any = await AXIOS.get("/topic/all", { params: query });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const updateTopic = async (data: any, slug: string) => {
  const res: any = await AXIOS.patch(`/topic/update/${slug}`, { ...data });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const createTopic = async (data: any) => {
  const res: any = await AXIOS.post(`/topic/create`, { ...data });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
