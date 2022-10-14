import { Box } from "@mui/material";

type AppProps = {
  children: React.ReactNode;
};

// White glass panel
const Panel = ({ children }: AppProps) => (
  <Box
    sx={{
      background: `linear-gradient(117.15deg, rgba(255, 255, 255, 0.64) 0%, rgba(255, 255, 255, 0.16) 100%)`,
      backdropFilter: `blur(40px)`,
      borderRadius: { xs: 0, sm: 3 },
      border: "1px solid rgba(255,255,255,0.2)",
      flex: 1,
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    }}
  >
    {children}
  </Box>
);

export default Panel;
