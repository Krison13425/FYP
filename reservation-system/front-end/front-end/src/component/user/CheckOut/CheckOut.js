import styled from "@emotion/styled";
import { FlightLandOutlined, FlightTakeoff } from "@mui/icons-material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import FlightOutlinedIcon from "@mui/icons-material/FlightOutlined";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import {
  Alert,
  Box,
  ButtonBase,
  Divider,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import {
  calculatePrice,
  createPayment,
  executePayment,
  getBaggageById,
  getBundleById,
  getFlightById,
  getTransportById,
} from "../../api";
import FlightFareDetails from "../Booking/FlightFareDetails";
import NavBar from "../global/Navbar";
import { SearchContext } from "../global/SearchContext";
import BookingStepper from "../global/Stepper";
import { useNavigate } from "react-router-dom";
import { clampDaySectionIfPossible } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";
import checkSessionAndRedirect from "../SessionCheck";

const CustomBox = styled(Box)(({ theme }) => ({
  position: "relative",
  cursor: "pointer",
  overflow: "hidden",
  width: 550,
  borderRadius: "15px",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: theme.palette.primary.main,
    transform: "translateX(-100%)",
    transition: "transform 0.3s ease-out",
  },
  "&:hover": {
    "&:before": {
      transform: "translateX(0)",
    },
  },
}));

const CustomButton = styled(ButtonBase, { name: "custom-button" })(
  ({ theme }) => ({
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  })
);

