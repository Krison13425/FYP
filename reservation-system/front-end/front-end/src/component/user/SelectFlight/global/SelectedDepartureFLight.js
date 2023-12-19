import FlightIcon from "@mui/icons-material/Flight";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React from "react";
import { useNavigate } from "react-router-dom";

const DepartureFlightDetails = ({ selectedDepartureFlight }) => {
  const navigate = useNavigate();
  if (!selectedDepartureFlight) {
    return null;
  }

  const handleChangeClick = async (e) => {
    e.preventDefault();
    sessionStorage.removeItem("departureFlight");
    navigate("/SelectDepartureFlight");
  };

  dayjs.extend(customParseFormat);

  let formatTimeToHoursMinutes = (timeString) => {
    let time = dayjs(timeString, "HH:mm:ss");
    let hours = time.format("HH");
    let minutes = time.format("mm");

    return `${hours} hrs ${minutes} mins`;
  };

  return (
    <Box>
      <Paper
        sx={{ p: 2, mt: 2, width: 1300 }}
        elevation={0}
        variant="outlined"
        display="flex"
      >
        <Grid container spacing={1}>
          <Grid item xs={2} sx={{ textAlign: "center" }}>
            <Typography variant="h5">
              {dayjs(selectedDepartureFlight.departure_time).format(
                "DD MMM YYYY HH:mm"
              )}
            </Typography>
            <Typography variant="h3">
              {selectedDepartureFlight.departure_airport}
            </Typography>
          </Grid>
          <Grid item xs={1} sx={{ mt: 2, textAlign: "center" }}>
            <FlightIcon sx={{ transform: "rotate(90deg)" }} />
          </Grid>
          <Grid item xs={2} sx={{ textAlign: "center" }}>
            <Typography variant="h5">
              {dayjs(selectedDepartureFlight.arrival_time).format(
                "DD MMM YYYY HH:mm"
              )}
            </Typography>
            <Typography variant="h3">
              {selectedDepartureFlight.arrival_airport}
            </Typography>
          </Grid>
          <Grid item xs={3} sx={{ mt: 1, ml: 5, textAlign: "center" }}>
            <Stack>
              <Typography variant="h7">
                {formatTimeToHoursMinutes(
                  selectedDepartureFlight.duration_time
                )}
              </Typography>
              <Typography variant="h8" sx={{ color: "grey" }}>
                Non-Stop
              </Typography>
            </Stack>
          </Grid>
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 1,
              ml: 8,
            }}
          >
            <Button
              type="submit"
              variant="outlined"
              sx={{
                borderRadius: "20px",
                height: "40px",
                backgroundColor: "primary.dark",
                display: "flex",
                justifyContent: "flex-end",
              }}
              size="large"
              onClick={handleChangeClick}
            >
              Change
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default DepartureFlightDetails;
