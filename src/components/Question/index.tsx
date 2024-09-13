import { FC } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { QUESTION_TYPE } from "../../store/question/questionReducer";
import {
  CheckCircle,
  CircleX,
  Newspaper,
  SquarePen,
  Trash2,
  Youtube,
} from "lucide-react";
import { SiLeetcode } from "react-icons/si";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

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
  const { user } = useSelector((state: RootState) => state.userReducer);

  return (
    <Card
      key={question.slug}
      sx={{
        width: "100%",
        height: "100px",
        cursor: "pointer",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6" width={"40%"}>
          {question.title}
        </Typography>
        <Typography
          variant="body2"
          width={"10%"}
          color={levelColor[question.level]}
        >
          {question.level}
        </Typography>
        <Box sx={{ display: "flex", gap: "20px", width: "20%" }}>
          {question.youtubeLink && (
            <a href={question.youtubeLink} target="_blank">
              <Youtube color="#a30000" />
            </a>
          )}
          {question.articleLink && (
            <a href={question.articleLink} target="_blank">
              <Newspaper color="#f7f7f7" />
            </a>
          )}
          {question.leetcodeLink && (
            <a href={question.leetcodeLink} target="_blank">
              <SiLeetcode color="#FFF" />
            </a>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "20%" }}>
          <Tooltip
            title={`Click to mark ${
              question.completed ? "Incompleted" : "Complete"
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
            <IconButton
              aria-label="delete"
              sx={{ ml: 1 }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <Tooltip title="Edit" arrow>
                <SquarePen
                  size={20}
                  color="#FFFF00"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onClickUpdate(question.slug, question.title);
                  }}
                />
              </Tooltip>
            </IconButton>
          )}
          {user?.role === "ADMIN" && (
            <IconButton aria-label="delete" sx={{ ml: 1 }}>
              <Tooltip title="Delete" arrow>
                <Trash2 size={20} color="#990000" />
              </Tooltip>
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default Question;
