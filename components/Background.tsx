import { Box } from "@mui/material";
import bg from "../public/bg.png";

type AppProps = {
  children: React.ReactNode;
};

// Green linear image background
const Background = ({ children }: AppProps) => (
  <Box
    sx={{
      backgroundImage: `url(${bg.src})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      minWidth: "100vw",
      minHeight: "100vh",
      padding: { xs: 0, sm: 3 },
      display: "flex",
    }}
  >
    {children}
  </Box>
);

export default Background;
