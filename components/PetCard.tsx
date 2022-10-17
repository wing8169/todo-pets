import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Lottie from "lottie-react";
import stars from "../public/stars.json";

type AppProps = {
  src: string;
  title: string;
};

function ImageLoader({ src }: any) {
  return `https://img.pokemondb.net/artwork/large/${src}`;
}

// PetCard component
const PetCard = ({ src, title }: AppProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        m: 3,
        color: "#4E4E4E",
        flexDirection: "column",
        background: "white",
        width: 200,
        height: 220,
        borderRadius: 3,
        boxShadow: "10px 10px 89px -39px rgba(0,0,0,0.75)",
      }}
    >
      <Lottie
        animationData={stars}
        loop={true}
        style={{
          position: "absolute",
          zIndex: 100,
        }}
      />
      <Image
        loader={ImageLoader}
        src={src}
        width={150}
        height={150}
        objectFit="contain"
        alt="Pet"
      />
      <Typography>
        {title.slice(0, 20)} {title.length > 20 ? "..." : ""}
      </Typography>
    </Box>
  );
};

export default PetCard;
