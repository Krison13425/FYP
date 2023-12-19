import { Logout } from "@mui/icons-material";
import AirplaneTicketOutlinedIcon from "@mui/icons-material/AirplaneTicketOutlined";
import AirplanemodeInactiveOutlinedIcon from "@mui/icons-material/AirplanemodeInactiveOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ConnectingAirportsOutlinedIcon from "@mui/icons-material/ConnectingAirportsOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import FlightIcon from "@mui/icons-material/Flight";
import FlightLandOutlinedIcon from "@mui/icons-material/FlightLandOutlined";
import FlightTakeoffOutlinedIcon from "@mui/icons-material/FlightTakeoffOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LocalDiningOutlinedIcon from "@mui/icons-material/LocalDiningOutlined";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import MoneyOffOutlinedIcon from "@mui/icons-material/MoneyOffOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PublicIcon from "@mui/icons-material/Public";
import { Menu, MenuItem } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { styled, useTheme } from "@mui/material/styles";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { ColorModeContext } from "../../theme";
const drawerWidth = 240;

export const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${drawerWidth}px`,
  }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Sidebar = ({ open, setOpen }) => {
  const theme = useTheme();
  const [openList, setOpenList] = useState(false);

  const colorMode = useContext(ColorModeContext);

  const handleClickList = (listName) => {
    if (openList === listName) {
      setOpenList("");
    } else {
      setOpenList(listName);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleLogout = () => {
    cookies.remove("user", { path: "/" });
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    navigate("/admin");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setOpenList("");
  };

  const getAppBarColor = () => {
    return colorMode === "dark"
      ? theme.palette.background.default
      : theme.palette.background.default;
  };

  const getHoverColor = () => {
    return colorMode === "dark"
      ? theme.palette.primary.main
      : theme.palette.primary.main;
  };

  const getClickColor = () => {
    return colorMode === "dark"
      ? theme.palette.primary.dark
      : theme.palette.primary.dark;
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        open={open}
        display="flex"
        style={{ backgroundColor: getAppBarColor() }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              "&:hover": { backgroundColor: getHoverColor() },
              "&:active": { backgroundColor: getClickColor() },
            }}
          >
            <MenuIcon />
          </IconButton>
          <div style={{ flexGrow: 1 }}></div>
          <IconButton
            sx={{
              "&:hover": { backgroundColor: getHoverColor() },
              "&:active": { backgroundColor: getClickColor() },
            }}
            component={Link}
            to="/admin/dashboard"
          >
            <HomeOutlinedIcon />
          </IconButton>
          <IconButton
            onClick={colorMode.toggleColorMode}
            sx={{
              "&:hover": { backgroundColor: getHoverColor() },
              "&:active": { backgroundColor: getClickColor() },
            }}
          >
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          <IconButton
            onClick={handleClick}
            sx={{
              "&:hover": { backgroundColor: getHoverColor() },
              "&:active": { backgroundColor: getClickColor() },
            }}
          >
            <PersonOutlinedIcon />
          </IconButton>

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
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton
            onClick={handleDrawerClose}
            sx={{
              "&:hover": { backgroundColor: getHoverColor() },
              "&:active": { backgroundColor: getClickColor() },
            }}
          >
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {/* FLIGHT */}
          <ListItemButton
            onMouseEnter={() => setOpenList("flight")}
            onClick={() => handleClickList("flight")}
            sx={{
              "&:hover": { backgroundColor: getHoverColor() },
              "&:active": { backgroundColor: getClickColor() },
            }}
          >
            <ListItemIcon>
              <FlightTakeoffOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Flight" />
            {openList === "flight" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openList === "flight"} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: getHoverColor() },
                  "&:active": { backgroundColor: getClickColor() },
                }}
                component={Link}
                to="/admin/createFlight"
              >
                <ListItemIcon>
                  <FlightTakeoffOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Create Flight" />
              </ListItemButton>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: getHoverColor() },
                  "&:active": { backgroundColor: getClickColor() },
                }}
                component={Link}
                to="/admin/updateFlight"
              >
                <ListItemIcon>
                  <FlightLandOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Flight" />
              </ListItemButton>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: getHoverColor() },
                  "&:active": { backgroundColor: getClickColor() },
                }}
                component={Link}
                to="/admin/updateFlightStatus"
              >
                <ListItemIcon>
                  <AirplaneTicketOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Update Flight Status" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* PLANE */}
          <ListItemButton
            onMouseEnter={() => setOpenList("plane")}
            onClick={() => handleClickList("plane")}
            sx={{
              "&:hover": { backgroundColor: getHoverColor() },
              "&:active": { backgroundColor: getClickColor() },
            }}
          >
            <ListItemIcon>
              <FlightIcon />
            </ListItemIcon>
            <ListItemText primary="Plane" />
            {openList === "plane" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openList === "plane"} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: getHoverColor() },
                  "&:active": { backgroundColor: getClickColor() },
                }}
                component={Link}
                to="/admin/createPlane"
              >
                <ListItemIcon>
                  <FlightIcon />
                </ListItemIcon>

                <ListItemText primary="Create Plane" />
              </ListItemButton>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: getHoverColor() },
                  "&:active": { backgroundColor: getClickColor() },
                }}
                component={Link}
                to="/admin/updatePlane"
              >
                <ListItemIcon>
                  <AirplanemodeInactiveOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Update Plane Status" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Country */}
          <ListItemButton
            onMouseEnter={() => setOpenList("country")}
            onClick={() => handleClickList("country")}
            sx={{
              "&:hover": { backgroundColor: getHoverColor() },
              "&:active": { backgroundColor: getClickColor() },
            }}
          >
            <ListItemIcon>
              <PublicIcon />
            </ListItemIcon>
            <ListItemText primary="Country" />
            {openList === "country" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openList === "country"} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: getHoverColor() },
                  "&:active": { backgroundColor: getClickColor() },
                }}
                component={Link}
                to="/admin/updateCountry"
              >
                <ListItemIcon>
                  <PublicIcon />
                </ListItemIcon>

                <ListItemText primary="Manage Country" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Airport */}
          <ListItemButton
            onMouseEnter={() => setOpenList("airport")}
            onClick={() => handleClickList("airport")}
            sx={{
              "&:hover": { backgroundColor: getHoverColor() },
              "&:active": { backgroundColor: getClickColor() },
            }}
          >
            <ListItemIcon>
              <ConnectingAirportsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Airport" />
            {openList === "airport" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openList === "airport"} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: getHoverColor() },
                  "&:active": { backgroundColor: getClickColor() },
                }}
                component={Link}
                to="/admin/createAirport"
              >
                <ListItemIcon>
                  <ConnectingAirportsOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Create Airport" />
              </ListItemButton>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: getHoverColor() },
                  "&:active": { backgroundColor: getClickColor() },
                }}
                component={Link}
                to="/admin/updateAirport"
              >
                <ListItemIcon>
                  <ConnectingAirportsOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Airport" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Price */}
          <ListItemButton
            onMouseEnter={() => setOpenList("bundle")}
            onClick={() => handleClickList("bundle")}
            sx={{
              "&:hover": { backgroundColor: getHoverColor() },
              "&:active": { backgroundColor: getClickColor() },
            }}
          >
            <ListItemIcon>
              <AttachMoneyIcon />
            </ListItemIcon>
            <ListItemText primary="Bundle" />
            {openList === "bundle" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openList === "bundle"} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: getHoverColor() },
                  "&:active": { backgroundColor: getClickColor() },
                }}
                component={Link}
                to="/admin/createBundle"
              >
                <ListItemIcon>
                  <AttachMoneyIcon />
                </ListItemIcon>
                <ListItemText primary="Create Bundle" />
              </ListItemButton>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: getHoverColor() },
                  "&:active": { backgroundColor: getClickColor() },
                }}
                component={Link}
                to="/admin/updateBundle"
              >
                <ListItemIcon>
                  <MoneyOffOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Bundle" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Baggages */}
          <ListItemButton
            onMouseEnter={() => setOpenList("baggage")}
            onClick={() => handleClickList("baggage")}
            sx={{
              "&:hover": { backgroundColor: getHoverColor() },
              "&:active": { backgroundColor: getClickColor() },
            }}
          >
            <ListItemIcon>
              <LuggageOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Baggage" />
            {openList === "baggage" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openList === "baggage"} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: getHoverColor() },
                  "&:active": { backgroundColor: getClickColor() },
                }}
                component={Link}
                to="/admin/createBaggage"
              >
                <ListItemIcon>
                  <LuggageOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Create Baggage" />
              </ListItemButton>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: getHoverColor() },
                  "&:active": { backgroundColor: getClickColor() },
                }}
                component={Link}
                to="/admin/updateBaggage"
              >
                <ListItemIcon>
                  <LuggageOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Baggage" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Meals */}
          <ListItemButton
            onMouseEnter={() => setOpenList("meal")}
            onClick={() => handleClickList("meal")}
            sx={{
              "&:hover": { backgroundColor: getHoverColor() },
              "&:active": { backgroundColor: getClickColor() },
            }}
          >
            <ListItemIcon>
              <FastfoodOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Meal" />
            {openList === "meal" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openList === "meal"} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: getHoverColor() },
                  "&:active": { backgroundColor: getClickColor() },
                }}
                component={Link}
                to="/admin/createMeal"
              >
                <ListItemIcon>
                  <LocalDiningOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Create Meals" />
              </ListItemButton>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: getHoverColor() },
                  "&:active": { backgroundColor: getClickColor() },
                }}
                component={Link}
                to="/admin/updateMeal"
              >
                <ListItemIcon>
                  <LocalDiningOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Meals" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Transport */}
          <ListItemButton
            onMouseEnter={() => setOpenList("transport")}
            onClick={() => handleClickList("transport")}
            sx={{
              "&:hover": { backgroundColor: getHoverColor() },
              "&:active": { backgroundColor: getClickColor() },
            }}
          >
            <ListItemIcon>
              <DirectionsCarIcon />
            </ListItemIcon>
            <ListItemText primary="Transport" />
            {openList === "transport" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openList === "transport"} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: getHoverColor() },
                  "&:active": { backgroundColor: getClickColor() },
                }}
                component={Link}
                to="/admin/craeteTransport"
              >
                <ListItemIcon>
                  <DirectionsCarIcon />
                </ListItemIcon>
                <ListItemText primary="Create Transport" />
              </ListItemButton>
              <ListItemButton
                sx={{
                  pl: 4,
                  "&:hover": { backgroundColor: getHoverColor() },
                  "&:active": { backgroundColor: getClickColor() },
                }}
                component={Link}
                to="/admin/updateTransport"
              >
                <ListItemIcon>
                  <DirectionsCarIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Transport" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
        <Divider />
      </Drawer>
    </Box>
  );
};

export default Sidebar;
