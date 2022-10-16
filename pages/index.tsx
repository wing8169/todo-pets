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
import { Socket } from "socket.io-client";
import io from "socket.io-client";
import BaseSnackbar from "../components/BaseSnackbar";
import { useDispatch } from "react-redux";
import { snackbarMessage } from "../redux/snackbarSlice";

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
  const dispatch = useDispatch();

  // on site load, connect to the socket server
  useEffect(() => {
    // TODO: Clean up socket on unmount
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    // connect to socket server
    await fetch("/api/sockets");
    socket = io();

    // on task event
    socket.on("task", (task) => {
      if (task.ipAddress !== ip) return; // skip task that is not owned
      setTasks((prev) => {
        // check if task exists in the tasks state
        const existingTask = prev.find((t) => t.id === task.id);
        if (!existingTask)
          return [task, ...prev].sort((a, b) => {
            // task sorting
            if (a.status !== b.status) {
              if (a.status) return 1;
              return -1;
            }
            if (a.dueAt > b.dueAt) return 1;
            return -1;
          });
        // check if existingTask lastModifiedAt is more than task
        if (existingTask.lastModifiedAt >= task.lastModifiedAt) return prev;
        // patch the tasks
        return [task, ...prev.filter((p) => p.id !== task.id)].sort((a, b) => {
          // task sorting
          if (a.status !== b.status) {
            if (a.status) return 1;
            return -1;
          }
          if (a.dueAt > b.dueAt) return 1;
          return -1;
        });
      });
    });

    // on user event
    socket.on("user", (user) => {
      if (user.ipAddress !== ip) return; // skip user that is not owned
      // update coins
      setUser((prev) => ({ ...prev, coins: user.coins }));
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
            filters: JSON.stringify({ ipAddress: ip }),
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
            dispatch(
              snackbarMessage({
                message: e.toString(),
                severity: "error",
              })
            );
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
            <Coins value={user.coins} ip={ip} />
            <BaseTextField label="Search" value={search} setValue={setSearch} />
            <Toolbar
              header="Today"
              canExport={true}
              canCreate={true}
              data={tasks.filter(
                (task) =>
                  !task.deleted &&
                  (!search ||
                    task.title.toLowerCase().includes(search.toLowerCase()))
              )}
              ip={ip}
            />
            {tasks
              .filter((task) => moment(task.dueAt).isSame(new Date(), "day"))
              .filter(
                (task) =>
                  !task.deleted &&
                  (!search ||
                    task.title.toLowerCase().includes(search.toLowerCase()))
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
                  !task.deleted &&
                  (!search ||
                    task.title.toLowerCase().includes(search.toLowerCase()))
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
      <BaseSnackbar />
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
