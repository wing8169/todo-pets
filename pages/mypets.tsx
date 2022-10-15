import type {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import { Fragment, useState, useEffect } from "react";
import Background from "../components/Background";
import Panel from "../components/Panel";
import SideBar from "../components/SideBar";
import Coins from "../components/Coins";
import { Box } from "@mui/material";
import BaseTextField from "../components/BaseTextField";
import PetCard from "../components/PetCard";
import pets from "../public/pokemons.json";
import { User } from "../interfaces";

const MyPets: NextPage = ({
  ip,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<User>({
    id: "",
    ipAddress: "",
    coins: 0,
    pets: [],
  });

  useEffect(() => {
    // on site load, create / get user data by ip address
    fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ipAddress: ip }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network Error.");
        }
        // set user
        response.json().then((data) => {
          setUser(data);
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

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
            <Coins value={user.coins} />
            <BaseTextField label="Search" value={search} setValue={setSearch} />
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {user.pets
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

// get client IP address (::1 if localhost)
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded ? forwarded : req.connection.remoteAddress;
  return {
    props: {
      ip,
    },
  };
};

export default MyPets;
