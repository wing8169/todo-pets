import { Box, Typography, Checkbox } from "@mui/material";
import moment from "moment";
import UpdateTaskForm from "./UpdateTaskForm";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { snackbarMessage } from "../redux/snackbarSlice";

type AppProps = {
  id: string;
  title: string;
  status?: boolean;
  dueDate: Date;
};

// Task
const Task = ({ id, title, status, dueDate }: AppProps) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 3,
          color: "#4E4E4E",
          gap: 3,
          borderRadius: 3,
          background: "white",
          margin: 1,
          marginLeft: 3,
          marginRight: 3,
          cursor: "pointer",
          justifyContent: "space-between",
          boxShadow: "10px 10px 89px -39px rgba(0,0,0,0.75)",
        }}
        onClick={(e) => {
          setOpen(true);
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Checkbox
            checked={status}
            onClick={(e) => {
              e.stopPropagation();
              // Patch task
              fetch(`/api/tasks/${id}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  title,
                  dueAt: dueDate,
                  status: !status,
                }),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network Error.");
                  }
                  dispatch(
                    snackbarMessage({
                      message: "Updated the task status",
                      severity: "success",
                    })
                  );
                })
                .catch((e) => {
                  console.log(e);
                  dispatch(
                    snackbarMessage({
                      message: e.toString(),
                      severity: "error",
                    })
                  );
                });
            }}
          />
          <Typography>{title}</Typography>
        </Box>
        <Typography
          sx={{
            alignSelf: "flex-end",
            justifySelf: "flex-end",
            minWidth: 100,
            color:
              moment().diff(dueDate, "days") > 0 && !status ? "red" : "#4E4E4E",
          }}
        >
          {moment(dueDate).format("YYYY-MM-DD")}
        </Typography>
      </Box>
      <UpdateTaskForm
        open={open}
        setOpen={setOpen}
        id={id}
        title={title}
        status={status}
        dueAt={dueDate}
      />
    </>
  );
};

export default Task;
