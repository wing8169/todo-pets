import { Box, Dialog, Typography, Button } from "@mui/material";
import BaseDateField from "./BaseDateField";
import { useState } from "react";
import BaseTextAreaField from "./BaseTextAreaField";
import bg from "../public/bg.png";
import { snackbarMessage } from "../redux/snackbarSlice";
import { useAppDispatch } from "../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type AppProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// CreateTaskForm
const CreateTaskForm = ({ open, setOpen }: AppProps) => {
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState(new Date());
  const dispatch = useAppDispatch();
  const { id } = useSelector((state: RootState) => state.auth);

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
          data-testid="createTask"
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
            if (!id) return;
            // Create a new task
            fetch(`/api/user/${id}/tasks`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ title, dueAt }),
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
