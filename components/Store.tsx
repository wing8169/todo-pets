import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { Box, Typography } from "@mui/material";
import bg from "../public/bg.png";
import StoreContent from "./StoreContent";

type AppProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  coins: number;
  id: string;
};

const Store = ({ open, setOpen, coins, id }: AppProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 5,
          backgroundImage: `url(${bg.src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          gap: 3,
        }}
      >
        <Typography variant="h5" sx={{ color: "#4E4E4E" }}>
          Pet Store
        </Typography>
        <StoreContent coins={coins} id={id} />
      </Box>
    </Dialog>
  );
};

export default Store;
