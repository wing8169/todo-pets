import { Box, Typography } from "@mui/material";
import Image from "next/image";
import coins from "../public/coins.png";

type AppProps = {
  value: number;
};

// Coins component
const Coins = ({ value }: AppProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 2,
        m: 3,
      }}
    >
      <Typography
        sx={{
          color: "#D27C2C",
          cursor: "pointer",
          fontWeight: "bold",
        }}
        onClick={() => {
          // on click, open the store modal
        }}
      >
        {value}
      </Typography>
      <Image
        src={coins}
        style={{ cursor: "pointer" }}
        width={32}
        height={32}
        onClick={() => {
          // on click, open the store modal
        }}
      />
    </Box>
  );
};

export default Coins;
