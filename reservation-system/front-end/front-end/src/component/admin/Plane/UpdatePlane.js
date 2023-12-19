import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  deletPlane,
  editPlane,
  getAirplaneById,
  getAirplanesList,
  getFilteredAirplanesList,
  getOnCountry,
} from "../../api";
import Alert from "../Global/Alert";
import Dialog from "../Global/Dailog";
import Sidebar, { DrawerHeader, Main } from "../Sidebar";
import SearchPLaneForm from "../forms/SearchPlaneForm";
import PlaneTable from "./PlaneTable";

const UpdatePlane = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => {
    setOpenDialog(false);
    setSelectedAirplane("");
  };
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const handleConfirmOpen = () => setOpenConfirmDialog(true);
  const handleConfirmClose = () => setOpenConfirmDialog(false);

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const handleConfirmDeleteOpen = () => setOpenConfirmDeleteDialog(true);
  const handleConfirmDeleteClose = () => setOpenConfirmDeleteDialog(false);

  const [airplaneStatus, setAirplaneStatus] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setfilterStatus] = useState("");
  const [location, setfilterLocation] = useState("");

  const [selectedAirplane, setSelectedAirplane] = useState("");
  const [airplanes, setAirplanes] = useState([]);
  const [country, setCountries] = useState([]);

  const statusOptions = [
    { value: 1, label: "Maintaining" },
    { value: 0, label: "Available" },
  ];

  const handleSearch = (search) => {
    setSearchTerm(search);
  };

  const handleFilterSubmit = (status, location) => {
    setfilterStatus(status);
    setfilterLocation(location);
    fetchFilteredAirplanes(status, location);
  };

  const handleEditClick = (id) => {
    fetchSelectedAirplaneData(id);
    handleOpen();
  };

  const handleDeleteClick = (id) => {
    fetchSelectedAirplaneData(id);
    handleConfirmDeleteOpen();
  };

  const fetchSelectedAirplaneData = async (id) => {
    const airplaneData = await getAirplaneById(id);
    setSelectedAirplane(airplaneData);
  };

  const fetchFilteredAirplanes = async (status, location) => {
    const data = await getFilteredAirplanesList(status, location);
    setAirplanes(data);
  };

  const fetchAirplaneData = async () => {
    const airplaneData = await getAirplanesList();
    setAirplanes(airplaneData);
  };

  const fetchCountries = async () => {
    const countryList = await getOnCountry();
    setCountries(countryList);
  };

  useEffect(() => {
    fetchAirplaneData();
    fetchCountries();
  }, []);

  const countryMapping = country.reduce((acc, cur) => {
    acc[cur.code] = cur.name;
    return acc;
  }, {});

  const handleStatusChange = (event) => {
    setSelectedAirplane((prevState) => ({
      ...prevState,
      status: event.target.value,
    }));
    setAirplaneStatus(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleConfirmOpen();
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await deletPlane(selectedAirplane.id);
      setSnackbarMessage(response);
      setSnackbarSeverity("success");
      handleConfirmDeleteClose();
      if (status || location) {
        fetchFilteredAirplanes(status, location);
      } else {
        fetchAirplaneData();
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

    const airplane = {
      id: selectedAirplane.id,
      name: selectedAirplane.name,
      type: selectedAirplane.type,
      speed: selectedAirplane.speed,
      location: selectedAirplane.location,
      status: airplaneStatus,
    };

    try {
      const response = await editPlane(airplane);
      setSnackbarMessage(response);
      setSnackbarSeverity("success");
      handleClose();
      if (status || location) {
        fetchFilteredAirplanes(status, location);
      } else {
        fetchAirplaneData();
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
                Update Plane Status
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <SearchPLaneForm
                onSearch={handleSearch}
                countries={country}
                statusOptions={statusOptions}
                onFilterSubmit={handleFilterSubmit}
              />
            </Box>
            <Dialog
              open={openDialog}
              handleClose={handleClose}
              title={"Edit PLane " + selectedAirplane.name}
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
                    value={selectedAirplane ? selectedAirplane.name : ""}
                    readOnly
                  />
                  <TextField
                    name="airplane type"
                    label="Airplane Type"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    value={
                      selectedAirplane && selectedAirplane.type === 1
                        ? "A330"
                        : "A320"
                    }
                    readOnly
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="airplane-locaiton"
                    label="Airplane Location"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    value={
                      selectedAirplane
                        ? `${
                            countryMapping[selectedAirplane.location] ||
                            "Loading..."
                          }`
                        : ""
                    }
                    readOnly
                  />

                  <TextField
                    name="airplane-speed"
                    label="Airplane Speed"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    value={selectedAirplane ? selectedAirplane.speed : ""}
                    readOnly
                  />
                </Grid>
                <Grid item md={6}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    required
                    sx={{ mt: 1 }}
                  >
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      id="status"
                      name="status"
                      value={selectedAirplane ? selectedAirplane.status : ""}
                      onChange={handleStatusChange}
                      label="Status"
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={selectedAirplane.status !== airplaneStatus}
                >
                  Save
                </Button>
              </Box>
            </Dialog>
            <PlaneTable
              searchTerm={searchTerm}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              airplanes={airplanes}
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
            Are you sure you want to delete Plane {selectedAirplane.name}?
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

export default UpdatePlane;
