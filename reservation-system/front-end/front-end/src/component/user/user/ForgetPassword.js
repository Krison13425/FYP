import { Alert, Snackbar } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { createPasswordResetToken } from "../../api";
import NavBar from "../global/Navbar";

const ForgetPassword = () => {
  const [username, setUsername] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createPasswordResetToken(username);
      console.log(response);

      setSnackbarMessage(
        "A verfication Email has been sent to your email. Please verify your email for resetting the password."
      );
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      localStorage.setItem("email", username);
    } catch (error) {
      console.error(error);

      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <NavBar />
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: "50px",
            px: 4,
            py: 6,
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid",
          }}
        >
          <Typography component="h1" variant="h3">
            Foegert Password
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Email"
              name="email"
              autoComplete="username"
              value={username}
              onChange={handleUsernameChange}
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                width: "50%",
                borderRadius: "20px",
                ml: 15,
              }}
              size="large"
            >
              Confirm Email
            </Button>
          </Box>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={8000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%", fontSize: "1rem" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default ForgetPassword;
