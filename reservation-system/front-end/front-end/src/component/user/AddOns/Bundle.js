import AirlineSeatReclineExtraOutlinedIcon from "@mui/icons-material/AirlineSeatReclineExtraOutlined";
import AirplaneTicketOutlinedIcon from "@mui/icons-material/AirplaneTicketOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import LocalBarOutlinedIcon from "@mui/icons-material/LocalBarOutlined";
import LocalDiningOutlinedIcon from "@mui/icons-material/LocalDiningOutlined";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import {
  Box,
  Card,
  Checkbox,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getBundlesByClass, getFlightById } from "../../api";

const BundleList = ({ flight, handleBundleSelected }) => {
  const [bundleData, setBundleData] = useState(null);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [flightData, setFlightData] = useState(null);

  const fectchBundleList = async (flightClass) => {
    const bundledata = await getBundlesByClass(flightClass);
    setBundleData(bundledata);
  };

  const fetchFlightData = async (id) => {
    const flightData = await getFlightById(id);
    setFlightData(flightData);
  };

  useEffect(() => {
    if (flight) {
      fectchBundleList(flight.class);
      fetchFlightData(flight.id);
    }
  }, [flight]);

  const handleCheckboxChange = (id) => {
    if (selectedBundle === null || selectedBundle !== id) {
      setSelectedBundle(id);
      sessionStorage.setItem("BundleId", id);
    }
    handleBundleSelected(true);
  };

  if (!bundleData || bundleData.length === 0)
    return (
      <Typography variant="h4" sx={{ mt: 5 }}>
        No bundles found
      </Typography>
    );

  return (
    <Stack direction="row" spacing={2}>
      <>
        {bundleData.map((data) => {
          let price;

          if (flightData && flightData.flight_type === 1) {
            price = data.internationalPrice;
          } else {
            price = data.domesticPrice;
          }

          let baggageKg;

          if (data.checkinBaggage20 === 1) {
            baggageKg = 20;
          } else if (data.checkinBaggage30 === 1) {
            baggageKg = 30;
          } else if (data.checkinBaggage40 === 1) {
            baggageKg = 40;
          } else {
            baggageKg = 0;
          }

          return (
            <>
              <Paper
                elevation={0}
                onClick={() => handleCheckboxChange(data.id)}
                sx={{
                  width: 350,
                  height: 480,
                  borderRadius: "20px",
                  p: 2,
                  cursor: "pointer",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Checkbox
                    icon={
                      <CheckCircleOutlineIcon
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          m: "auto",
                        }}
                      />
                    }
                    checkedIcon={
                      <CheckCircleIcon
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          m: "auto",
                        }}
                      />
                    }
                    checked={selectedBundle === data.id}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => handleCheckboxChange(data.id)}
                  />
                </Box>

                <Grid container spacing={1}>
                  <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Typography variant="h3">+ MYR {price}</Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Typography variant="h3">{data.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ justifyContent: "center" }}>
                    <Card
                      sx={{
                        width: 320,
                        height: 300,
                        backgroundColor: "transparent",
                        borderRadius: "20px",
                        mt: 2,
                        mr: 2,
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        sx={{ justifyContent: "center", p: 2 }}
                      >
                        <Stack sx={{ display: "flex", flexDirection: "row" }}>
                          <WorkOutlineOutlinedIcon sx={{ fontSize: "25px" }} />
                          <Typography
                            variant="h5"
                            sx={{
                              ml: 2,
                              color:
                                data.cabinBaggage === 0 ? "grey" : "inherit",
                            }}
                          >
                            {" "}
                            7 kg Cabin Baggage
                          </Typography>
                        </Stack>
                        <Stack
                          sx={{ display: "flex", flexDirection: "row", mt: 2 }}
                        >
                          <LuggageOutlinedIcon sx={{ fontSize: "25px" }} />
                          <Typography
                            variant="h5"
                            sx={{
                              ml: 2,
                              color: baggageKg === 0 ? "grey" : "inherit",
                            }}
                          >
                            {" "}
                            {baggageKg} kg Check-in Baggage
                          </Typography>
                        </Stack>
                        <Stack
                          sx={{ display: "flex", flexDirection: "row", mt: 2 }}
                        >
                          <LocalDiningOutlinedIcon sx={{ fontSize: "25px" }} />
                          <Typography
                            variant="h5"
                            sx={{
                              ml: 2,
                              color: data.freeMeal === 0 ? "grey" : "inherit",
                            }}
                          >
                            {" "}
                            1 Meal
                          </Typography>
                        </Stack>
                        <Stack
                          sx={{ display: "flex", flexDirection: "row", mt: 2 }}
                        >
                          <AirlineSeatReclineExtraOutlinedIcon
                            sx={{ fontSize: "25px" }}
                          />
                          <Typography variant="h5" sx={{ ml: 2 }}>
                            {" "}
                            Free Seat Selection
                          </Typography>
                        </Stack>
                        <Stack
                          sx={{ display: "flex", flexDirection: "row", mt: 2 }}
                        >
                          <FactCheckOutlinedIcon sx={{ fontSize: "25px" }} />
                          <Typography
                            variant="h5"
                            sx={{
                              ml: 2,
                              color:
                                data.prioCheckIn === 0 ? "grey" : "inherit",
                            }}
                          >
                            {" "}
                            Prio Check-In
                          </Typography>
                        </Stack>
                        <Stack
                          sx={{ display: "flex", flexDirection: "row", mt: 2 }}
                        >
                          <AirplaneTicketOutlinedIcon
                            sx={{ fontSize: "25px" }}
                          />
                          <Typography
                            variant="h5"
                            sx={{
                              ml: 2,
                              color:
                                data.prioBoarding === 0 ? "grey" : "inherit",
                            }}
                          >
                            {" "}
                            Prio Boarding
                          </Typography>
                        </Stack>
                        <Stack
                          sx={{ display: "flex", flexDirection: "row", mt: 2 }}
                        >
                          <LocalBarOutlinedIcon sx={{ fontSize: "25px" }} />
                          <Typography
                            variant="h5"
                            sx={{
                              ml: 2,
                              color:
                                data.loungeAccess === 0 ? "grey" : "inherit",
                            }}
                          >
                            {" "}
                            Lounge Access
                          </Typography>
                        </Stack>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </>
          );
        })}
      </>
    </Stack>
  );
};

export default BundleList;
