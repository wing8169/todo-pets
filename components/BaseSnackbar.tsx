import * as React from "react";
import { Alert, Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { snackbarMessage } from "../redux/snackbarSlice";

export default function BaseSnackbar() {
  const { message, severity } = useSelector(
    (state: RootState) => state.snackbar
  );
  const dispatch = useDispatch();

  if (!message) return <></>;

  return (
    <Snackbar
      open={!!message}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      onClose={(e, reason) => {
        if (reason === "clickaway") {
          return;
        }
        dispatch(
          snackbarMessage({
            message: "",
            severity: "info",
          })
        );
      }}
    >
      <Alert
        severity={
          severity === "error"
            ? "error"
            : severity === "success"
            ? "success"
            : "info"
        }
        variant="filled"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              dispatch(
                snackbarMessage({
                  message: "",
                  severity: "info",
                })
              );
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
