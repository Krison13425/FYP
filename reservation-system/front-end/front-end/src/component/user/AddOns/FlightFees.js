import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import {
  Box,
  Card,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { getBaggageById, getBundleById } from "../../api";

const FlightFees = ({
  open,
  departflight,
  returnflight,
  totalPrice,
  originalFlightSearch,
  departflightData,
  returnflightData,
  onClose,
  onSeatConfirm,
}) => {
  const handleClose = () => {
    onClose();
  };
  const [departureBundleData, setDepartureBundleData] = useState(null);
  const [returnBundleData, setReturnBundleData] = useState(null);
  const [passengerBaggage, setPassengerBaggage] = useState({});
  const [returnPassengerBaggage, setReturnPassengerBaggage] = useState({});
  const [openCollapse, setOpenCollapse] = useState({});
  const [openReturnCollapse, setOpenReturnCollapse] = useState({});

  const handleReturnClick = (key) => {
    setOpenReturnCollapse((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleClick = (key) => {
    setOpenCollapse((prevState) => ({ ...prevState, [key]: !prevState[key] }));
  };

  const fectchBundleData = async (bundleId) => {
    const bundledata = await getBundleById(bundleId);
    return bundledata;
  };

  useEffect(() => {
    const handleStorageChange = async () => {
      let baggage = {};

      if (originalFlightSearch?.passengers) {
        for (let i = 0; i < originalFlightSearch.passengers.adults; i++) {
          const adultData = JSON.parse(sessionStorage.getItem(`Adult${i + 1}`));

          if (adultData?.departureBaggageId !== undefined) {
            const departureBaggageData = await fetchBaggageData(
              adultData.departureBaggageId
            );
            let returnBaggageData = null;

            if (adultData.returnBaggageId !== undefined) {
              returnBaggageData = await fetchBaggageData(
                adultData.returnBaggageId
              );
            }

            baggage[`Adult${i + 1}`] = {
              departureBaggage: departureBaggageData,
              returnBaggage: returnBaggageData,
            };
          }
        }

        for (let i = 0; i < originalFlightSearch.passengers.children; i++) {
          const childData = JSON.parse(sessionStorage.getItem(`Child${i + 1}`));

          if (childData?.departureBaggageId !== undefined) {
            const departureBaggageData = await fetchBaggageData(
              childData.departureBaggageId
            );
            let returnBaggageData = null;

            if (childData.returnBaggageId !== undefined) {
              returnBaggageData = await fetchBaggageData(
                childData.returnBaggageId
              );
            }

            baggage[`Child${i + 1}`] = {
              departureBaggage: departureBaggageData,
              returnBaggage: returnBaggageData,
            };
          }
        }

        setPassengerBaggage(baggage);
      }
    };

    handleStorageChange();
  });

  const fetchBaggageData = async (baggageId) => {
    const baggageData = await getBaggageById(baggageId);
    return baggageData;
  };

  useEffect(() => {
    if (departflight) {
      fectchBundleData(departflight.bundleId).then((bundleData) => {
        setDepartureBundleData(bundleData);
      });
    }
    if (returnflight) {
      fectchBundleData(returnflight.bundleId).then((bundleData) => {
        setReturnBundleData(bundleData);
      });
    }
  }, [departflight, returnflight]);

  const handleSeatSelection = (selectedSeat) => {
    onSeatConfirm(selectedSeat);
  };

  const displayDeparturePassengerData = () => {
    if (originalFlightSearch && originalFlightSearch.passengers) {
      let passengersData = [];

      for (let i = 0; i < originalFlightSearch.passengers.adults; i++) {
        const adultData = JSON.parse(sessionStorage.getItem(`Adult${i + 1}`));
        const baggageData = passengerBaggage[`Adult${i + 1}`];

        let departPrice = 0;

        if (departflight?.class === "Economy") {
          departPrice += departflightData?.economy_price;
        } else {
          departPrice += departflightData?.business_price;
        }

        if (departureBundleData) {
          departPrice +=
            departflightData?.flight_type === 0
              ? departureBundleData?.domesticPrice
              : departureBundleData?.internationalPrice || 0;
        }

        if (baggageData) {
          departPrice +=
            departflightData?.flight_type === 0
              ? baggageData?.departureBaggage?.domesticPrice
              : baggageData?.departureBaggage?.internationalPrice || 0;
        }

        passengersData.push(
          <Card sx={{ mt: 2, p: 3, borderRadius: "25px" }}>
            <Grid container spacing={1} key={`adultData${i}`}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  cursor: "pointer",
                }}
                onClick={() => handleClick(`adult${i}`)}
              >
                <Grid container sx={{ p: 1 }}>
                  <Grid item md={10}>
                    <Typography variant="h3">Adult {i + 1}</Typography>
                  </Grid>
                  <Grid item md={2}>
                    <Typography variant="h3">MYR {departPrice}</Typography>
                  </Grid>
                </Grid>

                <IconButton>
                  {openCollapse[`adult${i}`] ? (
                    <ExpandLessOutlinedIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>
            </Grid>
            <Collapse in={openCollapse[`adult${i}`]}>
              <Box sx={{ width: "100%" }}>
                <Divider fullWidth />
              </Box>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item md={4}>
                  <Typography variant="h3">Flight Base Fare</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                <Grid item md={4} sx={{ textAlign: "center" }}>
                  <Typography variant="h3">
                    MYR{" "}
                    {departflight?.class === "Economy"
                      ? departflightData?.economy_price
                      : departflightData?.business_price}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Typography variant="h3">
                    Bundle {departureBundleData?.name}
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}>
                  <Typography variant="h3">
                    MYR{" "}
                    {departureBundleData && departflightData?.flight_type === 0
                      ? departureBundleData?.domesticPrice
                      : departureBundleData?.internationalPrice}
                  </Typography>
                </Grid>
              </Grid>
              {baggageData && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={4}>
                    <Typography variant="h3">
                      {baggageData?.departureBaggage?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Typography variant="h3">
                      MYR{" "}
                      {baggageData && departflightData?.flight_type === 0
                        ? baggageData?.departureBaggage?.domesticPrice
                        : baggageData?.departureBaggage?.internationalPrice}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Collapse>
          </Card>
        );
      }

      for (let i = 0; i < originalFlightSearch.passengers.children; i++) {
        const childData = JSON.parse(sessionStorage.getItem(`Child${i + 1}`));
        const baggageData = passengerBaggage[`Child${i + 1}`];

        let departPrice = 0;

        if (departflight?.class === "Economy") {
          departPrice += departflightData?.economy_price * 0.8;
        } else {
          departPrice += departflightData?.business_price * 0.8;
        }

        if (departureBundleData) {
          departPrice +=
            departflightData?.flight_type === 0
              ? departureBundleData?.domesticPrice
              : departureBundleData?.internationalPrice || 0;
        }

        if (baggageData) {
          departPrice +=
            departflightData?.flight_type === 0
              ? baggageData?.departureBaggage?.domesticPrice
              : baggageData?.departureBaggage?.internationalPrice || 0;
        }

        const childPrice = departPrice;

        passengersData.push(
          <Card sx={{ mt: 2, p: 3, borderRadius: "25px" }}>
            <Grid container spacing={1} key={`childData${i}`}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  cursor: "pointer",
                }}
                onClick={() => handleClick(`child${i}`)}
              >
                <Grid container sx={{ p: 1 }}>
                  <Grid item md={10}>
                    <Typography variant="h3">Child {i + 1}</Typography>
                  </Grid>
                  <Grid item md={2}>
                    <Stack direction={"row"}>
                      <Typography variant="h3">MYR {childPrice}</Typography>
                    </Stack>
                  </Grid>
                </Grid>

                <IconButton>
                  {openCollapse[`child${i}`] ? (
                    <ExpandLessOutlinedIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>
            </Grid>
            <Collapse in={openCollapse[`child${i}`]}>
              <Box sx={{ width: "100%" }}>
                <Divider fullWidth />
              </Box>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item md={4}>
                  <Typography variant="h3">Flight Base Fare</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                <Grid item md={4} sx={{ textAlign: "center" }}>
                  <Typography variant="h3">
                    MYR{" "}
                    {departflight?.class === "Economy"
                      ? departflightData?.economy_price * 0.8
                      : departflightData?.business_price * 0.8}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Typography variant="h3">
                    Bundle {departureBundleData?.name}
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}>
                  <Typography variant="h3">
                    MYR{" "}
                    {departureBundleData && departflightData?.flight_type === 0
                      ? departureBundleData?.domesticPrice * 0.8
                      : departureBundleData?.internationalPrice * 0.8}
                  </Typography>
                </Grid>
              </Grid>
              {baggageData && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={4}>
                    <Typography variant="h3">
                      {baggageData?.departureBaggage?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Typography variant="h3">
                      MYR{" "}
                      {baggageData && departflightData?.flight_type === 0
                        ? baggageData?.departureBaggage?.domesticPrice
                        : baggageData?.departureBaggage?.internationalPrice}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Collapse>
          </Card>
        );
      }

      for (let i = 0; i < originalFlightSearch.passengers.babies; i++) {
        const babyData = JSON.parse(sessionStorage.getItem(`Baby${i + 1}`));

        let departPrice = 0;

        if (departflight?.class === "Economy") {
          departPrice += departflightData?.economy_price;
        } else {
          departPrice += departflightData?.business_price;
        }

        const babyPrice = departPrice * 0.1;

        passengersData.push(
          <Card sx={{ mt: 2, p: 3, borderRadius: "25px" }}>
            <Grid container spacing={1} key={`babyData${i}`}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  cursor: "pointer",
                }}
                onClick={() => handleClick(`baby${i}`)}
              >
                <Grid container sx={{ p: 1 }}>
                  <Grid item md={10}>
                    <Typography variant="h3">Baby {i + 1}</Typography>
                  </Grid>
                  <Grid item md={2}>
                    <Stack direction={"row"}>
                      <Typography variant="h3">MYR {babyPrice}</Typography>
                    </Stack>
                  </Grid>
                </Grid>

                <IconButton>
                  {openCollapse[`baby${i}`] ? (
                    <ExpandLessOutlinedIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>
            </Grid>
            <Collapse in={openCollapse[`baby${i}`]}>
              <Box sx={{ width: "100%" }}>
                <Divider fullWidth />
              </Box>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item md={4}>
                  <Typography variant="h3">Flight Base Fare</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                <Grid item md={4} sx={{ textAlign: "center" }}>
                  <Typography variant="h3">MYR {babyPrice}</Typography>
                </Grid>
              </Grid>
            </Collapse>
          </Card>
        );
      }

      return passengersData;
    }
  };

  const displayReturnPassengerData = () => {
    if (originalFlightSearch && originalFlightSearch.passengers) {
      let passengersData = [];

      for (let i = 0; i < originalFlightSearch.passengers.adults; i++) {
        const adultData = JSON.parse(sessionStorage.getItem(`Adult${i + 1}`));
        const baggageData = passengerBaggage[`Adult${i + 1}`];

        let returnPrice = 0;

        if (returnflight?.class === "Economy") {
          returnPrice += returnflightData?.economy_price;
        } else {
          returnPrice += returnflightData?.business_price;
        }

        if (returnBundleData) {
          returnPrice +=
            returnflightData?.flight_type === 0
              ? returnBundleData?.domesticPrice
              : returnBundleData?.internationalPrice || 0;
        }

        if (baggageData) {
          returnPrice +=
            returnflightData?.flight_type === 0
              ? baggageData?.returnBaggage?.domesticPrice
              : baggageData?.returnBaggage?.internationalPrice || 0;
        }

        passengersData.push(
          <Card sx={{ mt: 2, p: 3, borderRadius: "25px" }}>
            <Grid container spacing={1} key={`adultData${i}`}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  cursor: "pointer",
                }}
                onClick={() => handleReturnClick(`adult${i}`)}
              >
                <Grid container sx={{ p: 1 }}>
                  <Grid item md={10}>
                    <Typography variant="h3">Adult {i + 1}</Typography>
                  </Grid>
                  <Grid item md={2}>
                    <Typography variant="h3">MYR {returnPrice}</Typography>
                  </Grid>
                </Grid>

                <IconButton>
                  {openReturnCollapse[`adult${i}`] ? (
                    <ExpandLessOutlinedIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>
            </Grid>
            <Collapse in={openReturnCollapse[`adult${i}`]}>
              <Box sx={{ width: "100%" }}>
                <Divider fullWidth />
              </Box>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item md={4}>
                  <Typography variant="h3">Flight Base Fare</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                <Grid item md={4} sx={{ textAlign: "center" }}>
                  <Typography variant="h3">
                    MYR{" "}
                    {returnflight?.class === "Economy"
                      ? returnflightData?.economy_price
                      : returnflightData?.business_price}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Typography variant="h3">
                    Bundle {returnBundleData?.name}
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}>
                  <Typography variant="h3">
                    MYR{" "}
                    {returnBundleData && returnflightData?.flight_type === 0
                      ? returnBundleData?.domesticPrice
                      : returnBundleData?.internationalPrice}
                  </Typography>
                </Grid>
              </Grid>
              {baggageData && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={4}>
                    <Typography variant="h3">
                      {baggageData?.returnBaggage?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Typography variant="h3">
                      MYR{" "}
                      {baggageData && departflightData?.flight_type === 0
                        ? baggageData?.returnBaggage?.domesticPrice
                        : baggageData?.returnBaggage?.internationalPrice}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Collapse>
          </Card>
        );
      }

      for (let i = 0; i < originalFlightSearch.passengers.children; i++) {
        const childData = JSON.parse(sessionStorage.getItem(`Child${i + 1}`));
        const baggageData = passengerBaggage[`Child${i + 1}`];

        let returnPrice = 0;

        if (returnflight?.class === "Economy") {
          returnPrice += returnflightData?.economy_price * 0.8;
        } else {
          returnPrice += returnflightData?.business_price * 0.8;
        }

        if (departureBundleData) {
          returnPrice +=
            returnflightData?.flight_type === 0
              ? returnBundleData?.domesticPrice
              : returnBundleData?.internationalPrice || 0;
        }

        if (baggageData) {
          returnPrice +=
            returnflightData?.flight_type === 0
              ? baggageData?.returnBaggage?.domesticPrice
              : baggageData?.returnBaggage?.internationalPrice || 0;
        }

        const childPrice = returnPrice;

        passengersData.push(
          <Card sx={{ mt: 2, p: 3, borderRadius: "25px" }}>
            <Grid container spacing={1} key={`childData${i}`}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  cursor: "pointer",
                }}
                onClick={() => handleReturnClick(`child${i}`)}
              >
                <Grid container sx={{ p: 1 }}>
                  <Grid item md={10}>
                    <Typography variant="h3">Child {i + 1}</Typography>
                  </Grid>
                  <Grid item md={2}>
                    <Stack direction={"row"}>
                      <Typography variant="h3">MYR {childPrice}</Typography>
                    </Stack>
                  </Grid>
                </Grid>

                <IconButton>
                  {openReturnCollapse[`child${i}`] ? (
                    <ExpandLessOutlinedIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>
            </Grid>
            <Collapse in={openReturnCollapse[`child${i}`]}>
              <Box sx={{ width: "100%" }}>
                <Divider fullWidth />
              </Box>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item md={4}>
                  <Typography variant="h3">Flight Base Fare</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                <Grid item md={4} sx={{ textAlign: "center" }}>
                  <Typography variant="h3">
                    MYR{" "}
                    {returnflight?.class === "Economy"
                      ? returnflightData?.economy_price * 0.8
                      : returnflightData?.business_price * 0.8}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Typography variant="h3">
                    Bundle {returnBundleData?.name}
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}>
                  <Typography variant="h3">
                    MYR{" "}
                    {returnBundleData && returnflightData?.flight_type === 0
                      ? returnBundleData?.domesticPrice * 0.8
                      : returnBundleData?.internationalPrice * 0.8}
                  </Typography>
                </Grid>
              </Grid>
              {baggageData && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={4}>
                    <Typography variant="h3">
                      {baggageData?.returnBaggage?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Typography variant="h3">
                      MYR{" "}
                      {baggageData && returnflightData?.flight_type === 0
                        ? baggageData?.returnBaggage?.domesticPrice
                        : baggageData?.returnBaggage?.internationalPrice}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Collapse>
          </Card>
        );
      }

      for (let i = 0; i < originalFlightSearch.passengers.babies; i++) {
        const babyData = JSON.parse(sessionStorage.getItem(`Baby${i + 1}`));

        let returnPrice = 0;

        if (returnflight?.class === "Economy") {
          returnPrice += departflightData?.economy_price;
        } else {
          returnPrice += departflightData?.business_price;
        }

        const babyPrice = returnPrice * 0.1;

        passengersData.push(
          <Card sx={{ mt: 2, p: 3, borderRadius: "25px" }}>
            <Grid container spacing={1} key={`babyData${i}`}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  cursor: "pointer",
                }}
                onClick={() => handleReturnClick(`baby${i}`)}
              >
                <Grid container sx={{ p: 1 }}>
                  <Grid item md={10}>
                    <Typography variant="h3">Baby {i + 1}</Typography>
                  </Grid>
                  <Grid item md={2}>
                    <Stack direction={"row"}>
                      <Typography variant="h3">MYR {babyPrice}</Typography>
                    </Stack>
                  </Grid>
                </Grid>

                <IconButton>
                  {openReturnCollapse[`baby${i}`] ? (
                    <ExpandLessOutlinedIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>
            </Grid>
            <Collapse in={openReturnCollapse[`baby${i}`]}>
              <Box sx={{ width: "100%" }}>
                <Divider fullWidth />
              </Box>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item md={4}>
                  <Typography variant="h3">Flight Base Fare</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                <Grid item md={4} sx={{ textAlign: "center" }}>
                  <Typography variant="h3">MYR {babyPrice}</Typography>
                </Grid>
              </Grid>
            </Collapse>
          </Card>
        );
      }

      return passengersData;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "20px",
        },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseRoundedIcon />
      </IconButton>
      <DialogTitle sx={{ fontSize: "2rem" }}>Flight Fare Details</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container>
          <Grid item container md={12} alignItems="center" spacing={1}>
            <Grid item>
              <FlightTakeoffIcon />
            </Grid>
            <Grid item>
              <Typography variant="h3">DepartureFlight</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h3" sx={{ ml: 45 }}>
                {departflightData?.departure_airport}
              </Typography>
            </Grid>
            <Grid item>
              <ArrowForwardOutlinedIcon sx={{ mt: 1 }} />
            </Grid>
            <Grid item>
              <Typography variant="h3">
                {departflightData?.arrival_airport}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h3" sx={{ ml: 1 }}>
                {dayjs(departflightData?.departure_time).format("DD MMM YYYY")}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {displayDeparturePassengerData()}
        {returnflight && returnflightData && (
          <>
            <Divider sx={{ mt: 2 }} />
            <Grid container sx={{ mt: 2 }}>
              <Grid item container md={12} alignItems="center" spacing={1}>
                <Grid item>
                  <FlightLandIcon />
                </Grid>
                <Grid item>
                  <Typography variant="h3">ReturnFlight</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h3" sx={{ ml: 50 }}>
                    {returnflightData?.departure_airport}
                  </Typography>
                </Grid>
                <Grid item>
                  <ArrowForwardOutlinedIcon sx={{ mt: 1 }} />
                </Grid>
                <Grid item>
                  <Typography variant="h3">
                    {returnflightData?.arrival_airport}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h3" sx={{ ml: 1 }}>
                    {dayjs(returnflightData?.departure_time).format(
                      "DD MMM YYYY"
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {displayReturnPassengerData()}
          </>
        )}
        <Divider sx={{ mt: 2 }} />
        <Grid container sx={{ mt: 2 }} alignItems="center" spacing={1}>
          <Grid item md={12} sx={{ textAlign: "right", mr: 10 }}>
            <Typography variant="h6" sx={{ display: "inline" }}>
              Total:
            </Typography>
            <Typography variant="h2" sx={{ display: "inline", ml: 1 }}>
              MYR {totalPrice}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default FlightFees;
