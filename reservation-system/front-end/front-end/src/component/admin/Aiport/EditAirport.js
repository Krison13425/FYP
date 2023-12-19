import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  deletAirport,
  editAirport,
  getAirportByCode,
  getAirportList,
  getFilteredAirportList,
  getOnCountry,
} from "../../api";
import Alert from "../Global/Alert";
import Dialog from "../Global/Dailog";
import Sidebar, { DrawerHeader, Main } from "../Sidebar";
import SearchAirportForm from "../forms/SearchAirportFor";
import AirportTable from "./AiportTable";

const EditAirport = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => {
    setOpenDialog(false);
    setSelectedAirport("");
  };
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const handleConfirmOpen = () => setOpenConfirmDialog(true);
  const handleConfirmClose = () => setOpenConfirmDialog(false);

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const handleConfirmDeleteOpen = () => setOpenConfirmDeleteDialog(true);
  const handleConfirmDeleteClose = () => setOpenConfirmDeleteDialog(false);

  const [airportCode, setAirportCode] = useState("");
  const [airportName, setAirportName] = useState("");
  const [airportLocation, setAirportLocation] = useState("");
  const [airportMunicipal, setAirportMunicipal] = useState("");
  const [airportLatitude, setAirportLatitude] = useState("");
  const [airportLongitude, setAirportLongitude] = useState("");
  const [airportAddress, setAirportAddress] = useState("");
  const [airportPhone, setAirportPhone] = useState("");
  const [airportTerminal, setAirportTerminal] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [location, setfilterLocation] = useState("");

  const [selectedAiport, setSelectedAirport] = useState("");
  const [airportData, setAirportData] = useState([]);
  const [country, setCountries] = useState([]);

  const [originalAirport, setOriginalAirport] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const statusOptions = [
    { value: 1, label: "Maintaining" },
    { value: 0, label: "Available" },
  ];

  const handleSearch = (search) => {
    setSearchTerm(search);
  };

  const handleFilterSubmit = (location) => {
    setfilterLocation(location);
    fetchFilteredAirports(location);
  };

  const handleEditClick = (code) => {
    fetchSelectedAirportData(code);
    handleOpen();
    setAirportName(airportData.name);
  };

  const handleDeleteClick = (code) => {
    fetchSelectedAirportData(code);
    handleConfirmDeleteOpen();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setSelectedAirport((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const fetchSelectedAirportData = async (code) => {
    const airportData = await getAirportByCode(code);
    setSelectedAirport(airportData);
    setOriginalAirport(airportData);
  };

  const fetchFilteredAirports = async (location) => {
    const airportData = await getFilteredAirportList(location);
    setAirportData(airportData);
  };

  const fetchAirportData = async () => {
    const airportData = await getAirportList();
    setAirportData(airportData);
  };

  const fetchCountries = async () => {
    const countryList = await getOnCountry();
    setCountries(countryList);
  };

  useEffect(() => {
    fetchAirportData();
    fetchCountries();
  }, []);

  const validateFields = (airport) => {
    const errors = {};

    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (
      !airport.phone ||
      !phoneRegex.test(airport.phone) ||
      airport.phone.length < 7 ||
      airport.phone.length > 20
    ) {
      errors.phone =
        "Invalid phone number. It should only contain digits, hyphens, spaces, parentheses and plus sign, and be between 7 and 20 characters long.";
    }

    return errors;
  };

  const hasChanges =
    JSON.stringify(selectedAiport) !== JSON.stringify(originalAirport);

  const data = Object.entries(selectedAiport).map(([key, value]) => ({
    field: key,
    originalValue: originalAirport[key],
    newValue: value,
  }));

  const columns = [
    { id: "field", label: "Field", minWidth: 100 },
    { id: "originalValue", label: "Original Value", minWidth: 100 },
    { id: "newValue", label: "Edited Value", minWidth: 100 },
  ];

  const countryMapping = country.reduce((acc, cur) => {
    acc[cur.code] = cur.name;
    return acc;
  }, {});

  const handleSubmit = (e) => {
    e.preventDefault();
    handleConfirmOpen();
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await deletAirport(selectedAiport.code);
      setSnackbarMessage(response);
      setSnackbarSeverity("success");
      handleConfirmDeleteClose();
      if (location) {
        fetchFilteredAirports(location);
      } else {
        fetchAirportData();
      }
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

    const airport = {
      code: originalAirport.code,
      name: selectedAiport.name,
      municipal: selectedAiport.municipal,
      country_code: originalAirport.country_code,
      latitude: originalAirport.latitude,
      longitude: originalAirport.longitude,
      address: selectedAiport.address,
      phone: selectedAiport.phone,
      terminal: selectedAiport.terminal,
    };

    try {
      const response = await editAirport(airport);
      setSnackbarMessage(response);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleClose();
      if (location) {
        fetchFilteredAirports(location);
      } else {
        fetchAirportData();
      }
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
                Edit Airport
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <SearchAirportForm
                onSearch={handleSearch}
                countries={country}
                onFilterSubmit={handleFilterSubmit}
              />
            </Box>
            <Dialog
              open={openDialog}
              handleClose={handleClose}
              title={"Edit Aiport " + selectedAiport.name}
              onSubmit={handleSubmit}
            >
              <Grid container spacing={1}>
                <Grid item md={6}>
                  <TextField
                    name="airport code"
                    label="Aiport IATA Code"
                    variant="outlined"
                    placeholder="e.g. KUL"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    value={selectedAiport ? selectedAiport.code : ""}
                    readOnly
                  />

                  <TextField
                    name="airport country"
                    label="Aiport Country"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 1 }}
                    value={
                      selectedAiport
                        ? `${
                            countryMapping[selectedAiport.country_code] ||
                            "Loading..."
                          }`
                        : ""
                    }
                    readOnly
                  />

                  <TextField
                    name="airport latitude"
                    label="Aiport Latitude"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="e.g. 49.2827"
                    value={selectedAiport ? selectedAiport.latitude : ""}
                    type="number"
                    inputProps={{ step: "any" }}
                    readOnly
                  />

                  <TextField
                    name="phone"
                    label="Airport Phone Number"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="e.g. +1-202-555-0156"
                    onChange={handleInputChange}
                    value={selectedAiport ? selectedAiport.phone : ""}
                    inputMode="numeric"
                    error={!!formErrors.phone}
                    helperText={formErrors.phone}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="name"
                    label="Airport Name"
                    variant="outlined"
                    placeholder="e.g. Kuala Lumpur International Airport"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    onChange={handleInputChange}
                    value={selectedAiport ? selectedAiport.name : ""}
                  />

                  <TextField
                    name="municipal"
                    label="Airport Municipal"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="e.g. Sydney or Kuala Lumpur"
                    onChange={handleInputChange}
                    value={selectedAiport ? selectedAiport.municipal : ""}
                  />

                  <TextField
                    name="aiport longitude"
                    label="Aiport Longitude"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="e.g. -123.1216"
                    onChange={(event) =>
                      setAirportLongitude(event.target.value)
                    }
                    type="number"
                    inputProps={{ step: "any" }}
                    value={selectedAiport ? selectedAiport.longitude : ""}
                    readOnly
                  />
                  <TextField
                    name="terminal"
                    label="Airport Terminal"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="e.g. 1 or Main"
                    onChange={handleInputChange}
                    value={selectedAiport ? selectedAiport.terminal : ""}
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    name="address"
                    label="Airport Address"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="e.g. 123 Main St, Anytown, State, Country"
                    onChange={handleInputChange}
                    value={selectedAiport ? selectedAiport.address : ""}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!hasChanges}
                >
                  Save
                </Button>
              </Box>
            </Dialog>
            <AirportTable
              searchTerm={searchTerm}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              airports={airportData}
              countries={countryMapping}
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
            Are you sure you want to delete {selectedAiport.name}?
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

export default EditAirport;
