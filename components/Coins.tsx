import { Box, Typography } from "@mui/material";
import Image from "next/image";
import coins from "../public/coins.png";
import Store from "./Store";
import { useState } from "react";

type AppProps = {
  value: number;
};

// Coins component
const Coins = ({ value }: AppProps) => {
  const [open, setOpen] = useState(false);

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
          setOpen(true);
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
          setOpen(true);
        }}
      />
      <Store open={open} setOpen={setOpen} coins={value} />
    </Box>
  );
};

export default Coins;
