import { FC } from "react";
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
  const { theme } = useSelector((state: RootState) => state.globalReducer);

  const muiTheme = useTheme();

  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

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

          {/* Admin Actions: Edit and Delete buttons are hidden on mobile */}
          {!isMobile && user?.role === "ADMIN" && (
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
                  <Trash2 size={20} color="#990000" />
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
