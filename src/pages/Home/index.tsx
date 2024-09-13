import { Box, InputAdornment, TextField, Tooltip } from "@mui/material";
import TaskCard from "../../components/TaskCard";
import { CirclePlus, Search } from "lucide-react";
import "./style.css";
import { ChangeEvent, useEffect, useState } from "react";
import { getAllTopics, updateTopic } from "../../api/topic.api";
import { useDispatch, useSelector } from "react-redux";
import { setTopics } from "../../store/topic/topicReducer";
import { RootState } from "../../store/store";
import InfiniteScrollComponent from "../../components/InfiniteScrollComponent";
import SkeletonComponent from "../../components/SkeletonComponent";
import { notification } from "../../configs/notification.config";
import useDebounce from "../../hooks/useDebounce";
import Popup from "../../components/Popup";
import TopicForm from "../../components/TopicForm";

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<string | null>(null);

  const dispatch = useDispatch();

  const { topics } = useSelector((state: RootState) => state.topicReducer);
  const { selectedSidebarOption } = useSelector(
    (state: RootState) => state.globalReducer
  );

  const onLoad = async () => {
    dispatch(setTopics(null));
    setIsLoading(true);
    try {
      const isCompleted =
        selectedSidebarOption === "all"
          ? undefined
          : selectedSidebarOption === "completed";
      const result = await getAllTopics(currentPage, isCompleted);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
      dispatch(setTopics(result.data));
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreData = async () => {
    try {
      const isCompleted =
        selectedSidebarOption === "all"
          ? undefined
          : selectedSidebarOption === "pending";
      const result = await getAllTopics(
        currentPage + 1,
        isCompleted,
        searchValue
      );
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
      if (topics?.length) {
        dispatch(setTopics([...topics, ...result.data]));
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateClick = (slug: string, title: string) => {
    setValue(title);
    setMode(slug);
    setOpen(true);
  };

  const getData = async (value: string) => {
    dispatch(setTopics(null));
    const isCompleted =
      selectedSidebarOption === "all"
        ? undefined
        : selectedSidebarOption === "completed";
    const result = await getAllTopics(currentPage, isCompleted, value);
    setCurrentPage(result.page);
    setTotalPages(result.totalPages);
    dispatch(setTopics(result.data));
  };

  const debounceGetData = useDebounce(getData);

  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    debounceGetData(event.target.value);
  };

  const handleUpdateStatus = async (status: boolean, slug: string) => {
    let updatedTopic: any = null;
    try {
      if (topics?.length) {
        const updatedTopics = topics?.map((topic) => {
          if (topic.slug === slug) {
            return { ...topic, isCompleted: status };
          }
          return topic;
        });
        dispatch(setTopics(updatedTopics));
        updatedTopic = await updateTopic({ completed: status }, slug);
        notification.success("Topic Status updated successfully!");
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      if (!updatedTopic || updatedTopic.isCompleted !== status) {
        if (topics?.length) {
          const updatedTopics = topics?.map((topic) => {
            if (topic.slug === slug) {
              return { ...topic, isCompleted: !status };
            }
            return topic;
          });
          dispatch(setTopics(updatedTopics));
        }
      }
    }
  };

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    onLoad();
  }, [selectedSidebarOption]);

  return (
    <Box sx={{ padding: "30px", width: "calc(100svw - 200px)" }}>
      <Popup
        open={open}
        onClose={() => {
          setOpen(false);
          setValue("");
          setMode(null);
        }}
      >
        <TopicForm
          value={value}
          onChange={onChange}
          mode={mode === null ? "CREATE" : "UPDATE"}
          onClose={() => {
            setOpen(false);
            setValue("");
            setMode(null);
          }}
          slug={mode ?? ""}
        />
      </Popup>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "90%",
          gap: "20px",
        }}
      >
        <TextField
          id="filled-basic"
          variant="standard"
          value={searchValue}
          onChange={handleSearch}
          placeholder="search..."
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            style: {
              padding: "5px",
              paddingLeft: "10px",
            },
          }}
          sx={{ width: "350px" }}
        />
        <Box>
          <Tooltip title="Add">
            <CirclePlus
              onClick={() => setOpen(true)}
              size={35}
              cursor="pointer"
            />
          </Tooltip>
        </Box>
      </Box>
      <Box id="topics-container">
        {topics === null ? (
          <Box sx={{ padding: "30px" }}>
            <SkeletonComponent
              count={8}
              height={150}
              width={250}
              style={{ borderRadius: "10px" }}
            />
          </Box>
        ) : topics?.length ? (
          <InfiniteScrollComponent
            dataLength={topics?.length || 0}
            hasMore={totalPages > currentPage}
            loadMoreData={loadMoreData}
            targetId="topics-container"
            style={{
              width: "100%",
              display: "flex",
              gap: "30px",
              padding: "40px",
              flexWrap: "wrap",
              height: "calc(100svh - 100px)",
            }}
            LoadingComponent={<></>}
          >
            {topics?.map((topic) => {
              const completedPage = selectedSidebarOption === "completed";
              if (
                selectedSidebarOption !== "all" &&
                completedPage !== topic.isCompleted
              ) {
                return null;
              }
              return (
                <TaskCard
                  key={topic.slug}
                  title={topic.title}
                  completed={topic.isCompleted}
                  handleUpdateStatus={handleUpdateStatus}
                  slug={topic.slug}
                  onClickUpdate={handleUpdateClick}
                />
              );
            })}
            {isLoading && (
              <SkeletonComponent
                count={4}
                height={150}
                style={{ borderRadius: "10px" }}
              />
            )}
          </InfiniteScrollComponent>
        ) : (
          <Box
            sx={{
              height: "calc(100svh - 100px)",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            No Topic found!
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;
