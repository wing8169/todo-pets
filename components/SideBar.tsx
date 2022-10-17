import { Box, Typography } from "@mui/material";
import Image from "next/image";
import logo from "../public/logo.png";
import SideBarItem from "./SideBarItem";

type AppProps = { ip: string };

// side bar item list
const sideBarItems = [
  { src: "calendar", text: "My Tasks", route: "/" },
  { src: "pet", text: "My Pets", route: "/mypets" },
];

// Side bar component
const SideBar = ({ ip }: AppProps) => {
  return (
    <Box
      sx={{
        width: {
          xs: "100%",
          sm: 250,
        },
        height: { xs: "inherit", sm: "100%" },
        background:
          "linear-gradient(117.15deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 100%)",
        backdropFilter: "blur(40px)",
        borderRadius: { xs: 0, sm: "12px 0px 0px 12px" },
        display: "flex",
        flexDirection: {
          xs: "row",
          sm: "column",
        },
        justifyContent: {
          xs: "space-between",
          sm: "flex-start",
        },
        alignItems: "center",
        paddingTop: {
          xs: 0,
          sm: 4,
        },
        paddingBottom: {
          xs: 0,
          sm: 4,
        },
        gap: 3,
      }}
    >
      <Box
        sx={{
          width: {
            xs: 64,
            sm: "100%",
            display: "flex",
            justifyContent: "center",
          },
        }}
      >
        <Image src={logo} alt="Logo" />
      </Box>
      <Typography
        fontWeight="bold"
        sx={{
          display: { xs: "none", sm: "block" },
          mb: { xs: 0, sm: 2 },
        }}
      >
        My IP: {ip}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "row",
            sm: "column",
          },
          gap: 3,
          mr: 5,
        }}
      >
        {sideBarItems.map((sideBarItem) => (
          <SideBarItem
            src={sideBarItem.src}
            text={sideBarItem.text}
            route={sideBarItem.route}
            key={sideBarItem.text}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SideBar;
