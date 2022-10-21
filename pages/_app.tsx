import "../styles/style.css";
import type { AppProps } from "next/app";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { setupStore } from "../redux/store";
import { Provider } from "react-redux";
import { useState } from "react";
import Button from "@mui/material/Button";
import FreePet from "../components/FreePet";
import LoadingOverlay from "../components/LoadingOverlay";

function MyApp({ Component, pageProps }: AppProps) {
  const [open, setOpen] = useState(false);
  return (
    <Provider store={setupStore()}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <LoadingOverlay />
        <Component {...pageProps} />
        <FreePet open={open} setOpen={setOpen} />
        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
          }}
          color="secondary"
          sx={{ position: "absolute", top: 20, right: 20 }}
        >
          Free Pet!
        </Button>
      </LocalizationProvider>
    </Provider>
  );
}

export default MyApp;
