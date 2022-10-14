import { Box } from "@mui/material";
import Image from "next/image";
import logo from "../public/logo.png";
import SideBarItem from "./SideBarItem";

type AppProps = {};

// side bar item list
const sideBarItems = [
  { src: "calendar", text: "My Tasks", route: "/" },
  { src: "pet", text: "My Pets", route: "/mypets" },
];

// Side bar component
const SideBar = ({}: AppProps) => {
  return (
    <Box
      sx={{
        width: 250,
        height: "100%",
        background:
          "linear-gradient(117.15deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 100%)",
        backdropFilter: "blur(40px)",
        borderRadius: "12px 0px 0px 12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 4,
        paddingBottom: 4,
        gap: 3,
      }}
    >
      <Image src={logo} />
      {sideBarItems.map((sideBarItem) => (
        <SideBarItem
          src={sideBarItem.src}
          text={sideBarItem.text}
          route={sideBarItem.route}
          key={sideBarItem.text}
        />
      ))}
    </Box>
  );
};

export default SideBar;
