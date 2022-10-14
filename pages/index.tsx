import type { NextPage } from "next";
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import { Fragment, useState } from "react";
import Background from "../components/Background";
import Panel from "../components/Panel";
import SideBar from "../components/SideBar";
import Coins from "../components/Coins";
import { Box, Divider } from "@mui/material";
import BaseTextField from "../components/BaseTextField";
import Toolbar from "../components/Toolbar";
import Task from "../components/Task";
import moment from "moment";

const tasks = [
  {
    id: "1",
    title: "Clear iron ores",
    status: false,
    deleted: false,
    createdAt: new Date(),
    dueAt: moment("2022-10-15").toDate(),
  },
  {
    id: "2",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: false,
    deleted: false,
    createdAt: new Date(),
    dueAt: moment("2022-10-13").toDate(),
  },
  {
    id: "3",
    title: "Clear iron ores",
    status: false,
    deleted: false,
    createdAt: new Date(),
    dueAt: new Date(),
  },
  {
    id: "4",
    title: "Clear iron ores",
    status: false,
    deleted: false,
    createdAt: new Date(),
    dueAt: new Date(),
  },
  {
    id: "5",
    title: "Clear iron ores",
    status: false,
    deleted: false,
    createdAt: new Date(),
    dueAt: new Date(),
  },
  {
    id: "6",
    title: "Clear iron ores",
    status: false,
    deleted: false,
    createdAt: new Date(),
    dueAt: new Date(),
  },
  {
    id: "7",
    title: "Clear iron ores",
    status: false,
    deleted: false,
    createdAt: new Date(),
    dueAt: new Date(),
  },
];

const Home: NextPage = () => {
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
            <Toolbar header="Today" canExport={true} canCreate={true} />
            {tasks
              .filter((task) => moment(task.dueAt).isSame(new Date(), "day"))
              .map((task) => (
                <Task
                  title={task.title}
                  status={task.status}
                  dueDate={task.dueAt}
                  key={task.id}
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
              .map((task) => (
                <Task
                  title={task.title}
                  status={task.status}
                  dueDate={task.dueAt}
                  key={task.id}
                />
              ))}
          </Box>
        </Panel>
      </Background>
    </Fragment>
  );
};

export default Home;
