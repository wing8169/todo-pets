import { Box, Typography } from "@mui/material";
import Image from "next/image";
import exportLogo from "../public/export.png";
import createLogo from "../public/create.png";

type AppProps = {
  header?: string;
  canExport?: boolean;
  canCreate?: boolean;
  data?: Object;
};

// Toolbar
const Toolbar = ({ header, canExport, canCreate, data }: AppProps) => {
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
              // TODO: On click create
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default Toolbar;
