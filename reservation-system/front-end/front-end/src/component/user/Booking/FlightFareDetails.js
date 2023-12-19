import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
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
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getBaggageById, getTransportById } from "../../api";

const FlightFareDetails = ({
  open,
  totalPrice,
  onClose,
  departureBundleData,
  returnBundleData,
  departureFlight,
  returnFlight,
  departurePrice,
  returnPrice,
  departureFlightData,
  returnFlightData,
}) => {
  const handleClose = () => {
    onClose();
  };

  const [openCollapse, setOpenCollapse] = useState({});
  const [openReturnCollapse, setOpenReturnCollapse] = useState({});
  const [passengersData, setPassengersData] = useState([]);
  const [transportData, setTransportData] = useState([]);

  const handleReturnClick = (key) => {
    setOpenReturnCollapse((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleClick = (key) => {
    setOpenCollapse((prevState) => ({ ...prevState, [key]: !prevState[key] }));
  };

  const fetchBaggageData = async (baggageId) => {
    const baggageData = await getBaggageById(baggageId);
    return baggageData;
  };

  const fetchTransportdata = async (transportId) => {
    const transportData = await getTransportById(transportId);
    return transportData;
  };

  useEffect(() => {
    const transport = JSON.parse(sessionStorage.getItem("transport"));

    if (transport != undefined && transport !== null) {
      fetchTransportdata(transport?.transportId).then((response) => {
        setTransportData(response);
      });
    } else {
      setTransportData(null);
    }
  }, [totalPrice]);

  useEffect(() => {
    const fetchAllDeparturePassengersData = async () => {
      const passenger = JSON.parse(sessionStorage.getItem("passenger"));

      const allPassengersData = [];
      const passengerKeys = Object.keys(passenger).filter(
        (key) =>
          key.startsWith("Adult") ||
          key.startsWith("Child") ||
          key.startsWith("Baby")
      );

      for (const key of passengerKeys) {
        const passengerData = passenger[key];
        const departbaggageId = passengerData?.departureBaggageId;
        const returnBaggageId = passengerData?.returnBaggageId;

        let departbaggageData;
        if (departbaggageId !== undefined) {
          departbaggageData = await fetchBaggageData(departbaggageId);
        }

        let returnbaggageData;
        if (returnBaggageId !== undefined) {
          returnbaggageData = await fetchBaggageData(returnBaggageId);
        }

        if (returnbaggageData && departbaggageData) {
          allPassengersData.push({
            ...passengerData,
            departbaggageData,
            returnbaggageData,
            key,
          });
        } else {
          allPassengersData.push({ ...passengerData, departbaggageData, key });
        }
      }

      setPassengersData(allPassengersData);
    };

    fetchAllDeparturePassengersData();
  }, [totalPrice]);

  const transport = JSON.parse(sessionStorage.getItem("transport"));

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
          </Grid>
        </Grid>
        {passengersData.map((passenger, i) => {
          if (departureFlightData && departureFlight && departurePrice) {
            let finalDeparturePrice = departurePrice;

            if (passenger.key.startsWith("Adult")) {
              finalDeparturePrice = departurePrice;
            } else if (passenger.key.startsWith("Child")) {
              finalDeparturePrice = departurePrice * 0.8;
            } else {
              finalDeparturePrice = departurePrice * 0.1;
            }

            if (departureBundleData) {
              const bundlePrice =
                departureFlightData?.flight_type === 0
                  ? departureBundleData?.domesticPrice
                  : departureBundleData?.internationalPrice;

              if (bundlePrice) {
                finalDeparturePrice += bundlePrice;
              }
            }

            if (passenger.departbaggageData) {
              const baggagePrice =
                departureFlightData?.flight_type === 0
                  ? passenger.departbaggageData?.domesticPrice
                  : passenger.departbaggageData?.internationalPrice;

              if (baggagePrice) {
                finalDeparturePrice += baggagePrice;
              }
            }

            return (
              <>
                <Card sx={{ mt: 2, p: 3, borderRadius: "25px" }}>
                  <Grid container spacing={1} key={i}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                        cursor: "pointer",
                      }}
                      onClick={() => handleClick(`passenger${i}`)}
                    >
                      <Grid container sx={{ p: 1 }}>
                        <Grid item md={10}>
                          <Typography variant="h3">{passenger.key}</Typography>
                        </Grid>
                        <Grid item md={2}>
                          <Typography variant="h3">
                            MYR {finalDeparturePrice}
                          </Typography>
                        </Grid>
                      </Grid>

                      <IconButton>
                        {openCollapse[`passenger${i}`] ? (
                          <ExpandLessOutlinedIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </Box>
                  </Grid>
                  <Collapse in={openCollapse[`passenger${i}`]}>
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
                          {passenger.key.startsWith("Child")
                            ? departurePrice * 0.8
                            : passenger.key.startsWith("Baby")
                            ? departurePrice * 0.1
                            : passenger.key.startsWith("Adult")
                            ? departurePrice
                            : 0}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={4}>
                        <Typography variant="h3">
                          {passenger.key.startsWith("Baby")
                            ? ""
                            : "Bundle " + departureBundleData?.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                      <Grid item xs={4} sx={{ textAlign: "center" }}>
                        {departureBundleData &&
                          !passenger.key.startsWith("Baby") && (
                            <Typography variant="h3">
                              {"MYR " +
                                (departureFlightData?.flight_type === 0
                                  ? departureBundleData?.domesticPrice
                                  : departureBundleData?.internationalPrice)}
                            </Typography>
                          )}
                      </Grid>
                    </Grid>
                    {passenger?.departbaggageData && (
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={4}>
                          <Typography variant="h3">
                            {passenger?.departbaggageData?.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                        <Grid item xs={4} sx={{ textAlign: "center" }}>
                          <Typography variant="h3">
                            {passenger?.departbaggageData &&
                            departureFlightData?.flight_type === 0
                              ? "MYR " +
                                passenger?.departbaggageData?.domesticPrice
                              : "MYR " +
                                passenger?.departbaggageData
                                  ?.internationalPrice}
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                  </Collapse>
                </Card>
              </>
            );
          }
        })}

        {returnFlightData && returnFlight && returnPrice && (
          <>
            <Grid container>
              <Grid
                item
                container
                md={12}
                sx={{ mt: 2 }}
                alignItems="center"
                spacing={1}
              >
                <Grid item>
                  <FlightLandIcon />
                </Grid>
                <Grid item>
                  <Typography variant="h3">ReturnFlight</Typography>
                </Grid>
              </Grid>
            </Grid>
            {passengersData.map((passenger, i) => {
              let finalReturnPrice = returnPrice;

              if (passenger.key.startsWith("Adult")) {
                finalReturnPrice = returnPrice;
              } else if (passenger.key.startsWith("Child")) {
                finalReturnPrice = returnPrice * 0.8;
              } else {
                finalReturnPrice = returnPrice * 0.1;
              }

              if (returnBundleData) {
                const bundlePrice =
                  returnFlightData?.flight_type === 0
                    ? returnBundleData?.domesticPrice
                    : returnBundleData?.internationalPrice;

                if (bundlePrice) {
                  finalReturnPrice += bundlePrice;
                }
              }

              if (passenger.returnbaggageData) {
                const baggagePrice =
                  returnFlightData?.flight_type === 0
                    ? passenger.returnbaggageData?.domesticPrice
                    : passenger.returnbaggageData?.internationalPrice;

                if (baggagePrice) {
                  finalReturnPrice += baggagePrice;
                }
              }

              return (
                <>
                  <Card sx={{ mt: 2, p: 3, borderRadius: "25px" }}>
                    <Grid container spacing={1} key={i}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          width: "100%",
                          cursor: "pointer",
                        }}
                        onClick={() => handleReturnClick(`passenger${i}`)}
                      >
                        <Grid container sx={{ p: 1 }}>
                          <Grid item md={10}>
                            <Typography variant="h3">
                              {passenger.key}
                            </Typography>
                          </Grid>
                          <Grid item md={2}>
                            <Typography variant="h3">
                              MYR {finalReturnPrice}
                            </Typography>
                          </Grid>
                        </Grid>

                        <IconButton>
                          {openReturnCollapse[`passenger${i}`] ? (
                            <ExpandLessOutlinedIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Box>
                    </Grid>
                    <Collapse in={openReturnCollapse[`passenger${i}`]}>
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
                            {passenger.key.startsWith("Child")
                              ? returnPrice * 0.8
                              : passenger.key.startsWith("Baby")
                              ? returnPrice * 0.1
                              : passenger.key.startsWith("Adult")
                              ? returnPrice
                              : 0}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={4}>
                          <Typography variant="h3">
                            {passenger.key.startsWith("Baby")
                              ? null
                              : "Bundle " + returnBundleData?.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                        <Grid item xs={4} sx={{ textAlign: "center" }}>
                          <Typography variant="h3">
                            {returnBundleData &&
                              !passenger.key.startsWith("Baby") && (
                                <Typography variant="h3">
                                  {"MYR " +
                                    (returnFlightData?.flight_type === 0
                                      ? returnBundleData?.domesticPrice
                                      : returnBundleData?.internationalPrice)}
                                </Typography>
                              )}
                          </Typography>
                        </Grid>
                      </Grid>
                      {passenger?.returnbaggageData && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={4}>
                            <Typography variant="h3">
                              {passenger?.returnbaggageData?.name}
                            </Typography>
                          </Grid>
                          <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
                          <Grid item xs={4} sx={{ textAlign: "center" }}>
                            <Typography variant="h3">
                              MYR{" "}
                              {passenger?.returnbaggageData &&
                              returnFlightData?.flight_type === 0
                                ? passenger?.returnbaggageData?.domesticPrice
                                : passenger?.returnbaggageData
                                    ?.internationalPrice}
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    </Collapse>
                  </Card>
                </>
              );
            })}
          </>
        )}

        {transportData && (
          <Card sx={{ mt: 2, p: 3, borderRadius: "25px" }}>
            <Grid container spacing={1}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Grid container sx={{ p: 1 }}>
                  <Grid item md={9} sx={{ mr: 5 }}>
                    <Typography variant="h3">
                      <DirectionsCarIcon /> {transportData?.name}
                    </Typography>
                  </Grid>
                  <Grid item md={2}>
                    <Typography variant="h3">
                      MYR{" "}
                      {transport?.isTransportReturnChecked === 1
                        ? transportData?.price * 2
                        : transportData?.price}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Card>
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

export default FlightFareDetails;
