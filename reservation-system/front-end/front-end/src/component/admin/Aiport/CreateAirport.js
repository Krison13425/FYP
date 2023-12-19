import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createAirport, getAirportList, getOnCountry } from "../../api";
import Alert from "../Global/Alert";
import Dialog from "../Global/Dailog";
import Sidebar, { DrawerHeader, Main } from "../Sidebar";
import AirportTable from "./AiportTable";

const CreateAirport = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => {
    setOpenDialog(false);
    resetForm();
  };

  const [country, setOnCountry] = useState([]);

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

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [airportData, setAirportData] = useState([]);
  const [newAirportData, setNewAirportData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const handleSearch = (search) => {
    setSearchTerm(search);
  };

  const fetchData = async () => {
    try {
      const countriesData = await getOnCountry();
      setOnCountry(countriesData);

      const airportData = await getAirportList();
      setAirportData(airportData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const countryMapping = country.reduce((acc, cur) => {
    acc[cur.code] = cur.name;
    return acc;
  }, {});

  const validateFields = (airport) => {
    const errors = {};

    if (
      !airport.latitude ||
      isNaN(Number(airport.latitude)) ||
      Number(airport.latitude) < -90 ||
      Number(airport.latitude) > 90
    ) {
      errors.latitude =
        "Invalid latitude. It must be a number between -90 and 90.";
    }
    if (
      !airport.longitude ||
      isNaN(Number(airport.longitude)) ||
      Number(airport.longitude) < -180 ||
      Number(airport.longitude) > 180
    ) {
      errors.longitude =
        "Invalid longitude. It must be a number between -180 and 180.";
    }

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

  const handleLocationChange = (event, newValue) => {
    setAirportLocation(newValue?.code);
  };

  const keyMapping = {
    code: "Airport IATA Code",
    name: "Airport Name",
    country_code: "Airport Location",
    municipal: "Airport Municipal",
    latitude: "Airport Latitude",
    longitude: "Airport Longitude",
    address: "Airport Address",
    phone: "Airport Phone Number",
    terminal: "Airport Terminal",
  };

  const resetForm = () => {
    setAirportCode("");
    setAirportName("");
    setAirportMunicipal("");
    setAirportLocation("");
    setAirportLatitude("");
    setAirportLongitude("");
    setAirportPhone("");
    setAirportTerminal("");
    setAirportAddress("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formattedAirportName = airportName;

    if (airportLocation === "MY") {
      if (!airportName.toLowerCase().includes("airport")) {
        formattedAirportName = `${formattedAirportName} Airport`;
      }
    } else {
      if (!airportName.toLowerCase().includes("international")) {
        formattedAirportName = `${formattedAirportName} International`;
      }
      if (!airportName.toLowerCase().includes("airport")) {
        formattedAirportName = `${formattedAirportName} Airport`;
      }
    }

    const airport = {
      code: airportCode,
      name: formattedAirportName,
      country_code: airportLocation,
      municipal: airportMunicipal,
      latitude: parseFloat(airportLatitude),
      longitude: parseFloat(airportLongitude),
      address: airportAddress,
      phone: airportPhone,
      terminal: airportTerminal,
    };

    const errors = validateFields(airport);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setOpenConfirmDialog(true);
    setNewAirportData(airport);
  };

  const handleConfirmCreate = async () => {
    setOpenConfirmDialog(false);

    try {
      const response = await createAirport(newAirportData);
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
                Create Airport
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
              title="Add A New Airport"
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
                    onChange={(event) => {
                      const val = event.target.value;
                      if (/^[A-Z]*$/i.test(val)) {
                        setAirportCode(val.toUpperCase());
                      }
                    }}
                    inputProps={{ maxLength: 3 }}
                  />

                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <Autocomplete
                      id="loation"
                      options={country.filter(
                        (option) => option.code !== "HK" && option.code !== "SG"
                      )}
                      getOptionLabel={(option) => `${option.name}`}
                      onChange={handleLocationChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Airport Location"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                  </FormControl>

                  <TextField
                    name="airport latitude"
                    label="Aiport Latitude"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="e.g. 49.2827"
                    onChange={(event) => setAirportLatitude(event.target.value)}
                    type="number"
                    inputProps={{ step: "any" }}
                    error={!!formErrors.latitude}
                    helperText={formErrors.latitude}
                  />

                  <TextField
                    name="airportPhone"
                    label="Airport Phone Number"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="e.g. +1-202-555-0156"
                    onChange={(event) => setAirportPhone(event.target.value)}
                    type="number"
                    error={!!formErrors.phone}
                    helperText={formErrors.phone}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="aiport name"
                    label="Airport Name"
                    variant="outlined"
                    placeholder="e.g. Kuala Lumpur International Airport"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    onChange={(event) => setAirportName(event.target.value)}
                  />

                  <TextField
                    name="airport municipal"
                    label="Airport Municipal"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="e.g. Sydney or Kuala Lumpur"
                    onChange={(event) =>
                      setAirportMunicipal(event.target.value)
                    }
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
                    error={!!formErrors.longitude}
                    helperText={formErrors.longitude}
                  />
                  <TextField
                    name="airport terminal"
                    label="Airport Terminal"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="e.g. 1 or Main"
                    onChange={(event) => setAirportTerminal(event.target.value)}
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
                    onChange={(event) => setAirportAddress(event.target.value)}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained">
                  Add
                </Button>
              </Box>
            </Dialog>
            <Box sx={{ display: "flex" }}>
              <AirportTable
                searchTerm={searchTerm}
                airports={airportData}
                countries={countryMapping}
              />
            </Box>

            <Dialog
              open={openConfirmDialog}
              handleClose={() => setOpenConfirmDialog(false)}
              title="Confirm Create"
              onSubmit={handleConfirmCreate}
            >
              Please Confirm Your Aiport Data Before you Proceed the Create
              Process
              <Table>
                <TableBody>
                  {Object.entries(newAirportData).map(([key, value], i) => (
                    <TableRow key={i}>
                      <TableCell>{keyMapping[key] || key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
          </Box>
        </Main>
      </div>
    </>
  );
};

export default CreateAirport;
