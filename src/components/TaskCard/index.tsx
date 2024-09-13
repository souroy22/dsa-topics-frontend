// components/TaskCard.tsx
import { FC } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Chip,
} from "@mui/material";
import { CheckCircle, CircleX, SquarePen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface TaskCardProps {
  title: string;
  slug: string;
  completed: boolean;
  handleUpdateStatus: (status: boolean, slug: string) => void;
  onClickUpdate: (slug: string, title: string) => void;
}

const TaskCard: FC<TaskCardProps> = ({
  title,
  completed,
  handleUpdateStatus,
  slug,
  onClickUpdate,
}) => {
  const { theme } = useSelector((state: RootState) => state.globalReducer);
  return (
    <Card
      sx={{
        backgroundColor: "background.paper",
        borderRadius: "12px",
        boxShadow: 3,
        mb: 2,
        width: "250px",
        height: "145px",
      }}
    >
      <Link to={`/topic/${slug}`}>
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            color={theme === "dark" ? "#FFF" : "black"}
          >
            {title}
          </Typography>
          <Box sx={{ mt: 5 }}>
            <Tooltip
              title={`Click to mark ${completed ? "Incompleted" : "Complete"}`}
              arrow
            >
              <Chip
                label={completed ? "Completed" : "Incomplete"}
                color={completed ? "success" : "error"}
                icon={
                  completed ? <CheckCircle size={16} /> : <CircleX size={16} />
                }
                sx={{ cursor: "pointer" }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleUpdateStatus(!completed, slug);
                }}
              />
            </Tooltip>
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
                    onClickUpdate(slug, title);
                  }}
                />
              </Tooltip>
            </IconButton>
            <IconButton aria-label="delete" sx={{ ml: 1 }}>
              <Tooltip title="Delete" arrow>
                <Trash2 size={20} color="#990000" />
              </Tooltip>
            </IconButton>
          </Box>
        </CardContent>
      </Link>
    </Card>
  );
};

export default TaskCard;
