import "../styles/style.css";
import type { AppProps } from "next/app";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Component {...pageProps} />
    </LocalizationProvider>
  );
}

export default MyApp;
