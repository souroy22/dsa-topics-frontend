import { ChangeEvent, FC, useEffect, useRef } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "../../configs/notification.config";
import { createTopic, updateTopic } from "../../api/topic.api";
import { RootState } from "../../store/store";
import { setTopics } from "../../store/topic/topicReducer";

type TopicFormProps = {
  onClose: () => void;
  mode?: "CREATE" | "UPDATE";
  slug?: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

const TopicForm: FC<TopicFormProps> = ({
  onClose,
  mode = "CREATE",
  value,
  slug = null,
  onChange,
}) => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { topics } = useSelector((state: RootState) => state.topicReducer);

  const handleFormSubmit = async () => {
    try {
      if (mode === "CREATE") {
        const newTopic = await createTopic({ title: value });
        if (topics?.length) {
          dispatch(setTopics([...topics, newTopic]));
        } else {
          dispatch(setTopics([newTopic]));
        }
        notification.success("Topic created successfully!");
      } else {
        if (slug) {
          const updatedTopic = await updateTopic({ title: value }, slug);
          if (topics?.length) {
            const updatedData = JSON.parse(JSON.stringify(topics)).map(
              (topic: any) => {
                if (topic.slug === updatedTopic.slug) {
                  return updatedTopic;
                }
                return topic;
              }
            );
            dispatch(setTopics(updatedData));
          }
          notification.success("Topic updated successfully!");
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

  const isDisabled = () => {
    if (mode === "CREATE") {
      return !value.trim();
    } else {
      if (value.trim() === "") {
        return true;
      }
      if (topics?.length) {
        const updatingData = topics?.find((topic) => topic.slug === slug);
        if (updatingData) {
          return value.trim() === updatingData.title.trim();
        }
      }
    }
    return false;
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        fullWidth
        name="name"
        label="Topic Name"
        type="text"
        required
        value={value}
        onChange={(event) => onChange(event)}
        inputRef={inputRef}
        margin="normal"
      />
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

export default TopicForm;
