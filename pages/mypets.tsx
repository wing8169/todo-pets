import type { NextPage } from "next";
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import { Fragment, useState } from "react";
import Background from "../components/Background";
import Panel from "../components/Panel";
import SideBar from "../components/SideBar";
import Coins from "../components/Coins";
import { Box } from "@mui/material";
import BaseTextField from "../components/BaseTextField";
import PetCard from "../components/PetCard";

const pets = [
  {
    src: "bulbasaur.jpg",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    src: "bulbasaur.jpg",
    title: "PetCard2",
  },
  {
    src: "bulbasaur.jpg",
    title: "PetCard3",
  },
  {
    src: "bulbasaur.jpg",
    title: "PetCard4",
  },
  {
    src: "bulbasaur.jpg",
    title: "PetCard5",
  },
  {
    src: "bulbasaur.jpg",
    title: "PetCard6",
  },
  {
    src: "bulbasaur.jpg",
    title: "PetCard7",
  },
  {
    src: "bulbasaur.jpg",
    title: "PetCard8",
  },
  {
    src: "bulbasaur.jpg",
    title: "PetCard9",
  },
];

const MyPets: NextPage = () => {
  const [search, setSearch] = useState("");

  return (
    <Fragment>
      <CssBaseline />
      <Head>
        <title>Todo Pets</title>
        <meta name="description" content="A Todo App for the collectors" />
        <link rel="icon" href="/logo.png" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Background>
        <Panel>
          <SideBar />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <Coins value={1050} />
            <BaseTextField label="Search" value={search} setValue={setSearch} />
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {pets.map((pet) => (
                <PetCard src={pet.src} title={pet.title} key={pet.title} />
              ))}
            </Box>
          </Box>
        </Panel>
      </Background>
    </Fragment>
  );
};

export default MyPets;
