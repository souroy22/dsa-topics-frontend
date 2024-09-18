// components/TaskCard.tsx
import { FC, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { deleteTopic } from "../../api/topic.api";
import { notification } from "../../configs/notification.config";
import { setTopics } from "../../store/topic/topicReducer";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog";

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
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { theme } = useSelector((state: RootState) => state.globalReducer);
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { topics } = useSelector((state: RootState) => state.topicReducer);

  const dispatch = useDispatch();

  const onClose = () => {
    setOpenDeleteConfirm(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTopic(slug);
      const updatedTopics = topics?.filter((qsn) => qsn.slug !== slug);
      dispatch(setTopics(updatedTopics ?? []));
      notification.success("Topic deleted successfully!");
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
      sx={{
        backgroundColor: "background.paper",
        borderRadius: "12px",
        boxShadow: 3,
        mb: 2,
        width: "250px",
        height: "145px",
      }}
    >
      <DeleteConfirmationDialog
        onClose={onClose}
        open={openDeleteConfirm}
        onDelete={handleDelete}
        loading={loading}
      />
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
                      onClickUpdate(slug, title);
                    }}
                  />
                </Tooltip>
              </IconButton>
            )}
            {user?.role === "ADMIN" && (
              <IconButton
                aria-label="delete"
                sx={{ ml: 1 }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                <Tooltip title="Delete" arrow>
                  <Trash2
                    size={20}
                    color="#990000"
                    onClick={() => setOpenDeleteConfirm(true)}
                  />
                </Tooltip>
              </IconButton>
            )}
          </Box>
        </CardContent>
      </Link>
    </Card>
  );
};

export default TaskCard;
