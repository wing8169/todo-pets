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

type AppProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ip: string;
};

const ColorButton = styled(Button)(({ theme }) => ({
  alignSelf: "center",
  backgroundColor: "#D27C2C",
  "&:hover": {
    backgroundColor: "#D27C2C",
  },
  width: 200,
}));

// CreateTaskForm
const CreateTaskForm = ({ open, setOpen, ip }: AppProps) => {
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState(new Date());
  const [error, setError] = useState("");

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
            if (!title) {
              setError("Title must not be empty!");
              return;
            }
            if (!dueAt) {
              setError("Due date must not be empty!");
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
                // close dialog
                setError("");
                setTitle("");
                handleClose();
              })
              .catch((e) => {
                setError(e.toString());
              });
          }}
          size="large"
        >
          Create
        </ColorButton>
      </Box>
    </Dialog>
  );
};

export default CreateTaskForm;
