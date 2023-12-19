import { Alert, IconButton, InputAdornment, Snackbar } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React, { useState } from "react";
import { register } from "../../api";

const RegisterComponent = ({ handleCloseDialog }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (event.target.value === "") {
      setEmailError("Email field cannot be blank");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (event.target.value === "") {
      setPasswordError("Password field cannot be blank");
    } else if (!passwordRegex.test(event.target.value)) {
      setPasswordError(
        "Password must contain at least one uppercase, one lowercase, one digit, one special char and be min 8 characters long"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    if (event.target.value === "") {
      setConfirmPasswordError("Confirm password field cannot be blank");
    } else if (event.target.value !== password) {
      setConfirmPasswordError("Passwords do not match!");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const registerCredentials = {
      username: email,
      password: confirmPassword,
    };

    if (
      registerCredentials.email !== "" &&
      registerCredentials.password !== ""
    ) {
      try {
        const response = await register(registerCredentials);

        setSnackbarMessage(
          "Registration Success! A verification email has been sent to your email. Please verify your email."
        );
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setTimeout(() => {
          handleCloseDialog();
        }, 2000);
      } catch (error) {
        setSnackbarMessage(
          error.message || "An error occurred during registration."
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } else {
      setSnackbarMessage("Please Fill Up the form");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ mt: 1, p: 2 }}
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
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={email}
        onChange={handleEmailChange}
        error={!!emailError}
        helperText={emailError}
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
        name="password"
        label="Password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={handlePasswordChange}
        error={!!passwordError}
        helperText={passwordError}
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePasswordVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
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
        id="confirmPassword"
        autoComplete="confirm-password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        error={!!confirmPasswordError}
        helperText={confirmPasswordError}
        type={showConfirmPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleToggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mt: 3,
          width: 100,
          borderRadius: "50px",
          ml: 26,
        }}
        size="large"
      >
        Register
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
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
    </Box>
  );
};

export default RegisterComponent;
