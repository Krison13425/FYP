import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
  renderTimeViewClock,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import {
  createFlight,
  getAirplanesListByAirport,
  getAirports,
  getFLightsList,
} from "../../api";
import Alert from "../Global/Alert";
import Dialog from "../Global/Dailog";
import Sidebar, { DrawerHeader, Main } from "../Sidebar";
import FlightTable from "./FlightTable";

const CreateFlight = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => {
    setOpenDialog(false);
    resetForm();
    setIsFormSubmitted(false);
  };
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [errors, setErrors] = useState({});

  const [flightDepartureAirport, setFlightepartureAirport] = useState("");
  const [flightArrivalAirport, setFlightArrivalAirport] = useState("");
  const [flightAirplane, setFlightAirplane] = useState("");
  const [flightDepartureDate, setFlightDepartureDate] = useState("");
  const [flightDepartureTime, setFlightDepartureTime] = useState("");
  const [flightEconomicPrice, setFlightEconomicPrice] = useState("");
  const [flightBusinessPrice, setFlightBusinessPrice] = useState("");

  const [airports, setAirports] = useState([]);
  const [airplanes, setAirplanes] = useState([]);

  const [flightData, setFlightData] = useState([]);
  const [newflightData, setNewFlightData] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const confirmDialogTimeout = useRef(null);

  useEffect(() => {
    if (openConfirmDialog) {
      confirmDialogTimeout.current = setTimeout(() => {
        setOpenConfirmDialog(false);
      }, 3000);
    } else {
      clearTimeout(confirmDialogTimeout.current);
    }
    return () => clearTimeout(confirmDialogTimeout.current);
  }, [openConfirmDialog]);

  const fetchAirports = async () => {
    try {
      const data = await getAirports();
      setAirports(data);
    } catch (error) {
      console.error("Failed to fetch airports:", error);
    }
  };

  const fetchAirplanes = async (departureAirport, arrivalAirport) => {
    try {
      const data = await getAirplanesListByAirport(
        departureAirport,
        arrivalAirport
      );
      setAirplanes(data);
    } catch (error) {
      console.error("Failed to fetch airports:", error);
    }
  };

  const fetchData = async () => {
    try {
      const data = await getFLightsList();
      setFlightData(data);
    } catch (error) {
      console.error("Failed to fetch airports:", error);
    }
  };

  useEffect(() => {
    fetchAirports();
    fetchData();
  }, []);

  useEffect(() => {
    if (flightDepartureAirport && flightArrivalAirport) {
      fetchAirplanes(flightDepartureAirport, flightArrivalAirport);
    }
  }, [flightDepartureAirport, flightArrivalAirport]);

  const resetForm = () => {
    setFlightDepartureDate("");
    setFlightDepartureTime("");
    setFlightepartureAirport("");
    setFlightArrivalAirport("");
    setFlightEconomicPrice("");
    setFlightBusinessPrice("");
    setFlightAirplane("");
  };

  const handleCancel = () => {
    setIsFormSubmitted(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    let errorMessages = {};
    if (!flightDepartureDate) {
      errorMessages.flightDepartureDate = "Departure date is required";
    } else if (flightDepartureDate.isBefore(new Date())) {
      errorMessages.flightDepartureDate =
        "Departure date cannot be in the past";
    }
    if (!flightDepartureTime) {
      errorMessages.flightDepartureTime = "Departure time is required";
    }

    if (flightDepartureAirport === flightArrivalAirport) {
      errorMessages.flightAirport =
        "Departure and Arrival airports cannot be the same";
    }

    if (parseFloat(flightEconomicPrice) > parseFloat(flightBusinessPrice)) {
      errorMessages.flightPrice =
        "Economy price cannot be larger than Business price";
    }

    if (Object.keys(errorMessages).length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...errorMessages,
      }));
      return;
    }

    const flight = {
      airline_id: "SK",
      airplane_id: flightAirplane,
      departure_airport: flightDepartureAirport,
      arrival_airport: flightArrivalAirport,
      departure_date: flightDepartureDate
        ? flightDepartureDate.format("YYYY-MM-DD")
        : null,
      departure_time: flightDepartureTime
        ? flightDepartureTime.format("HH:mm:ss")
        : null,
      economy_price: parseFloat(flightEconomicPrice),
      business_price: parseFloat(flightBusinessPrice),
    };

    setIsFormSubmitted(true);
    setOpenConfirmDialog(true);
    setNewFlightData(flight);
  };

  const handleConfirmCreate = async () => {
    setOpenConfirmDialog(false);

    try {
      const response = await createFlight(newflightData);
      setSnackbarMessage(response);
      setSnackbarSeverity("success");
      fetchData();
      resetForm();
      handleClose();
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Sidebar open={openSidebar} setOpen={setOpenSidebar} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Main open={openSidebar}>
          <DrawerHeader />
          <Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="h1" fontWeight="bold">
                Create Flight
              </Typography>
            </Box>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={handleOpen}
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                sx={{ mb: 1 }}
              >
                Add
              </Button>
            </Box>
            <Dialog
              open={openDialog}
              handleClose={handleClose}
              title="Add A New Flight"
              onSubmit={handleSubmit}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={1}>
                  <Grid item md={6}>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                      <Autocomplete
                        id="departure-airport"
                        options={airports}
                        getOptionLabel={(option) =>
                          `${option.code} - ${option.name}`
                        }
                        onChange={(event, newValue) => {
                          setFlightepartureAirport(newValue?.code);
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            flightAirport: null,
                          }));
                        }}
                        readOnly={isFormSubmitted}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Departure Airport"
                            variant="outlined"
                            required
                            error={!!errors.flightAirport}
                            helperText={errors.flightAirport}
                            disable={isFormSubmitted}
                          />
                        )}
                      />
                    </FormControl>
                    <DatePicker
                      label="Departure Date"
                      minDate={dayjs()}
                      onChange={(newValue) => {
                        setFlightDepartureDate(newValue);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          flightDepartureDate: null,
                        }));
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      sx={{ mt: 2, width: "100%" }}
                      readOnly={isFormSubmitted}
                    />
                    {errors.flightDepartureDate && (
                      <p style={{ color: "red" }}>
                        {errors.flightDepartureDate}
                      </p>
                    )}
                  </Grid>
                  <Grid item md={6}>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                      <Autocomplete
                        id="arrival-airport"
                        options={airports}
                        getOptionLabel={(option) =>
                          `${option.code} - ${option.name}`
                        }
                        onChange={(event, newValue) => {
                          setFlightArrivalAirport(newValue?.code);
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            flightAirport: null,
                          }));
                        }}
                        readOnly={isFormSubmitted}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Arrival Airport"
                            variant="outlined"
                            error={!!errors.flightAirport}
                            helperText={errors.flightAirport}
                            required
                          />
                        )}
                      />
                    </FormControl>

                    <TimePicker
                      label="Departure Time"
                      viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                      }}
                      onChange={(newValue) => {
                        setFlightDepartureTime(newValue);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          flightDepartureTime: null,
                        }));
                      }}
                      sx={{ mt: 2, width: "100%" }}
                      readOnly={isFormSubmitted}
                    />

                    {errors.flightDepartureTime && (
                      <p style={{ color: "red" }}>
                        {errors.flightDepartureTime}
                      </p>
                    )}
                  </Grid>
                  <Grid item md={3}>
                    <TextField
                      name="airline"
                      label="Airline"
                      variant="outlined"
                      fullWidth
                      required
                      sx={{ mt: 1 }}
                      defaultValue="SkyWings"
                      InputProps={{
                        disable: true,
                      }}
                    />
                  </Grid>
                  <Grid item md={3}>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                      <Autocomplete
                        id="airplanes"
                        options={airplanes}
                        getOptionLabel={(option) => `${option.name}`}
                        onChange={(event, newValue) =>
                          setFlightAirplane(newValue?.id)
                        }
                        readOnly={isFormSubmitted}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Airplane"
                            variant="outlined"
                            required
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3}>
                    <TextField
                      name="economy"
                      label="Economy Price"
                      variant="outlined"
                      type="number"
                      fullWidth
                      required
                      sx={{ mt: 1 }}
                      value={flightEconomicPrice}
                      onChange={(e) => {
                        setFlightEconomicPrice(e.target.value);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          flightPrice: null,
                        }));
                      }}
                      error={!!errors.flightPrice}
                      helperText={errors.flightPrice}
                      disabled={isFormSubmitted}
                      onKeyPress={(event) => {
                        const keyCode = event.which || event.keyCode;
                        const isValidKey = !(
                          keyCode !== 8 && // Allow backspace key
                          keyCode !== 9 &&
                          keyCode !== 46 &&
                          (keyCode < 48 || keyCode > 57)
                        );

                        if (!isValidKey) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item md={3}>
                    <TextField
                      name="business"
                      label="Business Price"
                      variant="outlined"
                      fullWidth
                      required
                      type="number"
                      sx={{ mt: 1 }}
                      value={flightBusinessPrice}
                      onChange={(e) => {
                        setFlightBusinessPrice(e.target.value);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          flightPrice: null,
                        }));
                      }}
                      error={!!errors.flightPrice}
                      helperText={errors.flightPrice}
                      disabled={isFormSubmitted}
                      onKeyPress={(event) => {
                        const keyCode = event.which || event.keyCode;
                        const isValidKey = !(
                          keyCode !== 8 &&
                          keyCode !== 9 &&
                          keyCode !== 46 &&
                          (keyCode < 48 || keyCode > 57)
                        );

                        if (!isValidKey) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                {isFormSubmitted ? (
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handleConfirmCreate}
                    sx={{ mr: 2 }}
                  >
                    Confirm
                  </Button>
                ) : (
                  <Button type="submit" variant="contained">
                    Add
                  </Button>
                )}
                {isFormSubmitted && (
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handleCancel}
                    color="error"
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Dialog>
            <FlightTable flights={flightData} />
            <Dialog
              open={openConfirmDialog}
              handleClose={() => setOpenConfirmDialog(false)}
              title="Confirm Create"
              onSubmit={handleConfirmCreate}
            >
              Please Confirm Your Aiport Data Before you Proceed the Create
              Process
            </Dialog>
            <Alert
              open={openSnackbar}
              setOpen={setOpenSnackbar}
              severity={snackbarSeverity}
              message={snackbarMessage}
            />
          </Box>
        </Main>
      </div>
    </>
  );
};

export default CreateFlight;
