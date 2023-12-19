import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getCountryList, getOnCountry, updateCountryStatus } from "../../api";
import Alert from "../Global/Alert";
import Dialog from "../Global/Dailog";
import Sidebar, { DrawerHeader, Main } from "../Sidebar";
import CountryTable from "./CountryTable";

const ManageCountry = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [country, setCountryData] = useState([]);
  const [onCountry, setOnCountry] = useState([]);
  const [originalCountryData, setOriginalCountryData] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [hasChanged, setHasChanged] = useState(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpen = () => {
    setOpenDialog(true);
  };
  const handleClose = () => {
    setOpenDialog(false);
  };

  const fetchData = async () => {
    try {
      const onCountriesData = await getOnCountry();
      setOnCountry(onCountriesData);

      const countriesData = await getCountryList();
      setCountryData(countriesData);
      setOriginalCountryData(countriesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (selectedCountry) => {
    const updatedCountry = {
      ...selectedCountry,
      on_off: selectedCountry.on_off === 1 ? 0 : 1,
    };
    const updatedCountries = country.map((c) =>
      c.code === updatedCountry.code ? updatedCountry : c
    );
    setCountryData(updatedCountries);

    const anyChanges = updatedCountries.some(
      (c, i) => c.on_off !== originalCountryData[i].on_off
    );
    setHasChanged(anyChanges);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await updateCountryStatus(country);
      setSnackbarMessage(response);
      setSnackbarSeverity("success");
      setOpenDialog(false);
      setHasChanged(false);
      fetchData();
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setOpenDialog(false);
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
                Manage Country
              </Typography>
            </Box>
            <Grid container spacing={2} justifyContent="center">
              <Grid item md={3} mt={1} mb={2}>
                <Box
                  fullWidth
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    m: "0 auto",
                    padding: "0 20px",
                  }}
                >
                  <TextField
                    id="search-field"
                    label="Search Country Name"
                    value={searchTerm}
                    onChange={handleSearch}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>
              <Grid item md={3} mt={1} mb={2}>
                <Box
                  sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    onClick={handleOpen}
                    variant="contained"
                    sx={{ mb: 1 }}
                    disabled={!hasChanged}
                  >
                    Save
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <Dialog
              open={openDialog}
              handleClose={handleClose}
              title="Confirm Changes"
              onSubmit={handleSubmit}
            >
              Are you sure you want to save changes?
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained">
                  Confirm
                </Button>
              </Box>
            </Dialog>
            <CountryTable
              searchTerm={searchTerm}
              countries={country}
              handleEditClick={handleEditClick}
              setHasChanged={setHasChanged}
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

export default ManageCountry;
