import FlightLandIcon from "@mui/icons-material/FlightLand";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getFlightById } from "../../api";

const SelectedBundleDetails = ({
  selectedBundle,
  originalFlightSearch,
  handleShowBundles,
  flight,
  flightType,
}) => {
  const [flightData, setFlightData] = useState(null);

  const fetchFlightData = async (id) => {
    const flightData = await getFlightById(id);
    setFlightData(flightData);
  };

  useEffect(() => {
    if (selectedBundle && originalFlightSearch && flight) {
      fetchFlightData(flight.id);
    }
  }, []);

  let price;

  if (flightData !== null && flightData.flight_type === 1) {
    price = selectedBundle.internationalPrice;
  } else {
    price = selectedBundle.domesticPrice;
  }

  const handleChangeClick = async (e) => {
    console.log("change button");
    e.preventDefault();
    sessionStorage.removeItem("BundleId");
    handleShowBundles();
  };

  if (!selectedBundle || !originalFlightSearch) {
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
        <Grid container spacing={1} sx={{ p: 1 }}>
          <Grid item xs={3} sx={{ textAlign: "center", mt: 1 }}>
            {flightType === "departure" ? (
              <Typography variant="h3">
                <FlightTakeoffIcon /> Departure
              </Typography>
            ) : (
              <Typography variant="h3">
                <FlightLandIcon /> Return
              </Typography>
            )}
          </Grid>
          <Grid item xs={3} sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="h3">{selectedBundle.name}</Typography>
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

export default SelectedBundleDetails;
