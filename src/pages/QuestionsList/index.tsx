import { useState, useEffect, FC } from "react";
import { Box, Tab, Tabs, Tooltip } from "@mui/material";
import QuestionsFilter from "../../components/QuestionsFilter";
import Question from "../../components/Question";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useParams } from "react-router-dom";
import { getQuestions, updateQuestion } from "../../api/question.api";
import { notification } from "../../configs/notification.config";
import { setQuestions } from "../../store/question/questionReducer";
import SkeletonComponent from "../../components/SkeletonComponent";
import InfiniteScrollComponent from "../../components/InfiniteScrollComponent";
import { CirclePlus } from "lucide-react";
import Popup from "../../components/Popup";
import QuestionForm, {
  LEVEL_TYPE,
  OPTION_TOPIC_TYPE,
} from "../../components/QuestionForm";
import useDebounce from "../../hooks/useDebounce";

interface Question {
  _id: string;
  title: string;
  level: string;
  completed: boolean;
}

const initialFormData = {
  title: "",
  description: "",
  level: "EASY" as LEVEL_TYPE,
  youtubeLink: null,
  leetcodeLink: null,
  articleLink: null,
  topic: null,
};

const QuestionsList: FC = () => {
  const [value, setValue] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<string | null>(null);
  const [formData, setFormaData] = useState<any>(initialFormData);
  const [updatingSlug, setUpdatingSlug] = useState<string | null>(null);

  const { questions } = useSelector(
    (state: RootState) => state.questionReducer
  );
  const { user } = useSelector((state: RootState) => state.userReducer);

  const params = useParams();
  const topicSlug = params.slug;
  const dispatch = useDispatch();

  const handleChange = async (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    const isCompleted =
      newValue === "all" ? undefined : newValue === "completed";
    dispatch(setQuestions(null));
    setLoading(true);
    try {
      if (topicSlug) {
        const result = await getQuestions(
          topicSlug,
          1,
          searchTerm,
          isCompleted,
          difficulty
        );
        setCurrentPage(result.page);
        setTotalPages(result.totalPages);
        dispatch(setQuestions(result.data));
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const searchQuestions = async (text: string) => {
    const isCompleted = value === "all" ? undefined : value === "completed";
    dispatch(setQuestions(null));
    setLoading(true);
    try {
      if (topicSlug) {
        const result = await getQuestions(
          topicSlug,
          1,
          text,
          isCompleted,
          difficulty
        );
        setCurrentPage(result.page);
        setTotalPages(result.totalPages);
        dispatch(setQuestions(result.data));
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const debounceSearchQuestions = useDebounce(searchQuestions);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    debounceSearchQuestions(event.target.value);
  };

  const handleDifficultyChange = async (newDifficulty: string) => {
    let prevDifficulty: any = JSON.parse(JSON.stringify(difficulty));
    prevDifficulty = prevDifficulty.includes(newDifficulty)
      ? prevDifficulty.filter((diff: any) => diff !== newDifficulty)
      : [...prevDifficulty, newDifficulty];
    setDifficulty(prevDifficulty);
    const isCompleted = value === "all" ? undefined : value === "completed";
    dispatch(setQuestions(null));
    setLoading(true);
    try {
      if (topicSlug) {
        const result = await getQuestions(
          topicSlug,
          1,
          searchTerm,
          isCompleted,
          prevDifficulty
        );
        setCurrentPage(result.page);
        setTotalPages(result.totalPages);
        dispatch(setQuestions(result.data));
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onLoad = async () => {
    dispatch(setQuestions(null));
    setLoading(true);
    try {
      if (topicSlug) {
        const isCompleted = value === "all" ? undefined : value === "completed";
        const result = await getQuestions(
          topicSlug,
          1,
          searchTerm,
          isCompleted
        );
        setCurrentPage(result.page);
        setTotalPages(result.totalPages);
        dispatch(setQuestions(result.data));
      }
    } catch (error) {
      dispatch(setQuestions([]));
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMoreData = async () => {
    setLoading(true);
    try {
      if (topicSlug) {
        const isCompleted = value === "all" ? undefined : value === "completed";
        const result = await getQuestions(
          topicSlug,
          currentPage + 1,
          searchTerm,
          isCompleted,
          difficulty
        );
        setCurrentPage(result.page);
        setTotalPages(result.totalPages);
        dispatch(setQuestions(result.data));
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (name: string, value: string) => {
    setFormaData({ ...formData, [name]: value });
  };

  const handleSelectTopic = (selectedValue: OPTION_TOPIC_TYPE | null) => {
    setFormaData({ ...formData, topic: selectedValue ?? null });
  };

  const updateStatus = async (isCompleted: boolean, slug: string) => {
    let updatedData: any = null;
    try {
      let updatedQuestions: any;
      if (value === "all") {
        updatedQuestions = questions?.map((question) => {
          if (question.slug === slug) {
            return { ...question, completed: isCompleted };
          }
          return question;
        });
      } else {
        updatedQuestions = questions?.filter(
          (question) => question.slug !== slug
        );
      }
      dispatch(setQuestions(updatedQuestions));
      updatedData = await updateQuestion({ completed: isCompleted }, slug);
      notification.success("Question status updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      if (!updatedData || updatedData.completed !== isCompleted) {
        if (questions?.length) {
          const updatedQuestions = questions?.map((question) => {
            if (question.slug === slug) {
              return { ...question, isCompleted: !status };
            }
            return question;
          });
          dispatch(setQuestions(updatedQuestions));
        }
      }
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    debounceSearchQuestions("");
  };

  useEffect(() => {
    onLoad();
  }, [topicSlug]);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box
      sx={{
        padding: "30px",
        width: { xs: "100svw", md: "calc(100svw - 250px)" },
      }}
    >
      <Popup
        open={open}
        onClose={() => {
          setOpen(false);
          setMode(null);
          setFormaData(initialFormData);
        }}
      >
        <QuestionForm
          formData={formData}
          onChange={handleFormChange}
          handleSelectTopic={handleSelectTopic}
          mode={mode === null ? "CREATE" : "UPDATE"}
          onClose={() => {
            setOpen(false);
            setMode(null);
          }}
          slug={updatingSlug}
        />
      </Popup>
      <Box display="flex" gap="20px" justifyContent="flex-end">
        <QuestionsFilter
          searchTerm={searchTerm}
          difficulty={difficulty}
          handleSearchChange={handleSearchChange}
          handleDifficultyChange={handleDifficultyChange}
          handleClearSearch={handleClearSearch}
        />
        {user?.role === "ADMIN" && (
          <Box>
            <Tooltip title="Add">
              <CirclePlus
                onClick={() => setOpen(true)}
                size={35}
                cursor="pointer"
              />
            </Tooltip>
          </Box>
        )}
      </Box>
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="All" value="all" {...a11yProps(0)} />
          <Tab label="Incomplete" value="pending" {...a11yProps(1)} />
          <Tab label="Completed" value="completed" {...a11yProps(2)} />
        </Tabs>
      </Box>
      {questions === null ? (
        <Box
          sx={{
            padding: "30px",
            display: "flex",
            gap: "30px",
            flexWrap: "wrap",
            flexDirection: "column",
          }}
        >
          <SkeletonComponent
            count={4}
            height={100}
            width="100%"
            style={{ borderRadius: "10px" }}
          />
        </Box>
      ) : questions?.length ? (
        <InfiniteScrollComponent
          dataLength={questions?.length || 0}
          hasMore={totalPages > currentPage}
          loadMoreData={loadMoreData}
          targetId="topics-container"
          style={{
            width: "100%",
            display: "flex",
            gap: "10px",
            padding: "40px",
            flexWrap: "wrap",
            height: "calc(100svh - 100px)",
            justifyContent: "flex-start",
          }}
          LoadingComponent={<></>}
        >
          {questions.map((question) => (
            <Question
              key={question.slug}
              question={question}
              handleUpdateStatus={async () => {
                await updateStatus(!question.completed, question.slug);
              }}
              onClickUpdate={() => {
                setUpdatingSlug(question.slug);
                setFormaData({
                  title: question.title,
                  description: question.description,
                  level: question.level,
                  youtubeLink: question.youtubeLink,
                  articleLink: question.articleLink,
                  leetcodeLink: question.leetcodeLink,
                  topic: question.topic,
                });
                setMode("UPDATE");
                setOpen(true);
              }}
            />
          ))}
          {loading && (
            <SkeletonComponent
              count={4}
              height={100}
              width="100%"
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
  );
};

export default QuestionsList;
