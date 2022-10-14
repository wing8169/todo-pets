import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography } from "@mui/material";
import bg from "../public/bg.png";
import ChestButton from "./ChestButton";

type AppProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  coins: number;
};

const Store = ({ open, setOpen, coins }: AppProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <AppBar sx={{ position: "relative", backgroundColor: "#5bb36e" }}>
        <Toolbar
          sx={{
            backgroundColor: "#5bb36e",
          }}
        >
          <IconButton
            edge="start"
            onClick={handleClose}
            aria-label="close"
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
          <Typography
            sx={{ ml: 2, flex: 1, color: "white" }}
            variant="h6"
            component="div"
          >
            Draw a Wish
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          backgroundImage: `url(${bg.src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          maxWidth: "100vw",
          p: 10,
          width: 300,
          height: 300,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ChestButton coins={coins} />
      </Box>
    </Dialog>
  );
};

export default Store;
