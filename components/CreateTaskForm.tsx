import { Box, Dialog, Typography, Button } from "@mui/material";
import BaseDateField from "./BaseDateField";
import { useState } from "react";
import BaseTextAreaField from "./BaseTextAreaField";
import bg from "../public/bg.png";
import { useDispatch } from "react-redux";
import { snackbarMessage } from "../redux/snackbarSlice";

type AppProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ip: string;
};

// CreateTaskForm
const CreateTaskForm = ({ open, setOpen, ip }: AppProps) => {
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState(new Date());
  const [error, setError] = useState("");
  const dispatch = useDispatch();

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
        <Typography variant="h5" sx={{ color: "#4E4E4E" }}>
          Create a New Task
        </Typography>
        <BaseTextAreaField label="Task" value={title} setValue={setTitle} />
        <BaseDateField label="Due Date" value={dueAt} setValue={setDueAt} />
        <Button
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            // Client-side validation
            if (!title) {
              // show error message
              dispatch(
                snackbarMessage({
                  message: "Title must not be empty!",
                  severity: "error",
                })
              );
              return;
            }
            if (!dueAt) {
              // show error message
              dispatch(
                snackbarMessage({
                  message: "Due date must not be empty!",
                  severity: "error",
                })
              );
              return;
            }
            // Create a new task
            fetch("/api/tasks", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ title, dueAt, ipAddress: ip }),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network Error.");
                }
                // show success message
                dispatch(
                  snackbarMessage({
                    message: "Successfully created a task!",
                    severity: "success",
                  })
                );
                // close dialog
                setError("");
                setTitle("");
                handleClose();
              })
              .catch((e) => {
                // show error message
                dispatch(
                  snackbarMessage({
                    message: e.toString(),
                    severity: "error",
                  })
                );
              });
          }}
          size="large"
          color="warning"
        >
          Create
        </Button>
      </Box>
    </Dialog>
  );
};

export default CreateTaskForm;
