import { Box, Typography, Checkbox } from "@mui/material";
import moment from "moment";

type AppProps = {
  title: string;
  status?: boolean;
  dueDate: Date;
};

// Task
const Task = ({ title, status, dueDate }: AppProps) => (
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
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Checkbox checked={status} />
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
);

export default Task;
