import FlightIcon from "@mui/icons-material/Flight";
import { Box, SvgIcon } from "@mui/material";
import React from "react";

export function CustomFlightPathIcon(props) {
  return (
    <SvgIcon
      {...props}
      viewBox="50 -5 200 34"
      sx={{ width: 500, color: "grey" }}
    >
      <circle cx="5" cy="10" r="2" fill="currentColor" />
      <path
        d="M5 10 l100 0"
        stroke="currentColor"
        fill="none"
        strokeDasharray="2"
      />

      <Box
        component="span"
        position="absolute"
        left={17}
        top={10}
        transform={`rotate(-45deg)`}
      >
        <FlightIcon fontSize="inherit" />
      </Box>
      <circle cx="105" cy="10" r="2" fill="currentColor" />
    </SvgIcon>
  );
}
