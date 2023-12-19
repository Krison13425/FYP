import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

const MenuDrawer = ({ state, toggleDrawer, MenuItems }) => {
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {MenuItems.map((item) => (
          <ListItem key={item.Name} disablePadding>
            <ListItemButton
              sx={{
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
              }}
            >
              <ListItemText primary={item.Name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      anchor={"left"}
      open={state["left"]}
      onClose={toggleDrawer("left", false)}
    >
      {list("left")}
    </Drawer>
  );
};

export default MenuDrawer;
