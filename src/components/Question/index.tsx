import { FC, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  QUESTION_TYPE,
  setQuestions,
} from "../../store/question/questionReducer";
import {
  CheckCircle,
  CircleX,
  Newspaper,
  SquarePen,
  Trash2,
  Youtube,
} from "lucide-react";
import { SiLeetcode } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { deleteQuestion } from "../../api/question.api";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog";
import { notification } from "../../configs/notification.config";

type PropTypes = {
  question: QUESTION_TYPE;
  handleUpdateStatus: (status: boolean, slug: string) => void;
  onClickUpdate: (slug: string, title: string) => void;
};

const levelColor = {
  EASY: "#2A6767",
  MEDIUM: "#FFB700",
  HARD: "#DE3636",
};

const Question: FC<PropTypes> = ({
  question,
  handleUpdateStatus,
  onClickUpdate,
}) => {
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state: RootState) => state.userReducer);
  const { theme } = useSelector((state: RootState) => state.globalReducer);
  const { questions } = useSelector(
    (state: RootState) => state.questionReducer
  );

  const muiTheme = useTheme();
  const dispatch = useDispatch();

  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const onClose = () => {
    setOpenDeleteConfirm(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteQuestion(question.slug);
      const updatedQuestions = questions?.filter(
        (qsn) => qsn.slug !== question.slug
      );
      dispatch(setQuestions(updatedQuestions ?? []));
      notification.success("Question deleted successfully!");
      setOpenDeleteConfirm(false);
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      key={question.slug}
      sx={{
        width: "100%",
        cursor: "pointer",
        padding: "10px",
        marginBottom: "10px",
        height: "max-content",
      }}
    >
      <DeleteConfirmationDialog
        onClose={onClose}
        open={openDeleteConfirm}
        onDelete={handleDelete}
        loading={loading}
      />
      <CardContent
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexWrap: isMobile ? "wrap" : "nowrap", // Wrap content on mobile
          padding: "10px", // Compact padding
          "&:last-child": {
            paddingBottom: "10px", // Ensure padding consistency
          },
        }}
      >
        {/* Title and Level */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row", // Stack on mobile
            gap: isMobile ? "5px" : "20px",
            width: isMobile ? "100%" : "40%",
            alignItems: isMobile ? "flex-start" : "center",
          }}
        >
          <Typography variant="h6" noWrap>
            {question.title}
          </Typography>
          <Typography
            variant="body2"
            color={levelColor[question.level]}
            sx={{
              fontWeight: "bold",
            }}
          >
            {question.level}
          </Typography>
        </Box>

        {/* Links (shown/hidden based on screen size) */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              width: "20%",
              justifyContent: "center",
            }}
          >
            {question.youtubeLink && (
              <a href={question.youtubeLink} target="_blank">
                <Youtube color="#a30000" />
              </a>
            )}
            {question.articleLink && (
              <a href={question.articleLink} target="_blank">
                <Newspaper color={theme === "dark" ? "#f7f7f7" : "blue"} />
              </a>
            )}
            {question.leetcodeLink && (
              <a href={question.leetcodeLink} target="_blank">
                <SiLeetcode color="#FFF" />
              </a>
            )}
          </Box>
        )}

        {/* Status Chip and Admin Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: isMobile ? "100%" : "20%",
            alignItems: "center",
          }}
        >
          <Tooltip
            title={`Click to mark ${
              question.completed ? "Incomplete" : "Complete"
            }`}
            arrow
          >
            <Chip
              label={question.completed ? "Completed" : "Incomplete"}
              color={question.completed ? "success" : "error"}
              icon={
                question.completed ? (
                  <CheckCircle size={16} />
                ) : (
                  <CircleX size={16} />
                )
              }
              sx={{ cursor: "pointer" }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleUpdateStatus(!question.completed, question.slug);
              }}
            />
          </Tooltip>

          {user?.role === "ADMIN" && (
            <>
              <IconButton
                aria-label="edit"
                sx={{ ml: 1 }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onClickUpdate(question.slug, question.title);
                }}
              >
                <Tooltip title="Edit" arrow>
                  <SquarePen
                    size={20}
                    color={theme === "dark" ? "#FFFF00" : "gold"}
                  />
                </Tooltip>
              </IconButton>
              <IconButton aria-label="delete" sx={{ ml: 1 }}>
                <Tooltip title="Delete" arrow>
                  <Trash2
                    size={20}
                    color="#990000"
                    onClick={() => setOpenDeleteConfirm(true)}
                  />
                </Tooltip>
              </IconButton>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default Question;
