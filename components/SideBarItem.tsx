import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

type AppProps = {
  src: string;
  text: string;
  route: string;
};

// Side bar item component
const SideBarItem = ({ src, text, route }: AppProps) => {
  const router = useRouter();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        gap: 2,
      }}
      onClick={() => {
        // on click, navigate to the clicked route
        router.push(route);
      }}
    >
      <Image
        src={require(`../public/${src}${
          router.pathname === route ? "Green" : ""
        }.png`)}
        width={32}
        height={32}
      />
      <Typography
        sx={{
          color: router.pathname === route ? "#33AE4E" : "4E4E4E",
          display: {
            xs: "none",
            sm: "block",
          },
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default SideBarItem;
