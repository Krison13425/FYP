import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Snackbar,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { googleLogin, userAuthenticate } from "../../api";
import NavBar from "../global/Navbar";
import RegisterComponent from "./UerRegister";
import { useGoogleLogin } from "@react-oauth/google";

const UserLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const cookies = new Cookies();

  const handleShowPassword = () => {
    setShowPassword(true);
  };

  const handleHidePassword = () => {
    setShowPassword(false);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleForgetPassword = (event) => {
    event.preventDefault();
    navigate("/ForgetPassword");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.trim() === "" || password.trim() === "") {
      setSnackbarMessage("Both fields must be filled out");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const loginCredentials = {
      username: username,
      password: password,
    };

    try {
      const response = await userAuthenticate(loginCredentials);
      if (
        response.role === 0 &&
        response.id !== null &&
        response.token !== null &&
        response.email !== null &&
        response.loginType !== null
      ) {
        cookies.set("user", response.token, { path: "/" });
        localStorage.setItem("id", response.id);
        localStorage.setItem("role", response.role);
        localStorage.setItem("useremail", response.email);
        localStorage.setItem("logintype", response.loginType);
        setSnackbarMessage("User Login Successfully");
        setSnackbarSeverity("success");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else if (response.message === "Email not verified") {
        setSnackbarMessage("Email not verified");
        setSnackbarSeverity("error");
      } else if (response.role !== 0) {
        setSnackbarMessage("Invalid User");
        setSnackbarSeverity("error");
      } else {
        setSnackbarMessage("Invalid password or Email");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarMessage("Invalid password or Email");
      setSnackbarSeverity("error");
    }

    setOpenSnackbar(true);
  };

  const handleGoogleLoginSuccess = async (tokenResponse) => {
    try {
      const response = await googleLogin(tokenResponse.access_token);
      if (
        response.role === 0 &&
        response.id !== null &&
        response.token !== null &&
        response.email !== null &&
        response.loginType !== null
      ) {
        cookies.set("user", response.token, { path: "/" });
        localStorage.setItem("id", response.id);
        localStorage.setItem("role", response.role);
        localStorage.setItem("useremail", response.email);
        localStorage.setItem("logintype", response.loginType);
        setSnackbarMessage("User Login Successfully");
        setSnackbarSeverity("success");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else if (response.role !== 0) {
        setSnackbarMessage("Invalid User");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarMessage("Google login failed");
      setSnackbarSeverity("error");
    }

    setOpenSnackbar(true);
  };

  const handleGoogleLoginFailure = (responseGoogle) => {
    setSnackbarMessage("Google login failed");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onFailure: handleGoogleLoginFailure,
  });

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
            User Login
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

            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {showPassword ? (
                      <IconButton onClick={handleHidePassword}>
                        <VisibilityOff />
                      </IconButton>
                    ) : (
                      <IconButton onClick={handleShowPassword}>
                        <Visibility />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="h5" sx={{ mt: 2 }}>
              <Link
                href="/signup"
                underline="hover"
                style={{ color: "white" }}
                onClick={handleForgetPassword}
              >
                Forget Password?
              </Link>
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                width: 400,
                borderRadius: "50px",
                fontSize: "1rem",
              }}
              startIcon={<LoginOutlinedIcon />}
              size="large"
            >
              Login
            </Button>

            <Typography variant="h5" sx={{ mt: 2 }}>
              Don't Have An Account?{"  "}
              <Link
                href="/signup"
                underline="hover"
                style={{ color: "white" }}
                onClick={handleOpenDialog}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
          <Divider
            sx={{
              mt: 3,
              height: "1px",
              width: "100%",
              backgroundColor: "grey",
            }}
          />

          <Box>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{
                mt: 3,
                borderRadius: "20px",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
              }}
              size="large"
            >
              Sign In with Google
            </Button>
          </Box>
        </Box>

        <Dialog
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: "50px",
            },
          }}
          open={openDialog}
          onClose={handleCloseDialog}
        >
          <DialogTitle>
            <Typography variant="h2" align="center">
              Sign Up
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <RegisterComponent handleCloseDialog={handleCloseDialog} />
          </DialogContent>
        </Dialog>

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

export default UserLogin;
