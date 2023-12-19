import { Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import MenuDrawer from "./MenuDrawer";
import { useLocation, useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import Cookies from "universal-cookie";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const cookie = new Cookies();
  const MenuItems = [{ Name: "My Bookings", Link: "/ViewBookings" }];

  const [anchorEl, setAnchorEl] = useState(null);
  const [tokenExists, setTokenExists] = useState(
    cookies.user && cookies.user !== undefined
  );
  const [isUser, setIsUser] = useState(localStorage.getItem("role") === "0");
  const [email, setEmail] = useState("");

  const handleLogoClick = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("useremail");
    removeCookie("user");
    setTokenExists(false);
    navigate("/");
  };

  useEffect(() => {
    const userCookieExists = cookies.user && cookies.user !== undefined;
    setEmail(localStorage.getItem("useremail"));
    setTokenExists(userCookieExists);
  }, [cookies.user]);

  const [state, setState] = useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <AppBar
      elevation={0}
      position="sticky"
      sx={{ backgroundColor: "black", p: 2 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: { xs: "block", sm: "block", md: "none" } }}>
          <IconButton onClick={toggleDrawer("left", true)} color="inherit">
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>
          <MenuDrawer
            state={state}
            toggleDrawer={toggleDrawer}
            MenuItems={MenuItems}
          />
        </Box>

        <Box sx={{ displa: "flex" }} onClick={handleLogoClick}>
          <Link component={RouterLink} to="/">
            <img
              src="/skywingslogo.png"
              alt="Logo"
              style={{ height: "20px", marginRight: "10px" }}
            />
          </Link>
        </Box>

        <Box
          sx={{
            display:
              location.pathname === "/" || location.pathname === "/user/profile"
                ? { xs: "none", sm: "none", md: "flex" }
                : "none",
            gap: 10,
          }}
        >
          {MenuItems.map((item) => (
            <Button
              variant="text"
              size="medium"
              onClick={() => navigate(item.Link)}
              sx={{
                borderRadius: "15px",
                borderBottom: "2px solid transparent",
                textTransform: "none",
                "&:hover": {
                  borderBottom: "2px solid primary.main",
                  backgroundColor: "transparent",
                },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  cursor: "pointer",
                  display: "inline",
                  backgroundColor: "transparent",
                  color: "white",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                {item.Name}
              </Typography>
            </Button>
          ))}

          {tokenExists && isUser ? (
            <>
              <Tooltip
                sx={{ "& .MuiTooltip-tooltip": { fontSize: "1.25em" } }}
                title={email}
              >
                <IconButton
                  color="inherit"
                  onClick={handleClick}
                  sx={{
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                  }}
                >
                  <Avatar />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem
                  sx={{
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                    pointerEvents: "none",
                    cursor: "default",
                  }}
                >
                  {email}
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/user/profile"
                  onClick={handleClose}
                  sx={{
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                  }}
                >
                  <Avatar /> Profile
                </MenuItem>

                <Divider />
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                  }}
                >
                  <ListItemIcon>
                    <LogoutRoundedIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              variant="outlined"
              sx={{
                fontSize: "1rem",
                width: 100,
                borderRadius: "20px",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
              }}
              onClick={() => navigate("/UserLogin")}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
