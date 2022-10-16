import "../styles/style.css";
import type { AppProps } from "next/app";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { store } from "../redux/store";
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Component {...pageProps} />
      </LocalizationProvider>
    </Provider>
  );
}

export default MyApp;
