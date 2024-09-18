import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { CircleX, X } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  loading,
  onClose,
  onDelete,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-confirmation-dialog-title"
      aria-describedby="delete-confirmation-dialog-description"
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <IconButton
          disabled
          sx={{
            color: red[500],
            fontSize: "50px",
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          <CircleX color="#F15E5E" size={50} />
        </IconButton>
        <Typography variant="h6" gutterBottom>
          Are you sure?
        </Typography>
        <DialogContentText id="delete-confirmation-dialog-description">
          Do you really want to delete these records? <br />
          This process cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={onDelete}>
          {loading ? (
            <CircularProgress
              sx={{
                color: "white",
                width: "25px !important",
                height: "25px !important",
              }}
            />
          ) : (
            "Delete"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
