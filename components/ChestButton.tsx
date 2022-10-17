import { Box, Typography } from "@mui/material";
import { useState } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import chest from "../public/chest.json";
import pokemon from "../public/pokemon.json";
import Lottie from "lottie-react";
import PetCard from "./PetCard";
import pokemons from "../public/pokemons.json";
import { useDispatch } from "react-redux";
import { snackbarMessage } from "../redux/snackbarSlice";

type AppProps = {
  coins: number;
  ip: string;
};

// ChestButton component
const ChestButton = ({ coins, ip }: AppProps) => {
  const [open, setOpen] = useState(false);
  const [pet, setPet] = useState("");
  const dispatch = useDispatch();

  if (!!pet)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <PetCard src={pokemons[pet as keyof typeof pokemons]} title={pet} />
        <Typography
          variant="h6"
          sx={{
            color: "#4E4E4E",
          }}
        >
          <b>{pet}</b> has joined your family!
        </Typography>
      </Box>
    );

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
                dispatch(
                  snackbarMessage({
                    message: err.toString(),
                    severity: "error",
                  })
                );
              });
          }}
        />
      ) : (
        <Lottie
          style={{
            height: 200,
            width: 200,
          }}
          animationData={pokemon}
          loop={true}
        />
      )}
      <Button
        variant="contained"
        onClick={() => {
          setOpen(true);
        }}
        color="warning"
        disabled={open || coins < 5}
      >
        {open ? "Your New Pet Is Arriving..." : "Get a New Pet (-5 Coins)"}
      </Button>
    </Box>
  );
};

export default ChestButton;
