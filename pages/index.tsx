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
import { snackbarMessage } from "../redux/snackbarSlice";
import { useAppDispatch } from "../redux/hooks";
import { auth } from "../redux/authSlice";

let socket: Socket;

const Home: NextPage = ({
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const dispatch = useAppDispatch();

  // on site load, connect to the socket server
  useEffect(() => {
    // TODO: Clean up socket on unmount
    socketInitializer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const socketInitializer = async () => {
    if (!user.id) return;
    // connect to socket server
    await fetch("/api/sockets");
    socket = io();

    // on task event
    socket.on("task", (task) => {
      if (task.user !== `/user/${user.id}`) return; // skip task that is not owned
      setTasks((prev) => {
        // check if task exists in the tasks state
        const existingTask = prev.find((t) => t.id === task.id);
        // if it does not exist, add into the task list
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
          // save user id to redux store
          dispatch(auth({ id: data.id }));
          // get all user tasks
          fetch(
            `/api/user/${data.id}/tasks?${new URLSearchParams({
              sort: "+status,+dueAt",
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
                setTasks(data.contents);
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
              mb: 2,
              minWidth: {
                xs: "100%",
                sm: "50%",
              },
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
                  !task.deleted &&
                  (!search ||
                    task.title.toLowerCase().includes(search.toLowerCase()))
              )}
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
