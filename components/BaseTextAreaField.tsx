import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

type AppProps = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  label: string;
};

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#33AE4E",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#33AE4E",
  },
  "& .MuiFilledInput-root": {
    border: "1px solid #e2e2e1",
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: "white",
    "&:hover": {},
    "&.Mui-focused": {},
  },
});

// BaseTextAreaField
const BaseTextAreaField = ({ value, setValue, label }: AppProps) => (
  <CssTextField
    InputProps={{ disableUnderline: true }}
    onChange={(e) => {
      setValue(e.target.value);
    }}
    label={label}
    value={value}
    variant="filled"
    multiline
    rows={4}
    sx={{
      maxWidth: 300,
    }}
  />
);

export default BaseTextAreaField;