function Checkout() {
  const { originalFlightSearch } = useContext(SearchContext);
  const [{ isPending }] = usePayPalScriptReducer();
  const [transportPrice, setTransportPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState(null);
  const [flightFare, setFlightFare] = useState(0);
  const [baggageFare, setBaggageFare] = useState(0);
  const [departureBundleData, setDepartureBundleData] = useState(0);
  const [returnBundleData, setReturnBundleData] = useState(0);
  const [departureFlight, setDepartureFlight] = useState(null);
  const [returnFlight, setReturnFlight] = useState(null);
  const [departureFlightData, setDepartureFlightData] = useState(null);
  const [returnFlightData, setReturnFlightData] = useState(null);
  const [showDailog, setShowDialog] = useState(false);
  const [hover, setHover] = useState(false);

  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [loading, setLoading] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleOpen = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setOpen(true);
  };

  const navigate = useNavigate();
  const handleOpenDialog = () => {
    setShowDialog(true);
  };
  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const fetchTotalPrice = async (flightDetails, passengerDetails) => {
    const totalPrice = await calculatePrice(flightDetails, passengerDetails);
    return totalPrice;
  };

  const fetchFlightData = async (id) => {
    const flightData = await getFlightById(id);
    return flightData;
  };

  const fetchSelectedBaggageData = async (id) => {
    const baggageData = await getBaggageById(id);
    return baggageData;
  };

  const fetchSelectedTransportData = async (id) => {
    const ransportData = await getTransportById(id);
    return ransportData;
  };

  const fetchBundleData = async (id) => {
    const bundleData = await getBundleById(id);
    return bundleData;
  };

  const calculateAndLogPrice = async () => {
    const departureFlight = JSON.parse(
      sessionStorage.getItem("departureFlight")
    );
    setDepartureFlight(departureFlight);

    const returnFlight = JSON.parse(sessionStorage.getItem("returnFlight"));
    setReturnFlight(returnFlight);

    const passengers = [
      {
        passengerType: "Adult",
        passengerCount: originalFlightSearch?.passengers?.adults,
      },
      {
        passengerType: "Child",
        passengerCount: originalFlightSearch?.passengers?.children,
      },
      {
        passengerType: "Baby",
        passengerCount: originalFlightSearch?.passengers?.babies,
      },
    ];

    let flightDetails = [];
    if (returnFlight != null) {
      flightDetails = [departureFlight, returnFlight];
    } else {
      flightDetails = [departureFlight];
    }

    const passengerDetails = passengers;

    let [
      departureBundleData,
      departureFlightData,
      returnBundleData,
      returnFlightData,
      totalPrice,
    ] = await Promise.all([
      departureFlight?.bundleId && fetchBundleData(departureFlight?.bundleId),
      fetchFlightData(departureFlight?.id),
      returnFlight?.bundleId && fetchBundleData(returnFlight?.bundleId),
      returnFlight?.id && fetchFlightData(returnFlight?.id),
      fetchTotalPrice(flightDetails, passengerDetails),
    ]);

    setDepartureBundleData(departureBundleData);
    setDepartureFlightData(departureFlightData);
    setReturnBundleData(returnBundleData);
    setReturnFlightData(returnFlightData);
    setFlightFare(totalPrice);

    const passengerData = JSON.parse(sessionStorage.getItem("passenger"));
    let baggageFare = 0;
    let baggagePromises = [];
    for (let passengerKey in passengerData) {
      const passenger = passengerData[passengerKey];

      if (passenger.departureBaggageId) {
        baggagePromises.push(
          fetchSelectedBaggageData(passenger.departureBaggageId)
        );
      }

      if (returnFlight && passenger.returnBaggageId) {
        baggagePromises.push(
          fetchSelectedBaggageData(passenger.returnBaggageId)
        );
      }
    }

    const baggageDataList = await Promise.all(baggagePromises);
    baggageDataList.forEach((baggageData) => {
      if (baggageData && baggageData.flight_type === 0) {
        totalPrice += baggageData.domesticPrice;
        baggageFare += baggageData.domesticPrice;
      } else {
        totalPrice += baggageData.internationalPrice;
        baggageFare += baggageData.internationalPrice;
      }
    });

    const selectedTransport = JSON.parse(sessionStorage.getItem("transport"));
    if (selectedTransport) {
      const selectedTransportData = await fetchSelectedTransportData(
        selectedTransport?.transportId
      );

      if (selectedTransport.isTransportReturnChecked === 1) {
        totalPrice += selectedTransportData?.price * 2;
        setTransportPrice(selectedTransportData?.price * 2);
      } else {
        totalPrice += selectedTransportData?.price;
        setTransportPrice(selectedTransportData?.price);
      }
    }

    sessionStorage.setItem("totalprice", totalPrice);
    setBaggageFare(baggageFare);
    setTotalPrice(totalPrice);
    setLoading(false);
  };

  useEffect(() => {
    checkSessionAndRedirect(navigate, "passenger", "/");
    if (
      sessionStorage.getItem("passenger") &&
      sessionStorage.getItem("departureFlight")
    ) {
      setLoading(true);
      calculateAndLogPrice();
    }
  }, [originalFlightSearch, totalPrice]);

  let departurePrice;

  if (originalFlightSearch?.flightClass === "Economy") {
    departurePrice = departureFlightData?.economy_price;
  } else {
    departurePrice = departureFlightData?.business_price;
  }

  let returnPrice;

  if (originalFlightSearch?.flightClass === "Economy") {
    returnPrice = returnFlightData?.economy_price;
  } else {
    returnPrice = returnFlightData?.business_price;
  }

  let exchangeRate = 0.23838;
  return (
    <>
      {isPending ? (
        "Loading..."
      ) : (
        <>
          <NavBar />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              ".MuiStepLabel-label": { fontSize: "1rem" },
            }}
          >
            <BookingStepper
              activeStep={6}
              tripType={originalFlightSearch?.tripType}
            />
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            <Typography variant="h2"> Check Out</Typography>
          </Box>

          <Box sx={{ p: 5, display: "flex", justifyContent: "center" }}>
            <Stack flexDirection={"row"}>
              <Box display={"flex"} justifyContent={"flex-start"}>
                <Paper
                  sx={{
                    p: 3,
                    mt: 2,
                    mr: 10,
                    width: 800,
                    borderRadius: "30px",
                    boxSizing: "border-box",
                    height: "100%",
                  }}
                  elevation={0}
                  variant="outlined"
                  display="flex"
                >
                  <Grid container spacing={1} sx={{ p: 1 }}>
                    <Grid item xs={6}>
                      <Typography variant="h3" textAlign={"left"}>
                        <FlightTakeoff />
                        Departure FLight:
                      </Typography>
                      <Typography
                        variant="h3"
                        textAlign={"left"}
                        sx={{ mt: 2 }}
                      >
                        {departureFlightData?.departure_airport} to{" "}
                        {departureFlightData?.arrival_airport}
                      </Typography>
                      {returnFlightData && (
                        <>
                          <Typography
                            variant="h3"
                            textAlign={"left"}
                            sx={{ mt: 2 }}
                          >
                            <FlightLandOutlined />
                            Return Flight:
                          </Typography>
                          <Typography
                            variant="h3"
                            textAlign={"left"}
                            sx={{ mt: 2 }}
                          >
                            {returnFlightData?.departure_airport} to{" "}
                            {returnFlightData?.arrival_airport}
                          </Typography>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="h3"
                        textAlign={"right"}
                        sx={{ mt: 2 }}
                      >
                        {" "}
                      </Typography>
                      <Typography
                        variant="h4"
                        textAlign={"right"}
                        sx={{ mt: 6 }}
                      >
                        {dayjs(departureFlightData?.departure_time).format(
                          "DD MMM YYYY"
                        )}{" "}
                        (
                        {dayjs(departureFlightData?.departure_time).format(
                          "HH:mm"
                        )}
                        ) to{" "}
                        {dayjs(departureFlightData?.arrival_time).format(
                          "DD MMM YYYY"
                        )}{" "}
                        (
                        {dayjs(departureFlightData?.arrival_time).format(
                          "HH:mm"
                        )}
                        )
                      </Typography>
                      <Typography variant="h3" textAlign={"right"}></Typography>
                      {returnFlightData && (
                        <>
                          <Typography
                            variant="h4"
                            textAlign={"right"}
                            sx={{ mt: 9 }}
                          >
                            {dayjs(returnFlightData?.departure_time).format(
                              "DD MMM YYYY"
                            )}{" "}
                            (
                            {dayjs(returnFlightData?.departure_time).format(
                              "HH:mm"
                            )}
                            ) to{" "}
                            {dayjs(returnFlightData?.arrival_time).format(
                              "DD MMM YYYY"
                            )}{" "}
                            (
                            {dayjs(returnFlightData?.arrival_time).format(
                              "HH:mm"
                            )}
                            )
                          </Typography>
                        </>
                      )}
                    </Grid>
                  </Grid>
                  <Divider sx={{ mt: 2, mb: 2 }} />
                  <Box display={"flex"} justifyContent={"cneter"}></Box>
                  <Paper
                    elevation={10}
                    sx={{
                      p: 3,
                      mt: 2,
                      width: 700,
                      borderRadius: "30px",
                      boxSizing: "border-box",
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        ml: 3,
                        width: 600,
                        borderRadius: "30px",
                        boxSizing: "border-box",
                        backgroundColor: "#d1d5db",
                      }}
                    >
                      {totalPrice !== null && (
                        <PayPalButtons
                          style={{
                            layout: "vertical",
                            color: "blue",
                            shape: "pill",
                            label: "pay",
                            tagline: false,
                          }}
                          disabled={!totalPrice}
                          createOrder={(data, actions) => {
                            let totalPriceInUSD = totalPrice * exchangeRate;

                            return actions.order
                              .create({
                                purchase_units: [
                                  {
                                    amount: {
                                      value: totalPriceInUSD.toFixed(2),
                                    },
                                  },
                                ],
                              })
                              .then((orderId) => {
                                return orderId;
                              });
                          }}
                          onApprove={async (data, actions) => {
                            const orderData = await actions.order.capture();

                            const transaction =
                              orderData.purchase_units[0].payments.captures[0];

                            sessionStorage.setItem(
                              "transactionId",
                              transaction.id
                            );

                            navigate("/PaymentSucess");
                          }}
                          onCancel={() => {
                            handleOpen("Payment cancelled!", "info");
                          }}
                          onError={(error) => {
                            handleOpen("Paypal Checkout onError ", "error");
                          }}
                        />
                      )}
                    </Paper>
                  </Paper>
                </Paper>
              </Box>
              <Box display={"flex"} justifyContent={"flex-end"}>
                <Paper
                  sx={{
                    p: 3,
                    mt: 2,
                    width: 600,
                    borderRadius: "30px",
                    boxSizing: "border-box",
                    height: 270,
                  }}
                  elevation={0}
                  variant="outlined"
                  display="flex"
                >
                  <Grid container spacing={1} sx={{ p: 1 }}>
                    <Grid itme xs={6}>
                      <Typography variant="h3" textAlign={"left"}>
                        <AttachMoneyOutlinedIcon />
                        Total Price:
                      </Typography>
                      <Typography
                        variant="h3"
                        textAlign={"left"}
                        sx={{ mt: 2 }}
                      >
                        <FlightOutlinedIcon />
                        Flight Fare Total:
                      </Typography>
                      <Typography variant="h3" textAlign={"left"}>
                        <LuggageOutlinedIcon />
                        Baggage Fare Total:
                      </Typography>
                      {transportPrice && (
                        <Typography variant="h3" textAlign={"left"}>
                          <DirectionsCarIcon />
                          Transport Fare Total:
                        </Typography>
                      )}
                    </Grid>
                    <Grid itme xs={6}>
                      <Typography variant="h3" textAlign={"right"}>
                        MYR {totalPrice}
                      </Typography>
                      <Typography
                        variant="h3"
                        textAlign={"right"}
                        sx={{ mt: 2 }}
                      >
                        MYR {flightFare}
                      </Typography>
                      <Typography variant="h3" textAlign={"right"}>
                        MYR {baggageFare}
                      </Typography>
                      {transportPrice && (
                        <Typography variant="h3" textAlign={"right"}>
                          MYR {transportPrice}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container spacing={1} sx={{ mt: 3 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sx={{ mt: 3, textAlign: "right" }}>
                        <ButtonBase onClick={handleOpenDialog}>
                          <CustomBox
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                          >
                            <Stack
                              flexDirection="row"
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <CustomButton onClick={handleOpenDialog}>
                                <Typography variant="h3">
                                  View Price Details
                                </Typography>
                              </CustomButton>
                              <ArrowForwardIosRoundedIcon
                                sx={{ mt: 0.5, color: "white" }}
                              />
                            </Stack>
                          </CustomBox>
                        </ButtonBase>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Stack>
          </Box>
          <Box />

          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity={alertSeverity}
              sx={{ width: "100%" }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>

          <FlightFareDetails
            open={showDailog}
            onClose={handleCloseDialog}
            departureBundleData={departureBundleData}
            returnBundleData={returnBundleData}
            departureFlight={departureFlight}
            returnFlight={returnFlight}
            departureFlightData={departureFlightData}
            returnFlightData={returnFlightData}
            departurePrice={departurePrice}
            returnPrice={returnPrice}
            totalPrice={totalPrice}
          />
        </>
      )}
    </>
  );
}

export default Checkout;
