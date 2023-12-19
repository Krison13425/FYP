import { Avatar, Box, Paper, SvgIcon, Typography } from "@mui/material";
import React from "react";
import CountUp from "react-countup";

const CountedPaper = ({ label, value, Icon, color }) => {
  return (
    <Paper elevation={8} sx={{ borderRadius: "15px" }}>
      <Box
        p={2}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
      >
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{
              backgroundColor: color,
            }}
          >
            <SvgIcon>
              <Icon />
            </SvgIcon>
          </Avatar>
          <Typography variant="h4" sx={{ ml: 2 }}>
            {label}
          </Typography>
        </Box>

        <Typography variant="h1" alignSelf="center">
          <CountUp end={value} duration={3} />
        </Typography>
        <Box sx={{ height: "36px" }} />
      </Box>
    </Paper>
  );
};

export default CountedPaper;
