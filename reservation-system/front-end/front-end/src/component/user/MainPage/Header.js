import { Box } from "@mui/material";
import React from "react";
import SearchFlight from "./SearchFlight";

const Header = () => {
  const backgroundImage = "/Background.png";

  return (
    <Box
      sx={{
        position: "relative",
        mt: 2,
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundColor: "#000915",
        backgroundPosition: "center",
        backgroundSize: "contain",
        height: 600,
        width: "100%",
      }}
    >
      <SearchFlight />
    </Box>
  );
};

export default Header;
