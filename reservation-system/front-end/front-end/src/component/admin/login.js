import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { ColorModeContext } from "../../theme";
import { adminAuthenticate } from "../api";
import Alert from "./Global/Alert";

const AdminLogin = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [showPassword, setShowPassword] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginCredentials = {
      username: username,
      password: password,
    };

    try {
      const response = await adminAuthenticate(loginCredentials);
      cookies.set("user", response.token, {
        path: "/",
      });
      localStorage.setItem("id", response.id);
      localStorage.setItem("role", response.role);
      navigate("/admin/dashboard");
      setSnackbarMessage("Admin Login Successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Invalid username or password");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <h1> {cookies.user}</h1>
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
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
          Admin Login
          {cookies.user}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="User Name"
            name="username"
            autoComplete="username"
            value={username}
            onChange={handleUsernameChange}
            autoFocus
          />

          <TextField
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            startIcon={<LoginOutlinedIcon />}
          >
            Login
          </Button>

          <IconButton onClick={colorMode.toggleColorMode} disabled>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>

          <Switch
            checked={theme.palette.mode === "dark"}
            onChange={colorMode.toggleColorMode}
          />
        </Box>
      </Box>
      <Alert
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default AdminLogin;
