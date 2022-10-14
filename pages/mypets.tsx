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
import pets from "../public/pokemons.json";

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
              {Object.keys(pets)
                .filter(
                  (title) =>
                    !search ||
                    title.toLowerCase().includes(search.toLowerCase())
                )
                .map((title) => (
                  <PetCard
                    src={pets[title as keyof typeof pets]}
                    title={title}
                    key={title}
                  />
                ))}
            </Box>
          </Box>
        </Panel>
      </Background>
    </Fragment>
  );
};

export default MyPets;
