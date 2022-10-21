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
import { Box, Typography } from "@mui/material";
import BaseTextField from "../components/BaseTextField";
import PetCard from "../components/PetCard";
import pets from "../public/pokemons.json";
import { User } from "../interfaces";
import { Socket } from "socket.io-client";
import io from "socket.io-client";
import BaseSnackbar from "../components/BaseSnackbar";
import { snackbarMessage } from "../redux/snackbarSlice";
import BaseSlider from "../components/BaseSlider";
import { useAppDispatch } from "../redux/hooks";
import { auth } from "../redux/authSlice";

let socket: Socket;

const MyPets: NextPage = ({
  ip,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<User>({
    id: "",
    self: "",
    ipAddress: "",
    coins: 0,
    pets: [],
    newPet: "",
  });
  const dispatch = useAppDispatch();

  // on site load, connect to the socket server
  useEffect(() => {
    // TODO: Clean up socket when unmount
    socketInitializer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const socketInitializer = async () => {
    // connect to socket server
    await fetch("/api/sockets");
    socket = io();

    // on user event
    socket.on("user", (user) => {
      if (user.ipAddress !== ip) return; // skip user that is not owned
      // update coins and pets
      setUser((prev) => ({ ...prev, coins: user.coins, pets: user.pets }));
    });
  };

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
          // save user id to redux store
          dispatch(auth({ id: data.id }));
        });
      })
      .catch((e) => {
        console.log(e);
        dispatch(
          snackbarMessage({
            message: e.toString(),
            severity: "error",
          })
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <SideBar ip={ip} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <Coins value={user.coins} />
            <Typography
              variant="h5"
              sx={{
                ml: 3,
                mb: 1,
              }}
            >
              My Pet Collection: {user.pets.length}
            </Typography>
            <Typography
              sx={{
                ml: 3,
                mb: 1,
                fontWeight: "bold",
              }}
            >
              {Array.from(new Set(user.pets)).length} /{" "}
              {Object.keys(pets).length} Unique Pets
            </Typography>
            <BaseSlider
              value={Array.from(new Set(user.pets)).length}
              maxValue={Object.keys(pets).length}
            />
            <BaseTextField label="Search" value={search} setValue={setSearch} />
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                mb: 3,
                minWidth: {
                  xs: "100vw",
                  sm: "50%",
                },
              }}
            >
              {user.pets
                .filter(
                  (pet) =>
                    !search ||
                    pet.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((pet, index) => (
                  <PetCard
                    src={pets[pet.name as keyof typeof pets]}
                    title={pet.name}
                    key={index + "-" + pet.name}
                  />
                ))}
            </Box>
          </Box>
        </Panel>
      </Background>
      <BaseSnackbar />
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
