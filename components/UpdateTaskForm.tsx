import {
  Box,
  Dialog,
  Typography,
  Button,
  Collapse,
  Alert,
  IconButton,
} from "@mui/material";
import BaseDateField from "./BaseDateField";
import { useState } from "react";
import BaseTextAreaField from "./BaseTextAreaField";
import bg from "../public/bg.png";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

type AppProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  title: string;
  status?: boolean;
  dueAt: Date;
};

const ColorButton = styled(Button)(({ theme }) => ({
  alignSelf: "center",
  backgroundColor: "#D27C2C",
  "&:hover": {
    backgroundColor: "#D27C2C",
  },
  width: 200,
}));

// UpdateTaskForm
const UpdateTaskForm = ({
  open,
  setOpen,
  id,
  title,
  status,
  dueAt,
}: AppProps) => {
  const [localTitle, setLocalTitle] = useState(title);
  const [localDueAt, setLocalDueAt] = useState(dueAt);
  const [error, setError] = useState("");

  useEffect(() => {
    // update local states whenever the props change
    setLocalTitle(title);
    setLocalDueAt(dueAt);
  }, [title, dueAt]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 5,
          backgroundImage: `url(${bg.src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ color: "#4E4E4E" }}>
            Update Task
          </Typography>
          <IconButton
            aria-label="delete"
            onClick={() => {
              // Delete task
              fetch(`/api/tasks/${id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network Error.");
                  }
                  // close dialog
                  setError("");
                  handleClose();
                })
                .catch((e) => {
                  setError(e.toString());
                });
            }}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Box>

        <BaseTextAreaField
          label="Task"
          value={localTitle}
          setValue={setLocalTitle}
        />
        <BaseDateField
          label="Due Date"
          value={localDueAt}
          setValue={setLocalDueAt}
        />
        <Collapse in={!!error}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setError("");
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        </Collapse>
        <ColorButton
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            // Client-side validation
            if (!localTitle) {
              setError("Title must not be empty!");
              return;
            }
            if (!localDueAt) {
              setError("Due date must not be empty!");
              return;
            }
            // Update task
            fetch(`/api/tasks/${id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: localTitle,
                dueAt: localDueAt,
                status,
              }),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network Error.");
                }
                // close dialog
                setError("");
                handleClose();
              })
              .catch((e) => {
                setError(e.toString());
              });
          }}
          size="large"
        >
          Update
        </ColorButton>
      </Box>
    </Dialog>
  );
};

export default UpdateTaskForm;
