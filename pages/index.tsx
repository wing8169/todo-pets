import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import { Fragment, useState, useEffect } from "react";
import Background from "../components/Background";
import Panel from "../components/Panel";
import SideBar from "../components/SideBar";
import Coins from "../components/Coins";
import { Box, Divider } from "@mui/material";
import BaseTextField from "../components/BaseTextField";
import Toolbar from "../components/Toolbar";
import TaskComponent from "../components/Task";
import moment from "moment";
import { User, Task } from "../interfaces";
import socketClient, { Socket } from "socket.io-client";
import io from "socket.io-client";
let socket: Socket;

const Home: NextPage = ({
  ip,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<User>({
    id: "",
    ipAddress: "",
    coins: 0,
    pets: [],
  });
  const [tasks, setTasks] = useState<Task[]>([]);

  // on site load, connect to the socket server
  useEffect(() => {
    // socket = socketClient("/api/sockets");
    // // new connection
    // socket.on("connection", (d) => {
    //   console.log(d);
    //   // attempt to login to server
    //   // const myId = localStorage.getItem("socketId")
    //   //   ? localStorage.getItem("socketId")
    //   //   : uuidv4();
    //   // localStorage.setItem("socketId", myId);
    //   // newSocket.emit("arena-join", myId, (ack) => {});
    // });
  }, []);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/sockets");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
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
        });
        // get all user tasks
        fetch(
          `/api/tasks?${new URLSearchParams({
            sort: JSON.stringify([
              {
                status: "asc",
              },
              {
                dueAt: "asc",
              },
            ]),
            filters: JSON.stringify({ ipAddress: ip, deleted: false }),
          })}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network Error.");
            }
            // set tasks
            response.json().then((data) => {
              setTasks(data);
            });
          })
          .catch((e) => {
            console.log(e);
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
              mb: 2,
            }}
          >
            <Coins value={user.coins} />
            <BaseTextField label="Search" value={search} setValue={setSearch} />
            <Toolbar
              header="Today"
              canExport={true}
              canCreate={true}
              data={tasks.filter(
                (task) =>
                  !search ||
                  task.title.toLowerCase().includes(search.toLowerCase())
              )}
              ip={ip}
            />
            {tasks
              .filter((task) => moment(task.dueAt).isSame(new Date(), "day"))
              .filter(
                (task) =>
                  !search ||
                  task.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((task) => (
                <TaskComponent
                  title={task.title}
                  status={task.status}
                  dueDate={task.dueAt}
                  key={task.id}
                  id={task.id}
                />
              ))}
            <Divider
              variant="middle"
              sx={{
                p: 1,
                color: "#4E4E4E",
              }}
            >
              Other Days
            </Divider>
            {tasks
              .filter((task) => !moment(task.dueAt).isSame(new Date(), "day"))
              .filter(
                (task) =>
                  !search ||
                  task.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((task) => (
                <TaskComponent
                  title={task.title}
                  status={task.status}
                  dueDate={task.dueAt}
                  key={task.id}
                  id={task.id}
                />
              ))}
          </Box>
        </Panel>
      </Background>
    </Fragment>
  );
};

// get client IP address (::1 if localhost)
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const forwarded = req.headers["x-forwarded-for"];
  let ip = forwarded ? forwarded : req.connection.remoteAddress;
  if (!ip) {
    console.log("IP not found");
    ip = "default";
  }
  return {
    props: {
      ip,
    },
  };
};

export default Home;
