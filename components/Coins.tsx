import { Box, Typography } from "@mui/material";
import Image from "next/image";
import coins from "../public/coins.png";
import Store from "./Store";
import { useEffect, useState } from "react";
import "animate.css";

type AppProps = {
  value: number;
  ip: string;
};

// Coins component
const Coins = ({ value, ip }: AppProps) => {
  const [open, setOpen] = useState(false);
  const [classes, setClasses] = useState(
    "animate__animated animate__heartBeat"
  );

  useEffect(() => {
    // whenever the coin value changes, animate heartbeat effect
    setClasses("");
    setTimeout(() => {
      setClasses("animate__animated animate__heartBeat");
    }, 200);
  }, [value]);

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
        className={classes}
        variant="h6"
      >
        {value}
      </Typography>
      <Image
        src={coins}
        style={{ cursor: "pointer" }}
        objectFit="contain"
        width={40}
        height={40}
        onClick={() => {
          // on click, open the store modal
          setOpen(true);
        }}
      />
      <Store open={open} setOpen={setOpen} coins={value} ip={ip} />
    </Box>
  );
};

export default Coins;
