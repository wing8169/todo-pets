import { Box } from "@mui/material";
import { useState } from "react";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import chest from "../public/chest.json";
import pokemon from "../public/pokemon.json";
import Lottie from "lottie-react";
import PetCard from "./PetCard";
import pokemons from "../public/pokemons.json";

const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#D27C2C",
  "&:hover": {
    backgroundColor: "#D27C2C",
  },
  width: 300,
}));

type AppProps = {
  coins: number;
  ip: string;
};

function ImageLoader({ src }: any) {
  return `https://img.pokemondb.net/artwork/large/${src}`;
}

// ChestButton component
const ChestButton = ({ coins, ip }: AppProps) => {
  const [open, setOpen] = useState(false);
  const [pet, setPet] = useState("");

  if (!!pet)
    return <PetCard src={pokemons[pet as keyof typeof pokemons]} title={pet} />;

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
      {open ? (
        <Lottie
          animationData={chest}
          loop={false}
          onComplete={() => {
            fetch("/api/wish", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ipAddress: ip }),
            })
              .then((resp) => {
                resp.json().then((data) => {
                  setPet(data.pet);
                  setOpen(false);
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        />
      ) : (
        <Lottie animationData={pokemon} loop={true} />
      )}
      <ColorButton
        variant="contained"
        onClick={() => {
          setOpen(true);
        }}
        size="large"
        disabled={open || coins < 5}
      >
        {open ? "Granting Your Wish..." : "Spend 5 Coins to Draw Now"}
      </ColorButton>
    </Box>
  );
};

export default ChestButton;
