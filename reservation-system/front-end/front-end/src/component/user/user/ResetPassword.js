import { Alert, Snackbar } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../api";
import NavBar from "../global/Navbar";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const naviagte = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("useremail") && !localStorage.getItem("email")) {
      naviagte("/");
    }
  }, []);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(event.target.value)) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);

    if (event.target.value !== password) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !passwordError &&
      !confirmPasswordError &&
      password === confirmPassword &&
      token !== null
    ) {
      try {
        let email;

        if (localStorage.getItem("useremail")) {
          email = localStorage.getItem("useremail");
        } else {
          email = localStorage.getItem("email");
        }

        if (!email) {
          throw new Error("No email found for password reset");
        }

        console.log(email);
        const response = await resetPassword(email, confirmPassword, token);

        setSnackbarMessage("Password has been reset successfully.");
        setSnackbarSeverity("success");
      } catch (error) {
        setSnackbarMessage(error.response.data.message);
        setSnackbarSeverity("error");
      } finally {
        setOpenSnackbar(true);
      }

      if (localStorage.getItem("email")) {
        localStorage.removeItem("email");
      }
    } else {
      if (!token) {
        setSnackbarMessage(
          "No Reset Password Allowed Please Request a Reset Password"
        );
      } else {
        setSnackbarMessage("Please resolve all errors before submitting");
      }

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
            Reset Password
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
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              error={passwordError}
              helperText={
                passwordError
                  ? "Password must contain at least one uppercase, one lowercase, one digit, one special char and be min 8 characters long"
                  : ""
              }
            />
            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="confirm-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={confirmPasswordError}
              helperText={confirmPasswordError ? "Passwords do not match!" : ""}
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
              Reset Password
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

export default ResetPassword;
