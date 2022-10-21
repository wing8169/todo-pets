import * as React from "react";
import { Box } from "@mui/material";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import pokeball from "../public/pokeball.json";
import Lottie from "lottie-react";
import bg from "../public/bg.png";

export default function LoadingOverlay() {
  const { isLoading } = useSelector((state: RootState) => state.loading);

  if (!isLoading) return <></>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 5,
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        gap: 3,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 200,
      }}
    >
      <Lottie
        style={{
          maxHeight: 200,
          maxWidth: 200,
        }}
        animationData={pokeball}
        loop={true}
      />
    </Box>
  );
}
