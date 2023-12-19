import styled from "@emotion/styled";
import AirlineSeatReclineExtraOutlinedIcon from "@mui/icons-material/AirlineSeatReclineExtraOutlined";
import AirplaneTicketOutlinedIcon from "@mui/icons-material/AirplaneTicketOutlined";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import FlightLandOutlinedIcon from "@mui/icons-material/FlightLandOutlined";
import FlightOutlinedIcon from "@mui/icons-material/FlightOutlined";
import FlightTakeoffOutlinedIcon from "@mui/icons-material/FlightTakeoffOutlined";
import LocalBarOutlinedIcon from "@mui/icons-material/LocalBarOutlined";
import LocalDiningOutlinedIcon from "@mui/icons-material/LocalDiningOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import PersonIcon from "@mui/icons-material/Person";
import {
  Box,
  Button,
  ButtonBase,
  Card,
  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  makeStyles,
} from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  calculatePrice,
  getAirportNameList,
  getAirports,
  getAllTransports,
  getBaggageById,
  getBundleById,
  getCountryList,
  getFlightById,
  getMealList,
  getTransportById,
} from "../../api";
import NavBar from "../global/Navbar";
import { SearchContext } from "../global/SearchContext";
import BookingStepper from "../global/Stepper";
import FlightFareDetails from "./FlightFareDetails";
import {
  GoogleMap,
  LoadScript,
  StandaloneSearchBox,
  Marker,
} from "@react-google-maps/api";
import checkSessionAndRedirect from "../SessionCheck";

const CustomBox = styled(Box)(({ theme }) => ({
  position: "relative",
  cursor: "pointer",
  overflow: "hidden",
  width: 700,
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

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& + .pac-container": {
    zIndex: `${theme.zIndex.modal + 1} !important`,
  },
  "& .cursorElement": {
    zIndex: `${theme.zIndex.modal + 2} !important`,
    cursor: "pointer",
  },
}));

