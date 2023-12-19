import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import NavBar from "../global/Navbar";
import {
  getAirportNameList,
  getAllSeats,
  getBookedSeats,
  getBookingById,
  getCountryList,
  getEmergencyContactById,
  getFlightById,
  getMealList,
  getPassengerByReferenceBookingId,
  getTransactionById,
  getTransportById,
} from "../../api";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import styled from "@emotion/styled";
import FlightRoundedIcon from "@mui/icons-material/FlightRounded";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import FlightTakeoffOutlinedIcon from "@mui/icons-material/FlightTakeoffOutlined";
import { ConnectingAirportsOutlined, OpenInFull } from "@mui/icons-material";
import customParseFormat from "dayjs/plugin/customParseFormat";
import FlightLandOutlinedIcon from "@mui/icons-material/FlightLandOutlined";

import dayjs from "dayjs";
import { useParams, useSearchParams } from "react-router-dom";

const ViewBookings = () => {
  const [referenceBookingId, setReferenceBookingId] = useState("");
  const [lastName, setLastName] = useState("");
  const [passengersData, setPassengersData] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  const [flightOpen, setFlightOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [passengerOpen, setPassengerOpen] = useState(false);
  const [transportOpen, setTransportOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [departflightData, setDepartureFlightData] = useState(null);
  const [returnflightData, setReturnFlightData] = useState(null);
  const [mealData, setMealData] = useState(null);
  const [seatData, setSeatData] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [emergencyData, setEmergencyData] = useState(null);
  const [transportData, setTransportData] = useState(null);
  const [airportNameData, setAirportNameData] = useState(null);
  const [transactionData, setTransactionData] = useState(null);

  const [snackbarSeverity, setsnackbarSeverity] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [searchParams] = useSearchParams();
  const userreferenceId = searchParams.get("referenceId");
  const userlastName = searchParams.get("lastName");

  useEffect(() => {
    if (userreferenceId && userlastName) {
      setReferenceBookingId(userreferenceId);
      setLastName(userlastName);
      fetchPassengersDetails(userreferenceId, userlastName);
    }
  }, [userreferenceId, userlastName]);

  const handleFLightClick = () => {
    setFlightOpen(!flightOpen);
  };

  const handlePassngerClick = () => {
    setPassengerOpen(!passengerOpen);
  };

  const handleContactClick = () => {
    setContactOpen(!contactOpen);
  };

  const handleTransportClick = () => {
    setTransportOpen(!transportOpen);
  };

  const handlePriceClick = () => {
    setPriceOpen(!priceOpen);
  };

  const handleCheckIn = async () => {
    await fetchPassengersDetails(referenceBookingId, lastName);
  };

  const handleDownloadClick = () => {
    window.location.href = `http://localhost:8080/api/pdf/${bookingData?.id}/itinerary`;
  };

  dayjs.extend(customParseFormat);

  let formatTimeToHoursMinutes = (timeString) => {
    let time = dayjs(timeString, "HH:mm:ss");
    let hours = time.format("HH");
    let minutes = time.format("mm");

    return `${hours} hrs ${minutes} mins`;
  };

  const fetchPassengersDetails = async (referenceBookingId, lastName) => {
    try {
      const passengers = await getPassengerByReferenceBookingId(
        referenceBookingId,
        lastName
      );
      setPassengersData(passengers);
    } catch (error) {
      console.error("Failed to fetch passengers details:", error);
      setSnackbarMessage(
        "No Booking Found Invalid Booking Refference Id and Last Name"
      );
      setsnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
      const booking = await getBookingById(bookingId);
      setBookingData(booking);
    } catch (error) {
      console.error("Failed to fetch booking details:", error);
    }
  };

  const fetchFlightData = async (id) => {
    const flightData = await getFlightById(id);
    return flightData;
  };

  const fetchAirportName = async () => {
    const airportName = await getAirportNameList();
    setAirportNameData(airportName);
  };

  const fetchTransportationIdData = async (id) => {
    const transportData = await getTransportById(id);
    return transportData;
  };

  const fetchEmergencyData = async (id) => {
    const emergencyData = await getEmergencyContactById(id);
    return emergencyData;
  };

  const fetchTrsanctionData = async (id) => {
    const transactionData = await getTransactionById(id);
    return transactionData;
  };

  const fetchMealData = async () => {
    const mealData = await getMealList();
    setMealData(mealData);
  };
  const fetchSeatData = async () => {
    const seatData = await getAllSeats();
    setSeatData(seatData);
  };

  const fectchCountryData = async () => {
    const countryData = await getCountryList();
    setCountryData(countryData);
  };

  useEffect(() => {
    if (bookingData?.departureFlightId) {
      fetchFlightData(bookingData?.departureFlightId).then((fligthData) => {
        setDepartureFlightData(fligthData);
      });
    }
    if (bookingData?.returnFlightId) {
      fetchFlightData(bookingData?.returnFlightId).then((fligthData) => {
        setReturnFlightData(fligthData);
      });
    }
    if (passengersData.length > 0) {
      const anyPassenger = passengersData[0];
      fetchEmergencyData(anyPassenger.emergencyId)
        .then((data) => {
          setEmergencyData(data);
        })
        .catch((error) => {
          console.error("Error fetching emergency data:", error);
        });
    }

    if (bookingData?.transportId) {
      fetchTransportationIdData(bookingData?.transportId).then(
        (transportData) => {
          setTransportData(transportData);
        }
      );
    }

    if (bookingData?.transactionId) {
      fetchTrsanctionData(bookingData?.transactionId).then(
        (transactionData) => {
          setTransactionData(transactionData);
        }
      );
    }

    fetchAirportName();
    fetchMealData();
    fetchSeatData();
    fectchCountryData();
  }, [bookingData, passengerOpen]);

  let depDepartureAirport = airportNameData?.find(
    (airport) => airport.code === departflightData?.departure_airport
  );

  if (passengersData.length > 0) {
    try {
      const bookingId = passengersData[0].bookingId;
      fetchBookingDetails(bookingId);
    } catch (error) {
      console.error("Failed to fetch passengers details:", error);
    }
  }

  function getPassengerCountByFlightId(flightId, passengersData) {
    return passengersData.filter(
      (passenger) => passenger?.flightId === flightId
    ).length;
  }

  return (
    <>
      <NavBar />

      {passengersData.length === 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 2,
            mb: 2,
            ml: 40,
            flexDirection: "row",
          }}
        >
          <TextField
            name="Booking Reference Code"
            sx={{
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
              mr: 2,
              width: "30%",
            }}
            label="Booking Reference Code"
            variant="outlined"
            required
            onChange={(e) => setReferenceBookingId(e.target.value)}
          />

          <TextField
            name="Last Name"
            sx={{
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
              width: "30%",
              ml: 2,
            }}
            label="Last Name"
            variant="outlined"
            required
            onChange={(e) => setLastName(e.target.value)}
          />

          <Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2, borderRadius: "15px", fontSize: "1rem" }}
              size="large"
              onClick={handleCheckIn}
            >
              Search Bookings
            </Button>
          </Box>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <Stack>
          {passengersData.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Paper
                elevation={0}
                sx={{
                  width: 1000,
                  display: "flex",
                  p: 3,
                  borderRadius: "30px",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <CheckCircleRoundedIcon
                  style={{ color: "green", fontSize: 50 }}
                />
                <Typography variant="h2" sx={{ mt: 1, mb: 1 }}>
                  Booking Confirmed
                </Typography>
                <MarkEmailReadRoundedIcon style={{ fontSize: 50 }} />
                <Typography variant="h5">
                  A confirmation email has been send to
                  <span style={{ fontWeight: "bold" }}>
                    {" "}
                    {bookingData?.email}
                  </span>
                </Typography>
                <Tooltip title="Download Itinerary">
                  <Button
                    variant="outlined"
                    startIcon={<DownloadRoundedIcon />}
                    onClick={handleDownloadClick}
                    sx={{ borderRadius: "15px", fontSize: "1rem", mt: 2 }}
                    size="large"
                  >
                    Download Itinerary
                  </Button>
                </Tooltip>
              </Paper>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {passengersData.length > 0 && (
              <>
                <Stack>
                  <Paper
                    elevation={0}
                    sx={{ mt: 2, p: 3, borderRadius: "25px", width: 1000 }}
                  >
                    <Grid container spacing={1}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          width: "100%",
                          cursor: "pointer",
                        }}
                        onClick={() => handleFLightClick()}
                      >
                        <Grid container sx={{ p: 1 }}>
                          <Grid item md={10}>
                            <Typography variant="h3">FLight Details</Typography>
                          </Grid>
                        </Grid>

                        <IconButton>
                          {flightOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                    </Grid>
                    <Collapse in={flightOpen}>
                      <Box sx={{ width: "100%", mt: 2 }}>
                        <Divider fullWidth />
                      </Box>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={3} sx={{ textAlign: "left" }}>
                          <Typography variant="h3">
                            <FlightTakeoffOutlinedIcon /> Departure Flight
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{ mt: 2, textAlign: "center" }}
                          >
                            {departflightData?.departure_airport}
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{ mt: 1, textAlign: "center" }}
                          >
                            {dayjs(departflightData?.departure_time).format(
                              "DD MMM YYYY"
                            )}
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{ mt: 1, textAlign: "center" }}
                          >
                            {dayjs(departflightData?.departure_time).format(
                              "HH:mm"
                            )}
                          </Typography>
                        </Grid>
                        <Grid item xs={1} sx={{ textAlign: "left" }}>
                          <Typography variant="h4" sx={{ mt: 1 }}>
                            <EastOutlinedIcon
                              sx={{ mt: 7, fontSize: "2rem" }}
                            />
                          </Typography>
                        </Grid>
                        <Grid item xs={3} sx={{ mt: 3 }}>
                          <Typography
                            variant="h4"
                            sx={{ mt: 2, textAlign: "center" }}
                          >
                            {departflightData?.arrival_airport}
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{ mt: 1, textAlign: "center" }}
                          >
                            {dayjs(departflightData?.arrival_time).format(
                              "DD MMM YYYY"
                            )}
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{ mt: 1, textAlign: "center" }}
                          >
                            {dayjs(departflightData?.arrival_time).format(
                              "HH:mm"
                            )}
                          </Typography>
                        </Grid>
                        <Grid item xs={3} sx={{ mt: 3 }}>
                          <Typography
                            variant="h4"
                            sx={{ mt: 4, textAlign: "center" }}
                          >
                            {formatTimeToHoursMinutes(
                              departflightData?.duration_time
                            )}
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{ mt: 1, textAlign: "center" }}
                          >
                            {departflightData?.airplane_name}
                          </Typography>
                        </Grid>
                        <Box sx={{ width: "100%", mt: 2 }}>
                          <Divider fullWidth />
                        </Box>
                      </Grid>
                      {returnflightData && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={3} sx={{ textAlign: "left" }}>
                            <Typography variant="h3">
                              <FlightTakeoffOutlinedIcon /> Return Flight
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{ mt: 2, textAlign: "center" }}
                            >
                              {returnflightData?.departure_airport}
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{ mt: 1, textAlign: "center" }}
                            >
                              {dayjs(returnflightData?.departure_time).format(
                                "DD MMM YYYY"
                              )}
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{ mt: 1, textAlign: "center" }}
                            >
                              {dayjs(returnflightData?.departure_time).format(
                                "HH:mm"
                              )}
                            </Typography>
                          </Grid>
                          <Grid item xs={1} sx={{ textAlign: "left" }}>
                            <Typography variant="h4" sx={{ mt: 1 }}>
                              <EastOutlinedIcon
                                sx={{ mt: 7, fontSize: "2rem" }}
                              />
                            </Typography>
                          </Grid>
                          <Grid item xs={3} sx={{ mt: 3 }}>
                            <Typography
                              variant="h4"
                              sx={{ mt: 2, textAlign: "center" }}
                            >
                              {returnflightData?.arrival_airport}
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{ mt: 1, textAlign: "center" }}
                            >
                              {dayjs(returnflightData?.arrival_time).format(
                                "DD MMM YYYY"
                              )}
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{ mt: 1, textAlign: "center" }}
                            >
                              {dayjs(returnflightData?.arrival_time).format(
                                "HH:mm"
                              )}
                            </Typography>
                          </Grid>
                          <Grid item xs={3} sx={{ mt: 3 }}>
                            <Typography
                              variant="h4"
                              sx={{ mt: 4, textAlign: "center" }}
                            >
                              {formatTimeToHoursMinutes(
                                returnflightData?.duration_time
                              )}
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{ mt: 1, textAlign: "center" }}
                            >
                              {returnflightData?.airplane_name}
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    </Collapse>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{ mt: 2, p: 3, borderRadius: "25px" }}
                  >
                    <Grid container spacing={1}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          width: "100%",
                          cursor: "pointer",
                        }}
                        onClick={() => handlePassngerClick()}
                      >
                        <Grid container sx={{ p: 1 }}>
                          <Grid item md={10}>
                            <Typography variant="h3">Guest Details</Typography>
                          </Grid>
                        </Grid>

                        <IconButton>
                          {passengerOpen ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Box>
                    </Grid>
                    <Collapse in={passengerOpen}>
                      <Box sx={{ width: "100%", mt: 2 }}>
                        <Divider fullWidth />
                      </Box>
                      <Typography variant="h3" sx={{ mt: 2 }}>
                        {departflightData?.airplane_name} (
                        {departflightData?.departure_airport} to{" "}
                        {departflightData?.arrival_airport})
                      </Typography>
                      <Box sx={{ width: "100%", mt: 2 }}>
                        <Divider fullWidth />
                      </Box>
                      {passengersData
                        .filter(
                          (passenger) =>
                            passenger?.flightId === departflightData?.id
                        )
                        .map((passenger, index) => {
                          let meal;
                          if (mealData && passenger?.mealId) {
                            meal = mealData?.find(
                              (meal) => meal.id === passenger?.mealId
                            );
                          }

                          let seat;
                          if (seatData && passenger.seatId) {
                            seat = seatData?.find(
                              (seat) => seat.id === passenger.seatId
                            );
                          }

                          let nationalityName;
                          if (countryData && passenger.nationality) {
                            let countryObject = countryData?.find(
                              (country) =>
                                country.code === passenger.nationality
                            );
                            nationalityName = countryObject
                              ? countryObject.name
                              : null;
                          }

                          return (
                            <>
                              <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={6} sx={{ textAlign: "left" }}>
                                  <Typography
                                    variant="h3"
                                    sx={{ textAlign: "left" }}
                                  >
                                    {passenger.selectedTitle}
                                    {". "}
                                    {passenger.firstName} {passenger.lastName}
                                  </Typography>
                                  <Typography
                                    variant="h4"
                                    sx={{ mt: 1, textAlign: "left" }}
                                  ></Typography>
                                  {passenger.type !== 2 && (
                                    <>
                                      <Typography
                                        variant="h4"
                                        sx={{ mt: 1, textAlign: "left" }}
                                      >
                                        {meal?.name}
                                      </Typography>

                                      <Typography
                                        variant="h4"
                                        sx={{ mt: 1, textAlign: "left" }}
                                      >
                                        Seat {seat?.seatRow}
                                        {seat?.seatLetter}
                                      </Typography>

                                      <Typography
                                        variant="h4"
                                        sx={{ mt: 1, textAlign: "left" }}
                                      >
                                        {passenger.baggage} KG Check Baggage
                                      </Typography>
                                    </>
                                  )}
                                </Grid>
                                <Grid item xs={6} sx={{ textAlign: "left" }}>
                                  <Typography
                                    variant="h4"
                                    sx={{
                                      textAlign: "left",
                                      mt: 3,
                                      color: "grey",
                                    }}
                                  >
                                    Nationality
                                  </Typography>
                                  <Typography
                                    variant="h4"
                                    sx={{ mt: 1, textAlign: "left" }}
                                  >
                                    {nationalityName}
                                  </Typography>
                                  <Typography
                                    variant="h4"
                                    sx={{
                                      mt: 1,
                                      textAlign: "left",
                                      color: "grey",
                                    }}
                                  >
                                    BirthDate
                                  </Typography>
                                  <Typography
                                    variant="h4"
                                    sx={{ mt: 1, textAlign: "left" }}
                                  >
                                    {dayjs(passenger?.birthDate).format(
                                      "DD MMM YYYY"
                                    )}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </>
                          );
                        })}

                      {returnflightData && (
                        <>
                          <Box sx={{ width: "100%", mt: 2 }}>
                            <Divider fullWidth />
                          </Box>
                          <Typography variant="h3" sx={{ mt: 2 }}>
                            {returnflightData?.airplane_name} (
                            {returnflightData?.departure_airport} to{" "}
                            {returnflightData?.arrival_airport})
                          </Typography>
                          <Box sx={{ width: "100%", mt: 2 }}>
                            <Divider fullWidth />
                          </Box>
                          {passengersData
                            .filter(
                              (passenger) =>
                                passenger?.flightId === returnflightData?.id
                            )
                            .map((passenger, index) => {
                              let meal;
                              if (mealData && passenger?.mealId) {
                                meal = mealData?.find(
                                  (meal) => meal.id === passenger?.mealId
                                );
                              }

                              let seat;
                              if (seatData && passenger.seatId) {
                                seat = seatData?.find(
                                  (seat) => seat.id === passenger.seatId
                                );
                              }

                              let nationalityName;
                              if (countryData && passenger.nationality) {
                                let countryObject = countryData?.find(
                                  (country) =>
                                    country.code === passenger.nationality
                                );
                                nationalityName = countryObject
                                  ? countryObject.name
                                  : null;
                              }

                              return (
                                <>
                                  <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid
                                      item
                                      xs={6}
                                      sx={{ textAlign: "left" }}
                                    >
                                      <Typography
                                        variant="h3"
                                        sx={{ textAlign: "left" }}
                                      >
                                        {passenger.selectedTitle}
                                        {". "}
                                        {passenger.firstName}{" "}
                                        {passenger.lastName}
                                      </Typography>

                                      {passenger.type !== 2 && (
                                        <>
                                          <Typography
                                            variant="h4"
                                            sx={{ mt: 1, textAlign: "left" }}
                                          >
                                            {meal?.name}
                                          </Typography>
                                          <Typography
                                            variant="h4"
                                            sx={{ mt: 1, textAlign: "left" }}
                                          >
                                            Seat {seat?.seatRow}
                                            {seat?.seatLetter}
                                          </Typography>
                                          <Typography
                                            variant="h4"
                                            sx={{ mt: 1, textAlign: "left" }}
                                          >
                                            {passenger.baggage} KG Check Baggage
                                          </Typography>
                                        </>
                                      )}
                                    </Grid>
                                    <Grid
                                      item
                                      xs={6}
                                      sx={{ textAlign: "left" }}
                                    >
                                      <Typography
                                        variant="h4"
                                        sx={{
                                          textAlign: "left",
                                          mt: 4,
                                          color: "grey",
                                        }}
                                      >
                                        Nationality
                                      </Typography>
                                      <Typography
                                        variant="h4"
                                        sx={{ mt: 1, textAlign: "left" }}
                                      >
                                        {nationalityName}
                                      </Typography>
                                      <Typography
                                        variant="h4"
                                        sx={{
                                          mt: 1,
                                          textAlign: "left",
                                          color: "grey",
                                        }}
                                      >
                                        BirthDate
                                      </Typography>
                                      <Typography
                                        variant="h4"
                                        sx={{ mt: 1, textAlign: "left" }}
                                      >
                                        {dayjs(passenger?.birthDate).format(
                                          "DD MMM YYYY"
                                        )}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </>
                              );
                            })}
                        </>
                      )}
                    </Collapse>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{ mt: 2, p: 3, borderRadius: "25px" }}
                  >
                    <Grid container spacing={1}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          width: "100%",
                          cursor: "pointer",
                        }}
                        onClick={() => handleContactClick()}
                      >
                        <Grid container sx={{ p: 1 }}>
                          <Grid item md={10}>
                            <Typography variant="h3">
                              Contact Details
                            </Typography>
                          </Grid>
                        </Grid>

                        <IconButton>
                          {contactOpen ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Box>
                    </Grid>
                    <Collapse in={contactOpen}>
                      <Box sx={{ width: "100%", mt: 2 }}>
                        <Divider fullWidth />
                      </Box>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6} sx={{ textAlign: "left" }}>
                          <Typography variant="h3">Contacter Name</Typography>
                          <Typography
                            variant="h4"
                            sx={{ mt: 1, textAlign: "left" }}
                          >
                            {bookingData?.title} . {bookingData?.firstName}{" "}
                            {bookingData?.lastName}
                          </Typography>
                          <Typography
                            variant="h3"
                            sx={{ mt: 3, textAlign: "left" }}
                          >
                            Email
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{ mt: 1, textAlign: "left" }}
                          >
                            {bookingData?.email}
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{ mt: 3, textAlign: "left" }}
                          >
                            PhoneNumber
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{ mt: 1, textAlign: "left" }}
                          >
                            +{bookingData?.phoneCode}
                            {bookingData?.phoneNumber}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: "left" }}>
                          <Typography variant="h3">
                            Emergency Contact
                          </Typography>
                          <Typography
                            variant="h3"
                            sx={{ color: "grey", mt: 1 }}
                          >
                            Contacter Name
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{ mt: 1, textAlign: "left" }}
                          >
                            {emergencyData?.emergencyName}
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{ color: "grey", mt: 1, textAlign: "left" }}
                          >
                            PhoneNumber
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{ mt: 1, textAlign: "left" }}
                          >
                            +{emergencyData?.emergencyPhoneCode}
                            {emergencyData?.emergencyPhoneNumber}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Collapse>
                  </Paper>

                  {bookingData?.transportId && (
                    <Paper
                      elevation={0}
                      sx={{ mt: 2, p: 3, borderRadius: "25px" }}
                    >
                      <Grid container spacing={1}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%",
                            cursor: "pointer",
                          }}
                          onClick={() => handleTransportClick()}
                        >
                          <Grid container sx={{ p: 1 }}>
                            <Grid item md={10}>
                              <Typography variant="h3">
                                Transport Details
                              </Typography>
                            </Grid>
                          </Grid>

                          <IconButton>
                            {transportOpen ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        </Box>
                      </Grid>
                      <Collapse in={transportOpen}>
                        <Box sx={{ width: "100%", mt: 2 }}>
                          <Divider fullWidth />
                        </Box>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={12} sx={{ textAlign: "left" }}>
                            <Typography variant="h6" style={{ color: "red" }}>
                              {
                                "**** Please Note that the driver will be contacting one week before your flight****"
                              }
                            </Typography>
                            <Typography variant="h6" style={{ color: "red" }}>
                              {
                                "**** Your Ride Will Arrived 3 hour before your flight ****"
                              }
                            </Typography>
                            <Typography variant="h6" style={{ color: "red" }}>
                              {
                                "**** Please Show Up on Your Pick up address within 30 minutes****"
                              }
                            </Typography>
                            <Typography variant="h2" sx={{ mt: 2 }}>
                              Departure Transport
                            </Typography>
                            <Typography variant="h3" sx={{ mt: 2 }}>
                              Transport Package
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              {transportData?.name}
                            </Typography>
                            <Typography
                              variant="h3"
                              sx={{ mt: 3, textAlign: "left" }}
                            >
                              Luggage availability
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              {transportData?.luggage} luaggages
                            </Typography>
                            <Typography
                              variant="h3"
                              sx={{ mt: 3, textAlign: "left" }}
                            >
                              Pick Up Address
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              {bookingData?.address}
                            </Typography>
                            <Typography
                              variant="h3"
                              sx={{ mt: 3, textAlign: "left" }}
                            >
                              Routes
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              From
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              {bookingData?.address}
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              To
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              {
                                "Kuala Lumpur International Airport, 64000 Sepang, Selangor"
                              }
                            </Typography>
                          </Grid>
                        </Grid>
                        <Divider fullWidth sx={{ mt: 2 }} />
                        {bookingData?.isReturnTransport === 1 && (
                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sx={{ textAlign: "left" }}>
                              <Typography variant="h2" sx={{ mt: 2 }}>
                                Return Transport
                              </Typography>
                              <Typography variant="h3" sx={{ mt: 2 }}>
                                Transport Package
                              </Typography>
                              <Typography
                                variant="h4"
                                sx={{ mt: 1, textAlign: "left" }}
                              >
                                {transportData?.name}
                              </Typography>
                              <Typography
                                variant="h3"
                                sx={{ mt: 3, textAlign: "left" }}
                              >
                                Luggage availability
                              </Typography>
                              <Typography
                                variant="h4"
                                sx={{ mt: 1, textAlign: "left" }}
                              >
                                {transportData?.luggage} luaggages
                              </Typography>
                              <Typography
                                variant="h3"
                                sx={{ mt: 3, textAlign: "left" }}
                              >
                                Pick Up Address
                              </Typography>
                              <Typography
                                variant="h4"
                                sx={{ mt: 1, textAlign: "left" }}
                              >
                                {
                                  "Kuala Lumpur International Airport, 64000 Sepang, Selangor"
                                }
                              </Typography>
                              <Typography
                                variant="h3"
                                sx={{ mt: 3, textAlign: "left" }}
                              >
                                Routes
                              </Typography>
                              <Typography
                                variant="h4"
                                sx={{ mt: 1, textAlign: "left" }}
                              >
                                From
                              </Typography>
                              <Typography
                                variant="h4"
                                sx={{ mt: 1, textAlign: "left" }}
                              >
                                {
                                  "Kuala Lumpur International Airport, 64000 Sepang, Selangor"
                                }
                              </Typography>
                              <Typography
                                variant="h4"
                                sx={{ mt: 1, textAlign: "left" }}
                              >
                                To
                              </Typography>
                              <Typography
                                variant="h4"
                                sx={{ mt: 1, textAlign: "left" }}
                              >
                                {bookingData?.address}
                              </Typography>
                            </Grid>
                          </Grid>
                        )}
                      </Collapse>
                    </Paper>
                  )}
                </Stack>
              </>
            )}
          </Box>
        </Stack>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={8000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%", fontSize: "1rem" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default ViewBookings;
