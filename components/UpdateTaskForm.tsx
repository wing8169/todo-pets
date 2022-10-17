import { Box, Dialog, Typography, Button, IconButton } from "@mui/material";
import BaseDateField from "./BaseDateField";
import { useState } from "react";
import BaseTextAreaField from "./BaseTextAreaField";
import bg from "../public/bg.png";
import { useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { snackbarMessage } from "../redux/snackbarSlice";
import { useAppDispatch } from "../redux/hooks";

type AppProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  title: string;
  status?: boolean;
  dueAt: Date;
};

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
  const dispatch = useAppDispatch();

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
            data-testid="deleteTask"
            onClick={() => {
              // Delete task
              fetch(`/api/task/${id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network Error.");
                  }
                  dispatch(
                    snackbarMessage({
                      message: "Successfully deleted the task.",
                      severity: "success",
                    })
                  );
                  // close dialog
                  handleClose();
                })
                .catch((e) => {
                  dispatch(
                    snackbarMessage({
                      message: e.toString(),
                      severity: "error",
                    })
                  );
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
        <Button
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            // Client-side validation
            if (!localTitle) {
              dispatch(
                snackbarMessage({
                  message: "Title must not be empty!",
                  severity: "error",
                })
              );
              return;
            }
            if (!localDueAt) {
              dispatch(
                snackbarMessage({
                  message: "Due date must not be empty!",
                  severity: "error",
                })
              );
              return;
            }
            // Update task
            fetch(`/api/task/${id}`, {
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
                dispatch(
                  snackbarMessage({
                    message: "Successfully updated the task!",
                    severity: "success",
                  })
                );
                // close dialog
                handleClose();
              })
              .catch((e) => {
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
          data-testid="updateTask"
        >
          Update
        </Button>
      </Box>
    </Dialog>
  );
};

export default UpdateTaskForm;
