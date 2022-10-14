import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Store from "./Store";
import { useState } from "react";

import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { purple } from "@mui/material/colors";
import chest from "../public/chest.json";
import Lottie from "lottie-react";

const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#D27C2C",
  "&:hover": {
    backgroundColor: "#D27C2C",
  },
  width: 200,
}));

type AppProps = {
  coins: number;
};

// ChestButton component
const ChestButton = ({ coins }: AppProps) => {
  const [open, setOpen] = useState(false);

  // TODO: Handle show reward mechanism

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
      }}
    >
      {open && (
        <Lottie
          animationData={chest}
          loop={false}
          onComplete={() => {
            // TODO: Show the reward and timeout after few seconds
            setOpen(false);
          }}
        />
      )}
      <ColorButton
        variant="contained"
        onClick={() => {
          setOpen(true);
        }}
        size="large"
        disabled={open}
      >
        Draw a Wish
      </ColorButton>
    </Box>
  );
};

export default ChestButton;
