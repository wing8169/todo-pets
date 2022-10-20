import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import BigLottie from "./BigLottie";
import CreateTaskForm from "./CreateTaskForm";

type AppProps = {
  header?: string;
  canExport?: boolean;
  canCreate?: boolean;
  data?: Object;
  id: string;
};

// Toolbar
const Toolbar = ({ header, canExport, canCreate, data, id }: AppProps) => {
  const [open, setOpen] = useState(false);
  const [openLottie, setOpenLottie] = useState(false);

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 3,
        paddingTop: 1,
        paddingBottom: 1,
        color: "#4E4E4E",
      }}
    >
      <CreateTaskForm open={open} setOpen={setOpen} id={id} />
      <BigLottie open={openLottie} setOpen={setOpenLottie} />
      {!!header && <Typography variant="h5">{header}</Typography>}
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        {canExport && (
          <Button
            variant="contained"
            onClick={() => {
              exportData();
            }}
            color="warning"
          >
            Export
          </Button>
        )}
        {canCreate && (
          <Button
            variant="contained"
            onClick={() => {
              setOpen(true);
            }}
          >
            Add
          </Button>
        )}
        <Button
          variant="contained"
          onClick={() => {
            setOpenLottie(true);
          }}
          color="secondary"
        >
          Open Big Lottie
        </Button>
      </Box>
    </Box>
  );
};

export default Toolbar;
