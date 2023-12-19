import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useTheme } from "@mui/material/styles";
import React from "react";

const Alert = ({ open, setOpen, severity, message }) => {
  const theme = useTheme();
  const filledVariant = theme.palette.mode === "dark" ? "filled" : "standard";
  const elevationLevel = theme.palette.mode === "dark" ? 6 : 0;

  return (
    <Snackbar
      open={open}
      autoHideDuration={8000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <MuiAlert
        onClose={() => setOpen(false)}
        severity={severity}
        sx={{ width: "100%", fontSize: "1rem" }}
        elevation={elevationLevel}
        variant={filledVariant}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;