const ConfirmBooking = () => {
  const { originalFlightSearch } = useContext(SearchContext);
  const [countryData, setCountryData] = useState(null);
  const [departureFlight, setDepartureFlight] = useState(null);
  const [returnFlight, setReturnFlight] = useState(null);
  const [departureFlightData, setDepartureFlightData] = useState(null);
  const [returnFlightData, setReturnFlightData] = useState(null);
  const [departureBundleData, setDepartureBundleData] = useState(null);
  const [returnBundleData, setReturnBundleData] = useState(null);
  const [airportNameData, setAirportNameData] = useState(null);
  const [airportData, setAirportData] = useState(null);
  const [transportData, setTransportData] = useState(null);

  const [departureDetailsOpen, setDepartureDetailsOpen] = useState(false);
  const [returnDetailsOpen, setReturnDetailsOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [flightFare, setFlightFare] = useState(0);
  const [baggageFare, setBaggageFare] = useState(0);
  const [passengerData, setPassengerData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [emergencyData, setEmergencyData] = useState(null);
  const [mealData, setMealData] = useState(null);

  const [showDailog, setShowDialog] = useState(false);
  const [hover, setHover] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState("");
  const [isTransportButtonClicked, setIsTransportButtonClicked] =
    useState(false);

  const [isTransportChecked, setIsTransportChecked] = useState(false);
  const [isTransportReturnChecked, setIsTransportReturnChecked] =
    useState(false);
  const [isTransportConfirm, setIsTransportConfirm] = useState(false);
  const [open, setOpen] = useState(false);

  const [openPassenger, setOpenPassenger] = useState({});

  const [address, setAddress] = useState("");
  const [no, setNo] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [state, setState] = useState("");
  const [transportPrice, setTransportPrice] = useState("");

  const libraries = ["places"];
  const randomKey = Math.random().toString();

  const handleEditPersonalInfo = (passengerKey) => {
    navigate("/InsertPassengerInfomation");
    sessionStorage.setItem("formMode", "edit");
    sessionStorage.setItem("passengerKey", passengerKey);
  };

  const handlePassengerClick = (key) => {
    setOpenPassenger((prevState) => ({ ...prevState, [key]: !prevState[key] }));
  };

  const handleOpenDialog = () => {
    setShowDialog(true);
  };
  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    checkSessionAndRedirect(navigate, "searchFlight", "/");
  }, []);

  dayjs.extend(customParseFormat);

  let formatTimeToHoursMinutes = (timeString) => {
    let time = dayjs(timeString, "HH:mm:ss");
    let hours = time.format("HH");
    let minutes = time.format("mm");

    return `${hours} hrs ${minutes} mins`;
  };

  const fetchFlightData = async (id) => {
    const flightData = await getFlightById(id);
    return flightData;
  };

  const fetchMealData = async () => {
    const mealData = await getMealList();
    setMealData(mealData);
  };

  const fetchBundleData = async (id) => {
    const bundleData = await getBundleById(id);
    return bundleData;
  };

  const fetchCountryData = async () => {
    const countryData = await getCountryList();
    setCountryData(countryData);
  };

  const fetchAirportDataName = async () => {
    const airportDataName = await getAirportNameList();
    setAirportNameData(airportDataName);
  };

  const fetchAirportData = async () => {
    const airportData = await getAirports();
    setAirportData(airportData);
  };

  const fetchSelectedBaggageData = async (id) => {
    const baggageData = await getBaggageById(id);
    return baggageData;
  };

  const fetechTransport = async () => {
    const transportData = await getAllTransports();
    setTransportData(transportData);
  };

  useEffect(() => {
    fetchAirportData();
    fetchAirportDataName();
    fetchCountryData();
    fetchMealData();
    fetechTransport();
  }, []);

  const handleCancle = () => {
    setSelectedTransport("");
    setTransportPrice("");
    setIsTransportReturnChecked(false);
    setIsTransportChecked(false);
    setIsTransportConfirm(false);
    sessionStorage.removeItem("transport");
    calculateAndLogPrice();
  };

  const handleTransportChange = (event) => {
    setSelectedTransport(event.target.value);
  };

  const handleCheckOut = () => {
    navigate("/CheckOut");
  };

  const handleClick = () => {
    setIsTransportButtonClicked(!isTransportButtonClicked);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCheckboxChange = (event) => {
    setIsTransportChecked(event.target.checked);
  };

  const handleReturnCheck = (event) => {
    const isChecked = event.target.checked;
    setIsTransportReturnChecked(isChecked);

    let transportData = sessionStorage.getItem("transport");
    if (transportData) {
      transportData = JSON.parse(transportData);
    }

    if (isChecked) {
      transportData = { ...transportData, isTransportReturnChecked: 1 };
    } else {
      if (transportData) delete transportData.isTransportReturnChecked;
    }

    sessionStorage.setItem("transport", JSON.stringify(transportData));
  };

  const handleConfirm = () => {
    const formData = {
      no: no,
      address: address,
      city: city,
      postalCode: postalCode,
      state: state,
      transportId: selectedTransport,
    };

    sessionStorage.setItem("transport", JSON.stringify(formData));

    handleClose();
    calculateAndLogPrice();
    setIsTransportConfirm(true);
  };

  const calculateAndLogPrice = async () => {
    const departureFlight = JSON.parse(
      sessionStorage.getItem("departureFlight")
    );
    const returnFlight = JSON.parse(sessionStorage.getItem("returnFlight"));

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

    let price = await fetchTotalPrice(flightDetails, passengerDetails);

    setFlightFare(price);

    const passengerData = JSON.parse(sessionStorage.getItem("passenger"));
    let baggageFare = 0;
    for (let passengerKey in passengerData) {
      const passenger = passengerData[passengerKey];

      if (passenger.departureBaggageId) {
        const departureBaggageData = await fetchSelectedBaggageData(
          passenger.departureBaggageId
        );
        const departflightData = await fetchFlightData(departureFlight.id);
        if (departureBaggageData && departflightData?.flight_type === 0) {
          price += departureBaggageData?.domesticPrice;
          baggageFare += departureBaggageData?.domesticPrice;
        } else {
          price += departureBaggageData?.internationalPrice;
          baggageFare += departureBaggageData?.internationalPrice;
        }
      }

      if (returnFlight && passenger.returnBaggageId) {
        const returnBaggageData = await fetchSelectedBaggageData(
          passenger.returnBaggageId
        );
        const returnflightData = await fetchFlightData(returnFlight.id);
        if (returnBaggageData && returnflightData?.flight_type === 0) {
          price += returnBaggageData?.domesticPrice;
          baggageFare += returnBaggageData?.domesticPrice;
        } else {
          price += returnBaggageData?.internationalPrice;
          baggageFare += returnBaggageData?.internationalPrice;
        }
      }
    }

    const selectedTransport = JSON.parse(sessionStorage.getItem("transport"));
    if (selectedTransport && transportData) {
      const selectedTransportData = transportData.find(
        (transport) => transport.id === selectedTransport?.transportId
      );

      if (selectedTransportData) {
        let transportPrice = selectedTransportData.price;

        if (
          isTransportReturnChecked ||
          selectedTransport?.isTransportReturnChecked === 1
        ) {
          transportPrice *= 2;
          setIsTransportReturnChecked(true);
        }

        price += transportPrice;
        setTransportPrice(transportPrice);
        setSelectedTransport(selectedTransportData.id);
        setIsTransportConfirm(true);
        setIsTransportChecked(true);
      }
    }

    setBaggageFare(baggageFare);
    setTotalPrice(price);
  };

  useEffect(() => {
    calculateAndLogPrice();
  });

  const fetchTotalPrice = async (flightDetails, passengerDetails) => {
    const totalPrice = await calculatePrice(flightDetails, passengerDetails);
    return totalPrice;
  };

  useEffect(() => {
    const fetchData = async () => {
      const departureFlight = JSON.parse(
        sessionStorage.getItem("departureFlight")
      );
      setDepartureFlight(departureFlight);
      const returnFlight = JSON.parse(sessionStorage.getItem("returnFlight"));
      setReturnFlight(returnFlight);

      if (departureFlight) {
        try {
          const depFlightData = await fetchFlightData(departureFlight.id);
          setDepartureFlightData(depFlightData);
        } catch (error) {
          console.error("Failed to fetch departure flight data:", error);
        }
      }

      if (departureFlight) {
        try {
          const depBundleData = await fetchBundleData(departureFlight.bundleId);
          setDepartureBundleData(depBundleData);
        } catch (error) {
          console.error("Failed to fetch departure flight data:", error);
        }
      }

      if (returnFlight) {
        try {
          const retFlightData = await fetchFlightData(returnFlight.id);
          setReturnFlightData(retFlightData);
        } catch (error) {
          console.error("Failed to fetch return flight data:", error);
        }
      }

      if (returnFlight) {
        try {
          const retBundleData = await fetchBundleData(returnFlight.bundleId);
          setReturnBundleData(retBundleData);
        } catch (error) {
          console.error("Failed to fetch return flight data:", error);
        }
      }
    };

    fetchData();
  }, []);

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
          departbaggageData = await fetchSelectedBaggageData(departbaggageId);
        }

        let returnbaggageData;
        if (returnBaggageId !== undefined) {
          returnbaggageData = await fetchSelectedBaggageData(returnBaggageId);
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

      setPassengerData(allPassengersData);
    };

    fetchAllDeparturePassengersData();
    setContactData(JSON.parse(sessionStorage.getItem("contactInfo")));
    setEmergencyData(JSON.parse(sessionStorage.getItem("emergencyInfo")));
  }, []);

  const searchBox = useRef(null);
  const [center, setCenter] = useState({ lat: 2.7542, lng: 101.7043 });
  const [zoom, setZoom] = useState(14);
  const [markers, setMarkers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const isWithinKlangValley = (lat, lng) => {
    const bounds = {
      north: 3.2747,
      south: 2.8966,
      east: 101.8352,
      west: 101.3623,
    };

    return (
      lat > bounds.south &&
      lat < bounds.north &&
      lng > bounds.west &&
      lng < bounds.east
    );
  };

  const onPlacesChanged = () => {
    if (
      searchBox.current &&
      typeof searchBox.current.getPlaces === "function"
    ) {
      const places = searchBox.current.getPlaces();
      console.log(places);
      if (!places || places.length === 0) return;

      const selectedPlace = places[0];
      if (selectedPlace) {
        const address = selectedPlace.formatted_address;

        const location = selectedPlace.geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        if (!isWithinKlangValley(lat, lng)) {
          setErrorMessage(
            "Selected address is outside of Klang Valley. Please select a valid address."
          );
          setSearchAddress("");
          return;
        } else {
          setSearchAddress(address);
          setErrorMessage("");
        }

        setSearchAddress(address);
        setAddress(address);
        setCenter({
          lat: location.lat(),
          lng: location.lng(),
        });
        setZoom(18);
        setMarkers([{ lat: location.lat(), lng: location.lng() }]);

        const components = selectedPlace.address_components;
        for (let i = 0; i < components.length; i++) {
          const component = components[i];

          if (component.types.includes("locality")) {
            setCity(component.long_name);
          } else if (component.types.includes("postal_code")) {
            setPostalCode(component.long_name);
          } else if (component.types.includes("administrative_area_level_1")) {
            setState(component.long_name);
          }
        }
      }
    }
  };

  let depDepartureAirport = airportNameData?.find(
    (airport) => airport.code === departureFlightData?.departure_airport
  );

  let depDepartureAirportMunicipal = airportData?.find(
    (airport) => airport.code === departureFlightData?.departure_airport
  );

  let depArrivalAirport = airportNameData?.find(
    (airport) => airport.code === departureFlightData?.arrival_airport
  );

  let depArrivalAirportMunicipal = airportData?.find(
    (airport) => airport.code === departureFlightData?.arrival_airport
  );

  let departurePrice;

  if (originalFlightSearch?.flightClass === "Economy") {
    departurePrice = departureFlightData?.economy_price;
  } else {
    departurePrice = departureFlightData?.business_price;
  }

  let retDepartureAirport = airportNameData?.find(
    (airport) => airport.code === returnFlightData?.departure_airport
  );

  let retDepartureAirportMunicipal = airportData?.find(
    (airport) => airport.code === returnFlightData?.departure_airport
  );

  let retArrivalAirport = airportNameData?.find(
    (airport) => airport.code === returnFlightData?.arrival_airport
  );

  let retArrivalAirportMunicipal = airportData?.find(
    (airport) => airport.code === returnFlightData?.arrival_airport
  );

  let returnPrice;

  if (originalFlightSearch?.flightClass === "Economy") {
    returnPrice = returnFlightData?.economy_price;
  } else {
    returnPrice = returnFlightData?.business_price;
  }

  return (
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
          activeStep={5}
          tripType={originalFlightSearch?.tripType}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mt: 2,
        }}
      >
        <Typography variant="h3">Your Flight Detials</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "row",
          alignItems: "start",
          width: "100%",
          boxSizing: "border-box",
          overflowX: "hidden",
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginRight: 5,
            flex: "3 1 0%",
            boxSizing: "border-box",
          }}
        >
          <>
            <Paper
              sx={{
                p: 3,
                mt: 2,
                width: "100%",
                borderRadius: "30px",
                boxSizing: "border-box",
              }}
              elevation={0}
              variant="outlined"
              display="flex"
            >
              <Stack>
                <Typography variant="h3" textAlign={"left"}>
                  <FlightTakeoffOutlinedIcon /> Departure Flight
                </Typography>
                <Typography variant="h3" textAlign={"left"} sx={{ mt: 2 }}>
                  From {depDepartureAirportMunicipal?.name} to{" "}
                  {depArrivalAirportMunicipal?.name} (
                  {departureFlightData?.airplane_name})
                </Typography>
              </Stack>

              <Grid container spacing={1} sx={{ mt: 3 }}>
                <Grid container spacing={1}>
                  <Grid item xs={3} sx={{ mt: 3, textAlign: "center" }}>
                    <Typography variant="h5">
                      {dayjs(departureFlightData?.departure_time).format(
                        "DD MMM YYYY"
                      )}
                    </Typography>
                    <Typography variant="h2">
                      {dayjs(departureFlightData?.departure_time).format(
                        "HH:mm"
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={3} sx={{ mt: 3 }}>
                    <EastOutlinedIcon sx={{ mt: 2, fontSize: "2rem" }} />
                  </Grid>
                  <Grid item xs={3} sx={{ mt: 3, textAlign: "center" }}>
                    <Typography variant="h5">
                      {dayjs(departureFlightData?.arrival_time).format(
                        "DD MMM YYYY"
                      )}
                    </Typography>
                    <Typography variant="h2">
                      {dayjs(departureFlightData?.arrival_time).format("HH:mm")}
                    </Typography>
                  </Grid>
                  <Grid item xs={3} sx={{ mt: 3, textAlign: "center" }}>
                    <Typography variant="h6">
                      Duration:{" "}
                      {formatTimeToHoursMinutes(
                        departureFlightData?.duration_time
                      )}
                    </Typography>
                    <Typography variant="h6">Non-Stop</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  cursor: "pointer",
                }}
                onClick={() => setDepartureDetailsOpen(!departureDetailsOpen)}
              >
                <IconButton
                  onClick={() => setDepartureDetailsOpen(!departureDetailsOpen)}
                >
                  {departureDetailsOpen ? (
                    <ExpandLessOutlinedIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>
              <Collapse in={departureDetailsOpen}>
                <Box sx={{ p: 2, mt: 1 }} elevation={0} display="flex">
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="h4">Itinerary details</Typography>
                      <Grid
                        container
                        spacing={1}
                        display="flex"
                        justifyContent={"flex-start"}
                      >
                        <Grid item xs={4} sx={{ mt: 2, textAlign: "center" }}>
                          <Typography variant="h3" sx={{ mt: 2 }}>
                            {dayjs(departureFlightData?.departure_time).format(
                              "HH:mm"
                            )}
                          </Typography>
                          <Typography variant="h6" sx={{ color: "grey" }}>
                            {dayjs(departureFlightData?.departure_time).format(
                              "DD MMM"
                            )}
                          </Typography>

                          <Typography
                            variant="h6"
                            sx={{ color: "grey", mt: 5 }}
                          >
                            {formatTimeToHoursMinutes(
                              departureFlightData?.duration_time
                            )}
                          </Typography>
                          <Typography variant="h3" sx={{ mt: 5 }}>
                            {dayjs(departureFlightData?.arrival_time).format(
                              "HH:mm"
                            )}
                          </Typography>
                          <Typography variant="h6" sx={{ color: "grey" }}>
                            {dayjs(departureFlightData?.arrival_time).format(
                              "DD MMM"
                            )}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{ mt: 2, mr: 2, textAlign: "left" }}
                        >
                          <FlightOutlinedIcon sx={{ mt: 3 }} />

                          <Box
                            sx={{
                              ml: 1,
                              height: "100px",
                              width: "1px",
                              bgcolor: "white",
                              my: "10px",
                            }}
                          />
                          <LocationOnOutlinedIcon />
                        </Grid>
                        <Grid
                          item
                          xs={5}
                          sx={{ mt: 2, textAlign: "left", pl: 1 }}
                        >
                          <Typography variant="h3" sx={{ mt: 2 }}>
                            {depDepartureAirportMunicipal?.name}
                          </Typography>
                          <Typography variant="h5" sx={{ color: "grey" }}>
                            {depDepartureAirport?.name}
                          </Typography>
                          <Card sx={{ p: 1, mt: 4 }}>
                            <Typography variant="h5" sx={{ color: "grey" }}>
                              Flight: SkyWings{" "}
                              {departureFlightData?.airplane_name}
                            </Typography>
                          </Card>
                          <Typography variant="h3" sx={{ mt: 4 }}>
                            {depArrivalAirportMunicipal?.name}
                          </Typography>
                          <Typography variant="h5" sx={{ color: "grey" }}>
                            {depArrivalAirport?.name}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h4">Your Fare</Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                          <Typography variant="h4" sx={{ mt: 2 }}>
                            {departureBundleData?.name}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Stack>
                            <Stack
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                mt: 3,
                              }}
                            >
                              <WorkOutlineOutlinedIcon
                                sx={{ fontSize: "25px" }}
                              />
                              <Typography
                                variant="h5"
                                sx={{
                                  ml: 2,
                                  color:
                                    departureBundleData?.cabinBaggage === 0
                                      ? "grey"
                                      : "inherit",
                                }}
                              >
                                {" "}
                                7 kg Cabin Baggage
                              </Typography>
                            </Stack>
                            {departureBundleData &&
                              (departureBundleData.checkinBaggage20 > 0 ||
                                departureBundleData.checkinBaggage30 > 0 ||
                                departureBundleData.checkinBaggage40 > 0) && (
                                <Stack
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    mt: 2,
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <LuggageOutlinedIcon
                                    sx={{ fontSize: "25px" }}
                                  />
                                  <Typography
                                    variant="h5"
                                    sx={{
                                      ml: 2,
                                    }}
                                  >
                                    {departureBundleData.checkinBaggage20 > 0
                                      ? 20
                                      : departureBundleData.checkinBaggage40 > 0
                                      ? 40
                                      : 30}
                                    kg Check-in Baggage
                                  </Typography>
                                </Stack>
                              )}
                            {departureBundleData &&
                              departureBundleData?.freeMeal !== 0 && (
                                <Stack
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    mt: 2,
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <LocalDiningOutlinedIcon
                                    sx={{ fontSize: "25px" }}
                                  />
                                  <Typography
                                    variant="h5"
                                    sx={{
                                      ml: 2,
                                    }}
                                  >
                                    {" "}
                                    1 Free Meal
                                  </Typography>
                                </Stack>
                              )}
                            <Stack
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                mt: 2,
                                justifyContent: "flex-start",
                              }}
                            >
                              <AirlineSeatReclineExtraOutlinedIcon
                                sx={{ fontSize: "25px" }}
                              />
                              <Typography variant="h5" sx={{ ml: 2 }}>
                                Free Seat Selection
                              </Typography>
                            </Stack>

                            {departureBundleData &&
                              departureBundleData?.prioCheckIn !== 0 && (
                                <Stack
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    mt: 2,
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <FactCheckOutlinedIcon
                                    sx={{ fontSize: "25px" }}
                                  />
                                  <Typography
                                    variant="h5"
                                    sx={{
                                      ml: 2,
                                    }}
                                  >
                                    {" "}
                                    Prio Check-In
                                  </Typography>
                                </Stack>
                              )}

                            {departureBundleData &&
                              departureBundleData?.prioBoarding !== 0 && (
                                <Stack
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    mt: 2,
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <AirplaneTicketOutlinedIcon
                                    sx={{ fontSize: "25px" }}
                                  />
                                  <Typography
                                    variant="h5"
                                    sx={{
                                      ml: 2,
                                      color:
                                        departureBundleData?.prioBoarding === 0
                                          ? "grey"
                                          : "inherit",
                                    }}
                                  >
                                    {" "}
                                    Prio Boarding
                                  </Typography>
                                </Stack>
                              )}
                            {departureBundleData &&
                              departureBundleData?.loungeAccess !== 0 && (
                                <Stack
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    mt: 2,
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <LocalBarOutlinedIcon
                                    sx={{ fontSize: "25px" }}
                                  />
                                  <Typography
                                    variant="h5"
                                    sx={{
                                      ml: 2,
                                      color:
                                        departureBundleData?.loungeAccess === 0
                                          ? "grey"
                                          : "inherit",
                                    }}
                                  >
                                    {" "}
                                    Lounge Access
                                  </Typography>
                                </Stack>
                              )}
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </Paper>

            {returnFlight && returnFlightData && (
              <Paper
                sx={{
                  p: 3,
                  mt: 2,
                  width: "100%",
                  borderRadius: "30px",
                  boxSizing: "border-box",
                }}
                elevation={0}
                variant="outlined"
                display="flex"
              >
                <Stack>
                  <Typography variant="h3" textAlign={"left"}>
                    <FlightLandOutlinedIcon /> Return Flight
                  </Typography>
                  <Typography variant="h3" textAlign={"left"} sx={{ mt: 2 }}>
                    From {retDepartureAirportMunicipal?.name} to{" "}
                    {retArrivalAirportMunicipal?.name} (
                    {returnFlightData?.airplane_name})
                  </Typography>
                </Stack>

                <Grid container spacing={1} sx={{ mt: 3 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={3} sx={{ mt: 3, textAlign: "center" }}>
                      <Typography variant="h5">
                        {dayjs(returnFlightData?.departure_time).format(
                          "DD MMM YYYY"
                        )}
                      </Typography>
                      <Typography variant="h2">
                        {dayjs(returnFlightData?.departure_time).format(
                          "HH:mm"
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} sx={{ mt: 3 }}>
                      <EastOutlinedIcon sx={{ mt: 2, fontSize: "2rem" }} />
                    </Grid>
                    <Grid item xs={3} sx={{ mt: 3, textAlign: "center" }}>
                      <Typography variant="h5">
                        {dayjs(returnFlightData?.arrival_time).format(
                          "DD MMM YYYY"
                        )}
                      </Typography>
                      <Typography variant="h2">
                        {dayjs(returnFlightData?.arrival_time).format("HH:mm")}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} sx={{ mt: 3, textAlign: "center" }}>
                      <Typography variant="h6">
                        Duration:{" "}
                        {formatTimeToHoursMinutes(
                          returnFlightData?.duration_time
                        )}
                      </Typography>
                      <Typography variant="h6">Non-Stop</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    cursor: "pointer",
                  }}
                  onClick={() => setReturnDetailsOpen(!returnDetailsOpen)}
                >
                  <IconButton
                    onClick={() => setReturnDetailsOpen(!returnDetailsOpen)}
                  >
                    {returnDetailsOpen ? (
                      <ExpandLessOutlinedIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </Box>
                <Collapse in={returnDetailsOpen}>
                  <Box sx={{ p: 2, mt: 1 }} elevation={0} display="flex">
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="h4">Itinerary details</Typography>
                        <Grid
                          container
                          spacing={1}
                          display="flex"
                          justifyContent={"flex-start"}
                        >
                          <Grid item xs={4} sx={{ mt: 2, textAlign: "center" }}>
                            <Typography variant="h3" sx={{ mt: 2 }}>
                              {dayjs(returnFlightData?.departure_time).format(
                                "HH:mm"
                              )}
                            </Typography>
                            <Typography variant="h6" sx={{ color: "grey" }}>
                              {dayjs(returnFlightData?.departure_time).format(
                                "DD MMM"
                              )}
                            </Typography>

                            <Typography
                              variant="h6"
                              sx={{ color: "grey", mt: 5 }}
                            >
                              {formatTimeToHoursMinutes(
                                returnFlightData?.duration_time
                              )}
                            </Typography>
                            <Typography variant="h3" sx={{ mt: 5 }}>
                              {dayjs(returnFlightData?.arrival_time).format(
                                "HH:mm"
                              )}
                            </Typography>
                            <Typography variant="h6" sx={{ color: "grey" }}>
                              {dayjs(returnFlightData?.arrival_time).format(
                                "DD MMM"
                              )}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={1}
                            sx={{ mt: 2, mr: 2, textAlign: "left" }}
                          >
                            <FlightOutlinedIcon sx={{ mt: 3 }} />

                            <Box
                              sx={{
                                ml: 1,
                                height: "100px",
                                width: "1px",
                                bgcolor: "white",
                                my: "10px",
                              }}
                            />
                            <LocationOnOutlinedIcon />
                          </Grid>
                          <Grid
                            item
                            xs={5}
                            sx={{ mt: 2, textAlign: "left", pl: 1 }}
                          >
                            <Typography variant="h3" sx={{ mt: 2 }}>
                              {retDepartureAirportMunicipal?.name}
                            </Typography>
                            <Typography variant="h5" sx={{ color: "grey" }}>
                              {retDepartureAirport?.name}
                            </Typography>
                            <Card sx={{ p: 1, mt: 4 }}>
                              <Typography variant="h5" sx={{ color: "grey" }}>
                                Flight: SkyWings{" "}
                                {returnFlightData?.airplane_name}
                              </Typography>
                            </Card>
                            <Typography variant="h3" sx={{ mt: 4 }}>
                              {retArrivalAirportMunicipal?.name}
                            </Typography>
                            <Typography variant="h5" sx={{ color: "grey" }}>
                              {retArrivalAirport?.name}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h4">Your Fare</Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sx={{ textAlign: "center" }}>
                            <Typography variant="h4" sx={{ mt: 2 }}>
                              {returnBundleData?.name}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <Stack>
                              <Stack
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                  mt: 3,
                                }}
                              >
                                <WorkOutlineOutlinedIcon
                                  sx={{ fontSize: "25px" }}
                                />
                                <Typography
                                  variant="h5"
                                  sx={{
                                    ml: 2,
                                    color:
                                      returnBundleData?.cabinBaggage === 0
                                        ? "grey"
                                        : "inherit",
                                  }}
                                >
                                  {" "}
                                  7 kg Cabin Baggage
                                </Typography>
                              </Stack>
                              {returnBundleData &&
                                (returnBundleData.checkinBaggage20 > 0 ||
                                  returnBundleData.checkinBaggage30 > 0 ||
                                  returnBundleData.checkinBaggage40 > 0) && (
                                  <Stack
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      mt: 2,
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <LuggageOutlinedIcon
                                      sx={{ fontSize: "25px" }}
                                    />
                                    <Typography
                                      variant="h5"
                                      sx={{
                                        ml: 2,
                                      }}
                                    >
                                      {returnBundleData.checkinBaggage20 > 0
                                        ? 20
                                        : returnBundleData.checkinBaggage40 > 0
                                        ? 40
                                        : 30}
                                      kg Check-in Baggage
                                    </Typography>
                                  </Stack>
                                )}

                              {returnBundleData &&
                                returnBundleData?.freeMeal !== 0 && (
                                  <Stack
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      mt: 2,
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <LocalDiningOutlinedIcon
                                      sx={{ fontSize: "25px" }}
                                    />
                                    <Typography
                                      variant="h5"
                                      sx={{
                                        ml: 2,
                                      }}
                                    >
                                      {" "}
                                      1 Free Meal
                                    </Typography>
                                  </Stack>
                                )}
                              <Stack
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  mt: 2,
                                  justifyContent: "flex-start",
                                }}
                              >
                                <AirlineSeatReclineExtraOutlinedIcon
                                  sx={{ fontSize: "25px" }}
                                />
                                <Typography variant="h5" sx={{ ml: 2 }}>
                                  Free Seat Selection
                                </Typography>
                              </Stack>

                              {returnBundleData &&
                                returnBundleData?.prioCheckIn !== 0 && (
                                  <Stack
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      mt: 2,
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <FactCheckOutlinedIcon
                                      sx={{ fontSize: "25px" }}
                                    />
                                    <Typography
                                      variant="h5"
                                      sx={{
                                        ml: 2,
                                      }}
                                    >
                                      Prio Check-In
                                    </Typography>
                                  </Stack>
                                )}

                              {returnBundleData &&
                                returnBundleData?.prioBoarding !== 0 && (
                                  <Stack
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      mt: 2,
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <AirplaneTicketOutlinedIcon
                                      sx={{ fontSize: "25px" }}
                                    />
                                    <Typography
                                      variant="h5"
                                      sx={{
                                        ml: 2,
                                      }}
                                    >
                                      Prio Boarding
                                    </Typography>
                                  </Stack>
                                )}
                              {returnBundleData &&
                                returnBundleData?.loungeAccess !== 0 && (
                                  <Stack
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      mt: 2,
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <LocalBarOutlinedIcon
                                      sx={{ fontSize: "25px" }}
                                    />
                                    <Typography
                                      variant="h5"
                                      sx={{
                                        ml: 2,
                                      }}
                                    >
                                      {" "}
                                      Lounge Access
                                    </Typography>
                                  </Stack>
                                )}
                            </Stack>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Collapse>
              </Paper>
            )}
          </>

          <Box>
            {passengerData &&
              passengerData.map((passenger, i) => {
                if (contactData && emergencyData) {
                  const contact = countryData?.find(
                    (country) => country?.code === contactData?.phoneCode
                  );
                  const emergency = countryData?.find(
                    (country) =>
                      country?.code === emergencyData?.emergencyPhoneCode
                  );

                  const deaprtMeal = mealData?.find(
                    (meal) => meal?.id === passenger?.departureMealId
                  );

                  let departureKg = 0;
                  if (departureBundleData?.checkinBaggage20 === 1) {
                    departureKg = 20;
                  } else if (departureBundleData?.checkinBaggage30 === 1) {
                    departureKg = 30;
                  } else if (departureBundleData?.checkinBaggage40 === 1) {
                    departureKg = 40;
                  }

                  let returnKg = 0;
                  let retpassengerKg = 0;
                  if (
                    returnBundleData !== null &&
                    returnBundleData !== undefined
                  ) {
                    if (returnBundleData?.checkinBaggage20 === 1) {
                      returnKg = 20;
                    } else if (returnBundleData?.checkinBaggage30 === 1) {
                      returnKg = 30;
                    } else if (returnBundleData?.checkinBaggage40 === 1) {
                      returnKg = 40;
                    }

                    retpassengerKg = passenger?.returnBaggageData
                      ? parseInt(passenger?.returnBaggageData?.kg)
                      : 0;
                  }

                  let passengerKg = passenger?.departbaggageData
                    ? parseInt(passenger?.departbaggageData?.kg)
                    : 0;

                  let baggageKg = departureKg + passengerKg;
                  let returnbaggageKg = returnKg + retpassengerKg;

                  return (
                    <>
                      <Card
                        sx={{ mt: 2, p: 3, borderRadius: "25px" }}
                        variant="outlined"
                      >
                        <Grid container spacing={1} key={i}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              width: "100%",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handlePassengerClick(`passenger${i}`)
                            }
                          >
                            <Grid container sx={{ p: 1 }}>
                              <Grid item md={10}>
                                <Typography variant="h3">
                                  {passenger.selectedTitle}
                                  {". "} {passenger.firstName}{" "}
                                  {passenger.lastName}
                                </Typography>
                              </Grid>
                            </Grid>

                            <IconButton>
                              {openPassenger[`passenger${i}`] ? (
                                <ExpandLessOutlinedIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                            </IconButton>
                          </Box>
                        </Grid>
                        <Collapse in={openPassenger[`passenger${i}`]}>
                          <Box sx={{ width: "100%" }}>
                            <Divider fullWidth />
                          </Box>
                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item md={12}>
                              <Typography variant="h3">
                                Flight Details
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: "left" }}>
                              <Typography variant="h3">
                                <FlightTakeoffOutlinedIcon /> Departure Flight
                              </Typography>
                              <Typography variant="h4" sx={{ mt: 2 }}>
                                {passenger?.key?.startsWith("Baby")
                                  ? null
                                  : "7 KG Cabin Baggage"}
                              </Typography>
                              <Typography variant="h4" sx={{ mt: 1 }}>
                                {passenger?.key?.startsWith("Baby")
                                  ? "10 KG Checked-In Baggage"
                                  : baggageKg === 0
                                  ? null
                                  : baggageKg + " KG Checked-In Baggage"}
                              </Typography>
                              <Typography variant="h4" sx={{ mt: 1 }}>
                                {deaprtMeal?.name}
                              </Typography>
                              <Typography variant="h4" sx={{ mt: 1 }}>
                                {passenger?.departureSeat?.modifiedRowIndex}{" "}
                                {passenger?.departureSeat?.seatAlphabet}
                              </Typography>
                            </Grid>
                            {returnFlightData && returnBundleData && (
                              <Grid item md={6} sx={{ textAlign: "left" }}>
                                <Typography variant="h3">
                                  <FlightLandOutlinedIcon /> Return Flight
                                </Typography>
                                <Typography variant="h4" sx={{ mt: 2 }}>
                                  {passenger?.key?.startsWith("Baby")
                                    ? null
                                    : "7 KG Cabin Baggage"}
                                </Typography>
                                <Typography variant="h4" sx={{ mt: 1 }}>
                                  {passenger?.key.startsWith("Baby")
                                    ? "10 KG Checked-In Baggage"
                                    : returnbaggageKg === 0
                                    ? null
                                    : returnbaggageKg +
                                      " KG Checked-In Baggage"}
                                </Typography>
                                <Typography variant="h4" sx={{ mt: 1 }}>
                                  {deaprtMeal?.name}
                                </Typography>
                                <Typography variant="h4" sx={{ mt: 1 }}>
                                  {passenger?.returnSeat?.modifiedRowIndex}{" "}
                                  {passenger?.returnSeat?.seatAlphabet}
                                </Typography>
                              </Grid>
                            )}
                          </Grid>
                          <Box sx={{ width: "100%", mt: 2 }}>
                            <Divider fullWidth />
                          </Box>

                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item md={6}>
                              <Typography variant="h3">
                                Passenger Information
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              md={6}
                              sx={{
                                display: "fkex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Tooltip
                                title={
                                  <Typography variant="h5">
                                    Edit Passenger
                                  </Typography>
                                }
                                placement="top"
                              >
                                <IconButton
                                  onClick={() => {
                                    handleEditPersonalInfo(passenger.key);
                                  }}
                                >
                                  <EditRoundedIcon />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            <Grid item md={4}>
                              <Typography variant="h3">
                                <PersonIcon />
                                Personal Information
                              </Typography>
                              <Typography variant="h4" sx={{ mt: 2 }}>
                                {passenger.selectedTitle}
                                {". "} {passenger.firstName}{" "}
                                {passenger.lastName}
                              </Typography>
                              <Typography variant="h4">
                                {dayjs(passenger.birthDate).format(
                                  "DD/MM/YYYY"
                                )}
                              </Typography>
                            </Grid>

                            {passenger?.key.startsWith("Adult1") && (
                              <>
                                <Grid item xs={4} sx={{ textAlign: "left" }}>
                                  <Typography variant="h3">
                                    Contact Information
                                  </Typography>
                                  <Typography variant="h4">Email</Typography>
                                  <Typography variant="h5">
                                    {contactData?.confirmEmail}
                                  </Typography>
                                  <Typography variant="h4">Phone</Typography>
                                  <Typography variant="h5">
                                    {"+"}
                                    {contact?.phone} {contactData.phoneNumber}
                                  </Typography>
                                </Grid>
                                <Grid item md={4} sx={{ textAlign: "left" }}>
                                  <Typography variant="h3">
                                    Emergency Information
                                  </Typography>
                                  <Typography variant="h4">Name</Typography>
                                  <Typography variant="h5">
                                    {emergencyData.emergencyName}
                                  </Typography>
                                  <Typography variant="h4">Phone</Typography>
                                  <Typography variant="h5">
                                    {"+"}
                                    {emergency?.phone}{" "}
                                    {emergencyData.emergencyPhoneNumber}
                                  </Typography>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </Collapse>
                      </Card>
                    </>
                  );
                }
              })}
          </Box>
        </Box>
        <Box
          sx={{
            flex: "1 1 0%",
            boxSizing: "border-box",
          }}
        >
          <Paper
            sx={{
              p: 3,
              mt: 2,
              width: "100%",
              borderRadius: "30px",
              boxSizing: "border-box",
              height: "100%",
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
                <Typography variant="h3" textAlign={"left"} sx={{ mt: 2 }}>
                  <FlightOutlinedIcon />
                  Flight Fare Total:
                </Typography>
                <Typography variant="h3" textAlign={"left"}>
                  <LuggageOutlinedIcon />
                  Baggage Fare Total:
                </Typography>
                {selectedTransport && transportPrice && isTransportChecked && (
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
                <Typography variant="h3" textAlign={"right"} sx={{ mt: 2 }}>
                  MYR {flightFare}
                </Typography>
                <Typography variant="h3" textAlign={"right"}>
                  MYR {baggageFare}
                </Typography>
                {selectedTransport && transportPrice && isTransportChecked && (
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
                        sx={{ display: "flex", justifyContent: "flex-end" }}
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
                  <Box display={"flex"} justifyContent={"flex-end"}>
                    <Button
                      variant="contained"
                      onClick={handleCheckOut}
                      disabled={open}
                      sx={{
                        mt: 2,
                        fontSize: "0.8rem",
                        borderRadius: "15px",
                        display: "flex",
                        justifyContent: "center",
                        mr: 2,
                      }}
                      size="large"
                    >
                      Check Out
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {depDepartureAirport?.code === "KUL" && (
            <Paper
              sx={{
                p: 3,
                mt: 2,
                width: "100%",
                borderRadius: "30px",
                boxSizing: "border-box",
                height: "100%",
              }}
              elevation={0}
              variant="outlined"
              display="flex"
            >
              <Grid container spacing={2}>
                <Grid item xs={1}>
                  <Checkbox
                    icon={<RadioButtonUncheckedOutlinedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    checked={isTransportChecked}
                    onChange={handleCheckboxChange}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.5rem",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={11} sx={{ mt: 1 }}>
                  <Typography variant="h4" textAlign={"left"}>
                    I Would like to have Transport Arrangement
                  </Typography>
                  <Typography
                    variant="h7"
                    textAlign={"left"}
                    style={{ color: "red" }}
                  >
                    *** Only Applicable for Klang Valley
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Typography variant="h4" textAlign={"center"}>
                    Choose Your Vehicle type
                  </Typography>
                </Grid>

                <Grid item xs={12} sx={{ mt: 1 }}>
                  <FormControl fullWidth disabled={!isTransportChecked}>
                    <InputLabel id="transport-select-label">
                      Transport
                    </InputLabel>
                    <Select
                      labelId="transport-select-label"
                      id="transport-select"
                      value={selectedTransport}
                      onChange={handleTransportChange}
                      sx={{ borderRadius: "15px" }}
                      readOnly={isTransportConfirm}
                    >
                      {transportData?.map((transport) => (
                        <MenuItem
                          value={transport.id}
                          key={transport.name}
                          sx={{ fontSize: "1rem" }}
                        >
                          <Grid container spacing={0}>
                            <Grid item xs={1}>
                              <ListItemIcon>
                                <DirectionsCarIcon />
                              </ListItemIcon>
                            </Grid>
                            <Grid item xs={2}>
                              {transport.name}
                            </Grid>
                            <Grid item xs={3}>
                              {transport.capacity} Passenger
                            </Grid>
                            <Grid item xs={3}>
                              {transport.luggage} Luggage
                            </Grid>
                            <Grid item xs={3}>
                              MYR {transport.price}
                            </Grid>
                          </Grid>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {isTransportConfirm && (
                  <Button
                    variant="contained"
                    color="red"
                    onClick={handleCancle}
                    sx={{
                      mt: 2,
                      fontSize: "0.8rem",
                      borderRadius: "15px",
                      display: "flex",
                      justifyContent: "center",
                      mr: 2,
                    }}
                    size="large"
                  >
                    Cancle
                  </Button>
                )}
                {!isTransportConfirm && (
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!selectedTransport || !isTransportChecked || open}
                    onClick={handleClick}
                    sx={{
                      mt: 2,
                      fontSize: "0.8rem",
                      borderRadius: "15px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                    size="large"
                  >
                    Confirm
                  </Button>
                )}
              </Box>
              {isTransportConfirm && returnFlightData && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={1}>
                    <Checkbox
                      icon={<RadioButtonUncheckedOutlinedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      checked={
                        isTransportConfirm
                          ? isTransportReturnChecked
                          : isTransportChecked
                      }
                      onChange={handleReturnCheck}
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: "1.5rem",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={11} sx={{ mt: 1 }}>
                    <Typography variant="h4" textAlign={"left"}>
                      Add On For My Return Flight As Well
                    </Typography>
                    <Typography
                      variant="h7"
                      textAlign={"left"}
                      style={{ color: "red" }}
                    ></Typography>
                  </Grid>
                </Grid>
              )}
            </Paper>
          )}

          {open && (
            <Paper
              sx={{
                p: 3,
                mt: 2,
                width: "100%",
                borderRadius: "30px",
                boxSizing: "border-box",
                height: "100%",
              }}
              elevation={0}
              variant="outlined"
              display="flex"
            >
              <Typography variant="h3">Pick Up Address</Typography>
              <Divider sx={{ mt: 2, mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item md={6}>
                  <Grid item md={12}>
                    <StandaloneSearchBox
                      onLoad={(ref) => (searchBox.current = ref)}
                      onPlacesChanged={onPlacesChanged}
                    >
                      <TextField
                        fullWidth
                        color="secondary"
                        variant="outlined"
                        name="searchAddress"
                        label="Search Address"
                        value={searchAddress}
                        onChange={(event) =>
                          setSearchAddress(event.target.value)
                        }
                        sx={{
                          mt: 2,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                          },
                        }}
                        required
                        error={!!errorMessage}
                        helperText={errorMessage}
                      />
                    </StandaloneSearchBox>

                    <TextField
                      name="no."
                      label="No."
                      variant="outlined"
                      required
                      value={no}
                      sx={{
                        mt: 1,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "20px",
                        },
                      }}
                      placeholder="e.g. No.18"
                      onChange={(event) => setNo(event.target.value)}
                    />

                    <TextField
                      fullWidth
                      color="secondary"
                      variant="outlined"
                      name="address"
                      label="Address"
                      placeholder="e.g. Jalan ABC"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      sx={{
                        mt: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "20px",
                        },
                      }}
                      required
                      disabled
                    />
                    <TextField
                      name="city"
                      label="City"
                      variant="outlined"
                      fullWidth
                      value={city}
                      required
                      sx={{
                        mt: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "20px",
                        },
                      }}
                      placeholder="e.g. Cheras"
                      onChange={(event) => setCity(event.target.value)}
                      disabled
                    />

                    <TextField
                      name="postalcode"
                      label="PostalCode"
                      variant="outlined"
                      fullWidth
                      required
                      value={postalCode}
                      sx={{
                        mt: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "20px",
                        },
                      }}
                      placeholder="e.g. 4100"
                      onChange={(event) => setPostalCode(event.target.value)}
                      disabled
                    />

                    <TextField
                      name="state"
                      label="State"
                      variant="outlined"
                      fullWidth
                      value={state}
                      required
                      sx={{
                        mt: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "20px",
                        },
                      }}
                      placeholder="e.g. Selangor"
                      onChange={(event) => setState(event.target.value)}
                      disabled
                    />
                  </Grid>
                </Grid>

                <Grid item md={6}>
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={center}
                    zoom={zoom}
                  >
                    {markers.map((marker, idx) => (
                      <Marker key={idx} position={marker} />
                    ))}
                  </GoogleMap>
                </Grid>
              </Grid>

              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirm}
                disabled={!searchAddress || !!errorMessage || !no}
                sx={{
                  mt: 2,
                  borderRadius: "15px",
                  display: "flex",
                  justifyContent: "center",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Confirm
              </Button>
            </Paper>
          )}
        </Box>
      </Box>

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
  );
};

export default ConfirmBooking;
