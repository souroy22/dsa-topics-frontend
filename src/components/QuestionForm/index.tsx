import { FC, useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "../../configs/notification.config";
import { RootState } from "../../store/store";
import { createQuestion, updateQuestion } from "../../api/question.api";
import InfiniteScrollDropdown from "../InfiniteScrollDropdown";
import { getAllTopics } from "../../api/topic.api";
import { setQuestions } from "../../store/question/questionReducer";
import useDebounce from "../../hooks/useDebounce";

export type LEVEL_TYPE = "EASY" | "MEDIUM" | "HARD";
export type OPTION_TOPIC_TYPE = {
  title: string;
  slug: string;
};

const levels: { label: string; value: LEVEL_TYPE; color: string }[] = [
  { label: "Easy", value: "EASY", color: "#2A6767" },
  { label: "Medium", value: "MEDIUM", color: "#FFB700" },
  { label: "Hard", value: "HARD", color: "#DE3636" },
];

export type DATA_TYPE = {
  title: string;
  description: string;
  level: LEVEL_TYPE;
  youtubeLink: null | string;
  leetcodeLink: null | string;
  articleLink: null | string;
  topic: OPTION_TOPIC_TYPE | null;
};

type QuestionFormProps = {
  onClose: () => void;
  mode?: "CREATE" | "UPDATE";
  slug?: string | null;
  formData: DATA_TYPE;
  onChange: (name: string, value: string) => void;
  handleSelectTopic: (value: OPTION_TOPIC_TYPE | null) => void;
};

const QuestionForm: FC<QuestionFormProps> = ({
  onClose,
  mode = "CREATE",
  formData,
  slug = null,
  onChange,
  handleSelectTopic,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<OPTION_TOPIC_TYPE[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<OPTION_TOPIC_TYPE | null>(
    null
  );

  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { questions } = useSelector(
    (state: RootState) => state.questionReducer
  );

  const handleFormSubmit = async () => {
    try {
      if (mode === "CREATE") {
        const newQuestion = await createQuestion(formData);
        if (questions?.length) {
          dispatch(setQuestions([...questions, newQuestion]));
        } else {
          dispatch(setQuestions([newQuestion]));
        }
        notification.success("Question created successfully!");
      } else {
        if (slug) {
          const updatedQuestion = await updateQuestion(formData, slug);
          if (topics?.length) {
            const updatedData = JSON.parse(JSON.stringify(questions)).map(
              (question: any) => {
                if (question.slug === updatedQuestion.slug) {
                  return updatedQuestion;
                }
                return question;
              }
            );
            dispatch(setQuestions(updatedData));
          }
          notification.success("Question updated successfully!");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      onClose();
    }
  };

  const initialFormData = useRef(formData);

  const isDisabled = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.level ||
      !formData.topic
    ) {
      return true;
    }

    // Check if all fields are unchanged
    return (
      formData.title === initialFormData.current.title &&
      formData.description === initialFormData.current.description &&
      formData.level === initialFormData.current.level &&
      formData.youtubeLink === initialFormData.current.youtubeLink &&
      formData.leetcodeLink === initialFormData.current.leetcodeLink &&
      formData.articleLink === initialFormData.current.articleLink &&
      formData.topic?.slug === initialFormData.current.topic?.slug
    );
  };

  const onLoad = async () => {
    setLoading(true);
    try {
      const result = await getAllTopics(1, undefined, "");
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
      setTopics(result.data);
      if (mode === "UPDATE") {
        setSelectedTopic(formData.topic);
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreTopics = async () => {
    setLoading(true);
    try {
      const result = await getAllTopics(currentPage + 1, undefined, value);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
      if (topics?.length) {
        setTopics([...topics, ...result.data]);
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = async (text: string) => {
    setLoading(true);
    try {
      const result = await getAllTopics(1, undefined, text);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
      setTopics(result.data);
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const debounceHandleTopicChange = useDebounce(handleTopicChange);

  useEffect(() => {
    onLoad();
    inputRef.current?.focus();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        fullWidth
        name="title"
        label="Question Title"
        type="text"
        required
        value={formData.title}
        onChange={(event) => onChange("title", event.target.value)}
        inputRef={inputRef}
        margin="normal"
      />
      <TextField
        fullWidth
        name="description"
        label="Question Description"
        type="text"
        required
        value={formData.description}
        onChange={(event) => onChange("description", event.target.value)}
        margin="normal"
      />
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Difficulty</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue={formData.level ?? "EASY"}
          name="radio-buttons-group"
          sx={{ display: "flex !important", gap: "10px", flexDirection: "row" }}
        >
          {levels.map((level) => (
            <FormControlLabel
              key={level.value}
              value={level.value}
              control={<Radio onClick={() => onChange("level", level.value)} />}
              label={level.label}
              sx={{ color: level.color, display: "inline-block" }}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <TextField
        fullWidth
        name="youtubeLink"
        label="Question YoutubeLink"
        type="text"
        value={formData.youtubeLink}
        onChange={(event) => onChange("youtubeLink", event.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        name="leetcodeLink"
        label="Question LeetcodeLink"
        type="text"
        value={formData.leetcodeLink}
        onChange={(event) => onChange("leetcodeLink", event.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        name="articleLink"
        label="Question ArticleLink"
        type="text"
        value={formData.articleLink}
        onChange={(event) => onChange("articleLink", event.target.value)}
        margin="normal"
      />
      <FormControl fullWidth>
        <InfiniteScrollDropdown
          label="Select Topic"
          handleChange={(text) => {
            setValue(text);
            debounceHandleTopicChange(text);
          }}
          handleSelect={(value) => {
            setSelectedTopic(value);
            handleSelectTopic(value);
          }}
          hasMore={currentPage < totalPages}
          loadMore={fetchMoreTopics}
          loading={loading}
          options={topics}
          required
          selectedOption={formData.topic ?? undefined}
          error={!selectedTopic}
          handleClose={() => {
            setTotalPages(1);
            setCurrentPage(1);
            setTopics([]);
            setLoading(false);
          }}
        />
      </FormControl>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleFormSubmit}
          disabled={isDisabled()} // Disable button when loading
        >
          {mode === "CREATE" ? "ADD Topic" : "UPDATE Topic"}
        </Button>
      </Box>
    </Box>
  );
};

export default QuestionForm;
