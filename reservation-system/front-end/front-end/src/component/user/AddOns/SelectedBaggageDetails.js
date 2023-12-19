import FlightLandIcon from "@mui/icons-material/FlightLand";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getFlightById } from "../../api";

const SelectedBaggageDetails = ({
  selectedBaggage,
  originalFlightSearch,
  handleShowBaggage,
  flight,
  flightType,
}) => {
  const [flightData, setFlightData] = useState(null);

  const fetchFlightData = async (id) => {
    const flightData = await getFlightById(id);
    setFlightData(flightData);
  };

  useEffect(() => {
    if (selectedBaggage && originalFlightSearch) {
      if (flight) {
        fetchFlightData(flight.id);
      }
    }
  }, []);

  let price;

  if (flightData !== null && flightData.flight_type === 1) {
    price = selectedBaggage.internationalPrice;
  } else {
    price = selectedBaggage.domesticPrice;
  }

  const handleChangeClick = async (e) => {
    e.preventDefault();
    sessionStorage.removeItem("BaggageId");
    handleShowBaggage();
  };

  if (!selectedBaggage || !originalFlightSearch) {
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
                <FlightTakeoffIcon /> Departure Baggage
              </Typography>
            ) : (
              <Typography variant="h3">
                <FlightLandIcon /> Return Baggage
              </Typography>
            )}
          </Grid>
          <Grid item xs={3} sx={{ textAlign: "center", mt: 1 }}>
            {selectedBaggage.kg === 0 ? (
              <Typography variant="h3">No baggage added</Typography>
            ) : (
              <Typography variant="h3">BG {selectedBaggage.kg}</Typography>
            )}
          </Grid>
          <Grid item xs={3} sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="h3">MYR {price}</Typography>
          </Grid>
          <Grid
            item
            xs={3}
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

export default SelectedBaggageDetails;
