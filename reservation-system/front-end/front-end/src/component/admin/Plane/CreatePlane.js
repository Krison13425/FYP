import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createPlane, getAirplanesList, getOnCountry } from "../../api";
import Alert from "../Global/Alert";
import Dialog from "../Global/Dailog";
import Sidebar, { DrawerHeader, Main } from "../Sidebar";
import PlaneTable from "./PlaneTable";

const CreatePlane = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => {
    setOpenDialog(false);
    resetForm();
  };

  const [country, setOnCountry] = useState([]);
  const [airplaneSpeed, setAirplaneSpeed] = useState("");
  const [airplaneType, setairplaneType] = useState("");
  const [airplaneName, setAirplaneName] = useState("");
  const [location, setLocation] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [airplanes, setAirplanes] = useState([]);

  const fetchData = async () => {
    try {
      const countriesData = await getOnCountry();
      setOnCountry(countriesData);

      const airplaneData = await getAirplanesList();
      setAirplanes(airplaneData);
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

  const handleAirplaneNameChange = (event) => {
    const val = event.target.value;
    setAirplaneName("SK" + val);
  };

  const handleLocationChange = (event, newValue) => {
    setLocation(newValue?.code);
    const specificLocations = ["AU", "JP", "KR", "CN", "KR", "HK", "TW", "NZ"];

    if (specificLocations.includes(newValue?.code)) {
      setairplaneType("A330");
      setAirplaneSpeed(860);
    } else {
      setairplaneType("A320");
      setAirplaneSpeed(840);
    }
  };

  const resetForm = () => {
    setAirplaneName("");
    setAirplaneSpeed("");
    setairplaneType("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newAirplaneType = null;
    if (airplaneType === "A330") {
      newAirplaneType = 1;
    } else if (airplaneType === "A320") {
      newAirplaneType = 0;
    }

    const airplane = {
      name: airplaneName,
      type: newAirplaneType,
      speed: airplaneSpeed,
      location: location,
    };

    try {
      const response = await createPlane(airplane);
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
                Create Plane
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
              title="Add A New Plane"
              onSubmit={handleSubmit}
            >
              <Grid container spacing={1}>
                <Grid item md={6}>
                  <TextField
                    name="airplane name"
                    label="Airplane Name"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    onChange={handleAirplaneNameChange}
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">SK</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    name="airplane-type"
                    label="Airplane Type"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    value={airplaneType}
                    onChange={(event) => setairplaneType(event.target.value)}
                    disabled
                  />
                </Grid>
                <Grid item md={6}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <Autocomplete
                      id="loation"
                      options={country}
                      getOptionLabel={(option) => `${option.name}`}
                      onChange={handleLocationChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Location"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                  </FormControl>

                  <TextField
                    name="airplane-speed"
                    label="Airplane Speed"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    value={airplaneSpeed}
                    onChange={(event) => setAirplaneSpeed(event.target.value)}
                    disabled
                    type="number"
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained">
                  Add
                </Button>
              </Box>
            </Dialog>
            <PlaneTable
              searchTerm={searchTerm}
              airplanes={airplanes}
              countries={countryMapping}
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

export default CreatePlane;
