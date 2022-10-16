import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

type AppProps = {
  value: number;
  maxValue: number;
};

export default function BaseSlider(props: AppProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        ml: 3,
        mr: 3,
        mb: 1,
        maxWidth: 300,
      }}
    >
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          color="secondary"
          value={Math.round((props.value / props.maxValue) * 100)}
          sx={{
            height: 10,
          }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          (props.value / props.maxValue) * 100
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
