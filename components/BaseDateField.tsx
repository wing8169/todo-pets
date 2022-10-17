import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

type AppProps = {
  value: Date;
  setValue: React.Dispatch<React.SetStateAction<Date>>;
  label: string;
};

const BaseDateField = ({ value, setValue, label }: AppProps) => (
  <DatePicker
    label={label}
    value={value}
    onChange={(newValue) => {
      if (!!newValue) setValue(newValue);
    }}
    InputProps={{
      disableUnderline: true,
      style: {
        color: "#33AE4E",
        border: "1px solid #e2e2e1",
        overflow: "hidden",
        borderRadius: 12,
        backgroundColor: "white",
      },
    }}
    renderInput={(params) => (
      <TextField
        sx={{
          maxWidth: 300,
        }}
        variant="filled"
        {...params}
      />
    )}
  />
);

export default BaseDateField;
