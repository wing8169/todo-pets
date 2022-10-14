import { Box, Typography } from "@mui/material";
import Image from "next/image";
import coins from "../public/coins.png";

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
      }}
    >
      <Image loader={ImageLoader} src={src} width={150} height={150} />
      <Typography>
        {title.slice(0, 20)} {title.length > 20 ? "..." : ""}
      </Typography>
    </Box>
  );
};

export default PetCard;
