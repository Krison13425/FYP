import {
  Box,
  Button,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  editFlightStatus,
  getFlightById,
  getTaodayFlightByStatus,
} from "../../api";
import Alert from "../Global/Alert";
import Dialog from "../Global/Dailog";
import Sidebar, { DrawerHeader, Main } from "../Sidebar";
import FlightTable from "./FlightTable";

const UpdateFlightStatus = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => {
    setOpenDialog(false);
    setSelectedFlight("");
    setNewFlightDepartureTime("");
    setErrors({ flightDepartureTime: null });
    setTimeChanged(false);
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [selectedFlight, setSelectedFlight] = useState("");
  const [flightData, setFlightData] = useState([]);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const handleConfirmOpen = () => setOpenConfirmDialog(true);
  const handleConfirmClose = () => setOpenConfirmDialog(false);

  const [newFlightDepartureTime, setNewFlightDepartureTime] = useState("");

  const [errors, setErrors] = useState({ flightDepartureTime: null });
  const [timeChanged, setTimeChanged] = useState(false);

  const [value, setValue] = useState(localStorage.getItem("tabValue") || "0");

  const handleChange = async (event, newValue) => {
    localStorage.setItem("tabValue", newValue);
    setValue(newValue);
    fetchFilteredFlights(newValue);
  };

  const handleUpdateClick = async (id, value) => {
    fetchSelectedFlightData(id);
    if (value === 4) {
      handleOpen();
    } else {
      handleConfirmOpen();
    }
  };

  const fetchFlightData = async () => {
    fetchFilteredFlights(localStorage.getItem("tabValue") || "0");
  };

  const fetchSelectedFlightData = async (id) => {
    const flightData = await getFlightById(id);
    setSelectedFlight(flightData);
  };

  const fetchFilteredFlights = async (flightStatus) => {
    try {
      const data = await getTaodayFlightByStatus(flightStatus);
      setFlightData(data);
    } catch (error) {
      console.error("Failed to fetch filtered flights:", error);
    }
  };

  useEffect(() => {
    fetchFlightData();
  }, [timeChanged]);

  const handleConfirmSubmit = async (e) => {
    let statusUpdate;
    handleConfirmClose();

    if (selectedFlight.flight_status === 1) {
      statusUpdate = 2;
    } else if (selectedFlight.flight_status === 2) {
      statusUpdate = 3;
    } else if (
      selectedFlight.flight_status === 0 ||
      selectedFlight.flight_status === 4
    ) {
      statusUpdate = 1;
    }

    if (statusUpdate) {
      await handleSubmit(selectedFlight.id, statusUpdate, "");
    }
  };

  const handleDelaySubmit = async (e) => {
    if (newFlightDepartureTime !== "") {
      await handleSubmit(selectedFlight.id, 4, newFlightDepartureTime);
    } else {
      console.log("Flight departure time is not set");
    }
  };
  const handleSubmit = async (id, flightStatus, flightDepartureTime) => {
    try {
      const response = await editFlightStatus(
        id,
        flightStatus,
        flightDepartureTime
      );
      setSnackbarMessage(response);
      setSnackbarSeverity("success");
      if (value) {
        fetchFilteredFlights(value);
      } else {
        fetchFlightData();
      }
      handleClose();
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  let delaytime;
  if (selectedFlight.is_delayed == 1) {
    delaytime = selectedFlight.delayed_departure_time;
  } else {
    delaytime = selectedFlight.departure_time;
  }

  return (
    <>
      <Sidebar open={openSidebar} setOpen={setOpenSidebar} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Main open={openSidebar}>
          <DrawerHeader />
          <Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="h1" fontWeight="bold">
                Update Flight Status
              </Typography>
            </Box>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                textColor="primary"
                indicatorColor="primary"
                aria-label="primary tabs example"
              >
                <Tab value={"0"} label="Booking Flights" />
                <Tab value={"4"} label="Delayed Flights" />
                <Tab value={"1"} label="Onboarding Flights" />
                <Tab value={"2"} label="Depatrured Flights" />
                <Tab value={"3"} label="Arrivial Flights" />
              </Tabs>
            </Box>
            <Dialog
              open={openDialog}
              handleClose={handleClose}
              title={"Set the Delay time "}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={1}>
                  <Grid item md={6}>
                    <TimePicker
                      label="Departure Time"
                      maxTime={dayjs(delaytime).add(1, "hour")}
                      value={dayjs(delaytime)}
                      onChange={(newValue) => {
                        if (newValue.isBefore(dayjs(delaytime))) {
                          console.log("Setting departure time error");
                          setErrors({
                            ...errors,
                            flightDepartureTime:
                              "New departure time cannot be before the original departure time",
                          });
                        } else if (newValue.isSame(dayjs(delaytime))) {
                          setTimeChanged(false);
                        } else {
                          setNewFlightDepartureTime(
                            dayjs(newValue).format("HH:mm")
                          );
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            flightDepartureTime: null,
                          }));
                          setTimeChanged(true);
                        }
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      sx={{ mt: 1, width: "100%" }}
                    />
                    {errors.flightDepartureTime && (
                      <p style={{ color: "red" }}>
                        {errors.flightDepartureTime}
                      </p>
                    )}
                  </Grid>
                </Grid>
              </LocalizationProvider>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={handleDelaySubmit}
                  disabled={!timeChanged}
                >
                  Delay
                </Button>
              </Box>
            </Dialog>

            <Dialog
              open={openConfirmDialog}
              handleClose={handleConfirmClose}
              title="Confirm Update"
            >
              <Typography sx={{ fontSize: "20px" }}>
                {selectedFlight.flight_status === 1
                  ? "Are you sure you want to set the flight to departed?"
                  : selectedFlight.flight_status === 2
                  ? "Are you sure you want to set the flight to arrived?"
                  : "Are you sure you want to set the flight to onboard??"}
              </Typography>

              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={handleConfirmClose}
                  variant="contained"
                  sx={{ mr: 1 }}
                  color="error"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={handleConfirmSubmit}
                >
                  Confirm
                </Button>
              </Box>
            </Dialog>

            <FlightTable
              handleUpdateClick={handleUpdateClick}
              flights={flightData}
            />
          </Box>
          <Alert
            open={openSnackbar}
            setOpen={setOpenSnackbar}
            severity={snackbarSeverity}
            message={snackbarMessage}
          />
        </Main>
      </div>
    </>
  );
};

export default UpdateFlightStatus;
