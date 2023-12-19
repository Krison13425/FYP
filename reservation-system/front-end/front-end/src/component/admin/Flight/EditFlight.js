import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  deletFlight,
  editFlightPrice,
  getFLightsList,
  getFilteredFlights,
  getFlightById,
} from "../../api";
import Alert from "../Global/Alert";
import Dialog from "../Global/Dailog";
import Sidebar, { DrawerHeader, Main } from "../Sidebar";
import SearchFlightForm from "../forms/SearchFlightForm";
import FlightTable from "./FlightTable";

const EditFlight = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => {
    setOpenDialog(false);
    setSelectedFlight("");
    setPriceError("");
    setOriginalFlightData("");
  };

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const handleConfirmOpen = () => setOpenConfirmDialog(true);
  const handleConfirmClose = () => setOpenConfirmDialog(false);

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const handleConfirmDeleteOpen = () => setOpenConfirmDeleteDialog(true);
  const handleConfirmDeleteClose = () => setOpenConfirmDeleteDialog(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [selectedFlight, setSelectedFlight] = useState("");
  const [flightData, setFlightData] = useState([]);
  const [originalFlightData, setOriginalFlightData] = useState("");
  const [priceError, setPriceError] = useState(null);

  const [filters, setFilters] = useState({
    filterDepartureDateStart: "",
    filterDepartureDateEnd: "",
    filterArrivalDateStart: "",
    filterArrivalDateEnd: "",
    filterDepartureAirport: "",
    filterArrivalAirport: "",
    filterFlightType: "",
    filterFlightStatus: "",
  });

  const handleFilter = (filter) => {
    console.log(filter);
    setFilters(filter);
    fetchFilteredFlights(filter);
  };

  const handleEditClick = (id) => {
    fetchSelectedFlightData(id);
    handleOpen();
  };

  const handleDeleteClick = (id) => {
    fetchSelectedFlightData(id);
    handleConfirmDeleteOpen();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setSelectedFlight((prevState) => ({
      ...prevState,
      [name]: parseFloat(value),
    }));

    if (
      name === "economy_price" &&
      parseFloat(value) > selectedFlight.business_price
    ) {
      setPriceError("Economy price cannot be larger than Business price");
    } else if (
      name === "business_price" &&
      parseFloat(value) < selectedFlight.economy_price
    ) {
      setPriceError("Business price cannot be smaller than Economy price");
    } else if (name === "economy_price" && parseFloat(value) < 0) {
      setPriceError("Economy price cannot be negative");
    } else if (name === "business_price" && parseFloat(value) < 0) {
      setPriceError("Business price cannot be negative");
    } else {
      setPriceError(null);
    }
  };

  const hasChanges =
    JSON.stringify(selectedFlight) !== JSON.stringify(originalFlightData);

  const fetchSelectedFlightData = async (id) => {
    const flightData = await getFlightById(id);
    setOriginalFlightData(flightData);
    setSelectedFlight(flightData);
  };

  const fetchFlightData = async () => {
    const flightData = await getFLightsList();
    setFlightData(flightData);
  };

  const fetchFilteredFlights = async (filter) => {
    try {
      const data = await getFilteredFlights(
        filter.filterDepartureAirport,
        filter.filterArrivalAirport,
        filter.filterDepartureDateStart,
        filter.filterDepartureDateEnd,
        filter.filterArrivalDateStart,
        filter.filterArrivalDateEnd,
        filter.filterFlightType,
        filter.filterFlightStatus
      );
      setFlightData(data);
    } catch (error) {
      console.error("Failed to fetch filtered flights:", error);
    }
  };

  useEffect(() => {
    fetchFlightData();
  }, []);

  const departureTime = new Date(selectedFlight.departure_time);
  const arrivalTime = new Date(selectedFlight.arrival_time);

  const formattedDepartureDate = departureTime.toLocaleDateString();
  const formattedDepartureTime = departureTime.toLocaleTimeString();

  const formattedArrivalDate = arrivalTime.toLocaleDateString();
  const formattedArrivalTime = arrivalTime.toLocaleTimeString();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleConfirmOpen();
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await deletFlight(selectedFlight.id);
      setSnackbarMessage(response);
      setSnackbarSeverity("success");
      if (filters) {
        fetchFilteredFlights(filters);
      } else {
        fetchFlightData();
      }
      handleConfirmDeleteClose();
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    handleConfirmClose();

    console.log(
      selectedFlight.id,
      selectedFlight.economy_price,
      selectedFlight.business_price
    );
    try {
      const response = await editFlightPrice(
        selectedFlight.id,
        selectedFlight.economy_price,
        selectedFlight.business_price
      );
      setSnackbarMessage(response);
      setSnackbarSeverity("success");
      handleClose();
      if (filters) {
        fetchFilteredFlights(filters);
      } else {
        fetchFlightData();
      }
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
                Edit Flight
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <SearchFlightForm onFilter={handleFilter} />
            </Box>
            <Dialog
              open={openDialog}
              handleClose={handleClose}
              title={"Edit Flight "}
              onSubmit={handleSubmit}
            >
              <Grid container spacing={1}>
                <Grid item md={6}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <TextField
                      id="departure-airport"
                      label="Departure Airport"
                      variant="outlined"
                      value={
                        selectedFlight.departure_airport
                          ? selectedFlight.departure_airport
                          : "N/A"
                      }
                      readOnly
                    />
                  </FormControl>
                  <TextField
                    label="Departure Date and Time"
                    sx={{ mt: 2, width: "100%" }}
                    value={`${formattedDepartureDate} ${formattedDepartureTime}`}
                    readOnly
                  />
                </Grid>
                <Grid item md={6}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <TextField
                      id="arrival-airport"
                      label="Arrival Airport"
                      variant="outlined"
                      value={
                        selectedFlight.arrival_airport
                          ? selectedFlight.arrival_airport
                          : "N/A"
                      }
                      required
                      readOnly
                    />
                  </FormControl>

                  <TextField
                    label="Arrival Date and Time"
                    sx={{ mt: 2, width: "100%" }}
                    value={`${formattedArrivalDate} ${formattedArrivalTime}`}
                    readOnly
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    name="airline"
                    label="Airline"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 1 }}
                    defaultValue="SkyWings"
                    readOnly
                  />
                </Grid>
                <Grid item md={3}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <TextField
                      id="airplanes"
                      label="Airplane"
                      variant="outlined"
                      value={
                        selectedFlight.airplane_name
                          ? selectedFlight.airplane_name
                          : "N/A"
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={!!priceError}
                  >
                    <TextField
                      name="economy_price"
                      label="Economy Price"
                      variant="outlined"
                      type="number"
                      fullWidth
                      required
                      value={
                        selectedFlight ? selectedFlight.economy_price : "N/A"
                      }
                      onChange={handleInputChange}
                      sx={{ mt: 1 }}
                    />
                    {priceError && (
                      <FormHelperText>{priceError}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item md={3}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={!!priceError}
                  >
                    <TextField
                      name="business_price"
                      label="Business Price"
                      variant="outlined"
                      fullWidth
                      required
                      type="number"
                      value={
                        selectedFlight ? selectedFlight.business_price : "N/A"
                      }
                      onChange={handleInputChange}
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
                      sx={{ mt: 1 }}
                    />
                    {priceError && (
                      <FormHelperText>{priceError}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!hasChanges || priceError}
                >
                  Save
                </Button>
              </Box>
            </Dialog>
            <FlightTable
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              flights={flightData}
            />
          </Box>
          <Dialog
            open={openConfirmDialog}
            handleClose={handleConfirmClose}
            title="Confirm Changes"
            onSubmit={handleConfirm}
          >
            Are you sure you want to save changes?
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={handleConfirmClose}
                variant="contained"
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Confirm
              </Button>
            </Box>
          </Dialog>

          <Dialog
            open={openConfirmDeleteDialog}
            handleClose={handleConfirmDeleteClose}
            title="Confirm Delete"
            onSubmit={handleConfirmDelete}
          >
            Are you sure you want to delete?
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained">
                Confirm
              </Button>
            </Box>
          </Dialog>
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

export default EditFlight;
