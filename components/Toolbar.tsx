import { Box, Typography } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import exportLogo from "../public/export.png";
import createLogo from "../public/create.png";
import CreateTaskForm from "./CreateTaskForm";

type AppProps = {
  header?: string;
  canExport?: boolean;
  canCreate?: boolean;
  data?: Object;
  ip: string;
};

// Toolbar
const Toolbar = ({ header, canExport, canCreate, data, ip }: AppProps) => {
  const [open, setOpen] = useState(false);

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
      <CreateTaskForm open={open} setOpen={setOpen} ip={ip} />
      {!!header && <Typography variant="h5">{header}</Typography>}
      <Box
        sx={{
          display: "flex",
          gap: 4,
        }}
      >
        {canExport && (
          <Image
            src={exportLogo}
            width={24}
            height={24}
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              exportData(); // On click, export data into JSON
            }}
          />
        )}
        {canCreate && (
          <Image
            src={createLogo}
            width={24}
            height={24}
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              setOpen(true); // On click, open the create task dialog
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default Toolbar;
