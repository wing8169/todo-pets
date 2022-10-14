import { Box, Typography } from "@mui/material";
import Image from "next/image";
import exportLogo from "../public/export.png";
import createLogo from "../public/create.png";

type AppProps = {
  header?: string;
  canExport?: boolean;
  canCreate?: boolean;
};

// Toolbar
const Toolbar = ({ header, canExport, canCreate }: AppProps) => (
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
            // TODO: On click export
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

export default Toolbar;
