import FlightLandIcon from "@mui/icons-material/FlightLand";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import React from "react";

const SelectedSeatDetails = ({
  selectedSeat,
  originalFlightSearch,
  handleShowSeat,
  flightType,
}) => {
  const handleChangeClick = async (e) => {
    sessionStorage.removeItem("selectedSeat");
    handleShowSeat();
  };

  if (!selectedSeat || !originalFlightSearch) {
    return null;
  }

  return (
    <Box>
      <Paper
        sx={{ p: 2, mt: 2, width: 1100, borderRadius: "20px" }}
        elevation={0}
        variant="outlined"
        display="flex"
      >
        <Grid container spacing={1}>
          <Grid item xs={3} sx={{ textAlign: "center", mt: 1 }}>
            {flightType === "departure" ? (
              <Typography variant="h3">
                <FlightTakeoffIcon /> Departure Seat
              </Typography>
            ) : (
              <Typography variant="h3">
                <FlightLandIcon /> Return Seat
              </Typography>
            )}
          </Grid>
          <Grid item xs={3} sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="h3"> Seat {selectedSeat}</Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
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

export default SelectedSeatDetails;
