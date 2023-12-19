import styled from "@emotion/styled";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FlightOutlinedIcon from "@mui/icons-material/FlightOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import {
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Stack,
  useTheme,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { getAirportNameList, getAirports } from "../../../api";
import { CustomFlightPathIcon } from "./icon";

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "20px",
  height: "40px",
  width: "100px",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const FlightList = ({ flightData, searchFlight, selectedflight }) => {
  const [airportNameData, setAirportNameData] = useState([]);
  const [airportData, setAirportData] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleDetailsClick = (id) => {
    setDetailsOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  dayjs.extend(customParseFormat);

  let formatTimeToHoursMinutes = (timeString) => {
    let time = dayjs(timeString, "HH:mm:ss");
    let hours = time.format("HH");
    let minutes = time.format("mm");

    return `${hours} hrs ${minutes} mins`;
  };

  const fetchAirportDataName = async () => {
    const airportDataName = await getAirportNameList();
    setAirportNameData(airportDataName);
  };

  const fetchAirportData = async () => {
    const airportData = await getAirports();
    setAirportData(airportData);
  };

  useEffect(() => {
    fetchAirportData();
    fetchAirportDataName();
  }, []);

  const handleSelectClick = (id) => {
    if (location.pathname === "/SelectDepartureFlight") {
      handleSelectClickDeparture(id);
    } else {
      handleSelectClickReturn(id);
    }
  };

  const handleSelectClickDeparture = (id) => {
    const departureFlightData = {
      id: id,
      class: searchFlight.flightClass,
    };

    sessionStorage.setItem(
      "departureFlight",
      JSON.stringify(departureFlightData)
    );

    const departureFlight = JSON.parse(
      sessionStorage.getItem("departureFlight")
    );
    if (departureFlight && departureFlight.bundleId) {
      delete departureFlight.bundleId;
      sessionStorage.setItem(
        "departureFlight",
        JSON.stringify(departureFlight)
      );
    }

    if (searchFlight.tripType === "roundtrip") {
      navigate("/SelectReturnFlight");
    } else {
      navigate("/SelectBundle");
    }
  };

  const handleSelectClickReturn = (id) => {
    const returnFlightData = {
      id: id,
      class: searchFlight.flightClass,
    };
    sessionStorage.setItem("returnFlight", JSON.stringify(returnFlightData));

    const departureFlight = JSON.parse(
      sessionStorage.getItem("departureFlight")
    );
    if (departureFlight && departureFlight.bundleId) {
      delete departureFlight.bundleId;
      sessionStorage.setItem(
        "departureFlight",
        JSON.stringify(departureFlight)
      );
    }

    const returnFlight = JSON.parse(sessionStorage.getItem("returnFlight"));
    if (returnFlight && returnFlight.bundleId) {
      delete returnFlight.bundleId;
      sessionStorage.setItem("returnFlight", JSON.stringify(returnFlight));
    }

    navigate("/SelectBundle");
  };

  if (!flightData || flightData.length === 0)
    return (
      <Typography variant="h4" sx={{ mt: 5 }}>
        No flights found
      </Typography>
    );
  return (
    <Stack>
      <>
        {flightData.map((data) => {
          const departureAirportName = airportNameData.find(
            (airport) => airport.code === data.departure_airport
          );

          const arrivalAirportName = airportNameData.find(
            (airport) => airport.code === data.arrival_airport
          );

          const arrivalAirportMunicipal = airportData.find(
            (airport) => airport.code === data.arrival_airport
          );

          const departureAirportMunicipal = airportData.find(
            (airport) => airport.code === data.departure_airport
          );

          let price;

          if (searchFlight.flightClass === "Economy") {
            price = data.economy_price;
          } else {
            price = data.business_price;
          }
          return (
            <>
              <Paper
                sx={{ p: 2, mt: 2, width: 1300 }}
                elevation={0}
                variant="outlined"
                display="flex"
              >
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Chip
                      label={searchFlight.flightClass}
                      variant="outlined"
                      sx={{
                        color: theme.palette.primary.main,
                        borderColor: theme.palette.primary.main,
                        fontSize: "15px",
                        width: "100px",
                        height: "30px",
                        borderRadius: "13px",
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={2} sx={{ mt: 3, textAlign: "center" }}>
                    <Typography variant="h5">
                      {dayjs(data.departure_time).format("DD MMM YYYY")}
                    </Typography>
                    <Typography variant="h2">
                      {dayjs(data.departure_time).format("HH:mm")}
                    </Typography>
                    <Typography variant="h4">
                      {data.departure_airport}
                    </Typography>
                    <Typography variant="h8" sx={{ color: "grey" }}>
                      {departureAirportName && departureAirportName.name}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{
                      mt: 3,
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h8" sx={{ ml: 2, color: "grey" }}>
                      {formatTimeToHoursMinutes(data.duration_time)}
                    </Typography>
                    <CustomFlightPathIcon style={{ fontSize: 50 }} />
                    <Typography
                      variant="h8"
                      sx={{ ml: 2, mb: 5, color: "grey" }}
                    >
                      Non-Stop
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ ml: 5, mt: 3, textAlign: "center" }}>
                    <Typography variant="h5">
                      {dayjs(data.arrival_time).format("DD MMM YYYY")}
                    </Typography>
                    <Typography variant="h2">
                      {dayjs(data.arrival_time).format("HH:mm")}
                    </Typography>
                    <Typography variant="h4">{data.arrival_airport}</Typography>
                    <Typography variant="h8" sx={{ color: "grey" }}>
                      {arrivalAirportName && arrivalAirportName.name}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      mt: 3,
                      ml: 6,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h5">from</Typography>
                    <Typography variant="h2">MYR {price}</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 3,
                    }}
                  >
                    <StyledButton
                      type="submit"
                      variant="outlined"
                      onClick={() => handleSelectClick(data.id)}
                    >
                      Select
                    </StyledButton>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={7} sx={{ mt: 2 }}>
                    <Divider />
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDetailsClick(data.id)}
                >
                  <Typography variant="h7" sx={{ mt: 1.2, cursor: "pointer" }}>
                    View details
                  </Typography>
                  <IconButton>
                    {detailsOpen[data.id] ? (
                      <ExpandLessOutlinedIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </Box>
                <Collapse in={detailsOpen[data.id]}>
                  <Paper
                    sx={{ p: 2, mt: 1, width: 1200 }}
                    elevation={0}
                    display="flex"
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={2}>
                        <Typography variant="h5">
                          Departure:{" "}
                          {dayjs(data.departure_time).format("DD MMM YYYY")}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={1} sx={{ mt: 2, textAlign: "center" }}>
                        <Typography variant="h3" sx={{ mt: 2 }}>
                          {dayjs(data.departure_time).format("HH:mm")}
                        </Typography>
                        <Typography variant="h6" sx={{ color: "grey" }}>
                          {dayjs(data.departure_time).format("DD MMM")}
                        </Typography>

                        <Typography variant="h6" sx={{ color: "grey", mt: 5 }}>
                          {formatTimeToHoursMinutes(data.duration_time)}
                        </Typography>
                        <Typography variant="h3" sx={{ mt: 5 }}>
                          {dayjs(data.arrival_time).format("HH:mm")}
                        </Typography>
                        <Typography variant="h6" sx={{ color: "grey" }}>
                          {dayjs(data.arrival_time).format("DD MMM")}
                        </Typography>
                      </Grid>
                      <Grid item xs={1} sx={{ mr: 1, mt: 2 }}>
                        <FlightOutlinedIcon sx={{ ml: 2, mt: 3 }} />

                        <Box
                          sx={{
                            ml: 3.3,
                            height: "100px",
                            width: "1px",
                            bgcolor: "white",
                            my: "10px",
                          }}
                        />
                        <LocationOnOutlinedIcon sx={{ ml: 2 }} />
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        sx={{ mt: 2, textAlign: "left", pl: 1 }}
                      >
                        <Typography variant="h3" sx={{ mt: 2 }}>
                          {departureAirportMunicipal &&
                            departureAirportMunicipal.name}
                        </Typography>
                        <Typography variant="h5" sx={{ color: "grey" }}>
                          {departureAirportName && departureAirportName.name}
                        </Typography>
                        <Card sx={{ p: 1, mt: 4 }}>
                          <Typography variant="h5" sx={{ color: "grey" }}>
                            Flight: SkyWings {data.airplane_name}
                          </Typography>
                        </Card>
                        <Typography variant="h3" sx={{ mt: 4 }}>
                          {arrivalAirportMunicipal &&
                            arrivalAirportMunicipal.name}
                        </Typography>
                        <Typography variant="h5" sx={{ color: "grey" }}>
                          {departureAirportName && departureAirportName.name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Collapse>
              </Paper>
            </>
          );
        })}
      </>
    </Stack>
  );
};

export default FlightList;
