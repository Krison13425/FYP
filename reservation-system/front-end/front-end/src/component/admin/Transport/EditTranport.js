import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  deleteTransport,
  getAllTransports,
  getTransportById,
  updateTransport,
} from "../../api";
import Alert from "../Global/Alert";
import Dialog from "../Global/Dailog";
import Sidebar, { DrawerHeader, Main } from "../Sidebar";
import TransportTable from "./TransportTable";

const EditTransport = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => {
    setOpenDialog(false);
    setSelectedTransport("");
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

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedTransport, setSelectedTransport] = useState("");
  const [transportData, setTransportData] = useState([]);
  const [originalTransportData, setOriginalTransportData] = useState("");
  const [transportPriceError, setTransportPriceError] = useState(false);
  const [transportPrice, setTransportPrice] = useState(0);

  const handleSearch = (search) => {
    setSearchTerm(search);
  };

  const handleEditClick = (id) => {
    fetchSelectedTransportData(id);
    handleOpen();
  };

  const handleDeleteClick = (id) => {
    fetchSelectedTransportData(id);
    handleConfirmDeleteOpen();
  };

  const TranportTypeList = [
    { name: "Sedan", value: 0 },
    { name: "MPV", value: 1 },
  ];

  const TranportCapacityList = [
    { name: "4", value: 4 },
    { name: "6", value: 6 },
  ];

  const TranportLugagge = [
    { name: "2", value: 2 },
    { name: "4", value: 4 },
    { name: "6", value: 6 },
  ];
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "price") {
      const inputPrice = value;

      if (inputPrice === "") {
        setSelectedTransport((prevState) => ({
          ...prevState,
          [name]: inputPrice,
        }));
        setTransportPriceError(false);
      } else {
        const numericPrice = parseFloat(inputPrice);

        if (isNaN(numericPrice) || numericPrice <= 0) {
          setTransportPriceError(true);
        } else {
          setTransportPriceError(false);
          setSelectedTransport((prevState) => ({
            ...prevState,
            [name]: numericPrice,
          }));
        }
      }
    } else {
      setSelectedTransport((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const hasChanges =
    JSON.stringify(selectedTransport) !== JSON.stringify(originalTransportData);

  const fetchSelectedTransportData = async (id) => {
    const transportData = await getTransportById(id);
    setOriginalTransportData(transportData);
    setSelectedTransport(transportData);
  };

  const fetchTransportData = async () => {
    const transportData = await getAllTransports();
    setTransportData(transportData);
  };

  useEffect(() => {
    fetchTransportData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleConfirmOpen();
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await deleteTransport(selectedTransport.id);
      setSnackbarMessage(response);
      setSnackbarSeverity("success");
      fetchTransportData();
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

    try {
      const response = await updateTransport(
        selectedTransport.id,
        parseFloat(selectedTransport.price)
      );
      setSnackbarMessage(response);
      setSnackbarSeverity("success");
      handleClose();
      fetchTransportData();
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
                Edit Transport
              </Typography>
            </Box>
            <Dialog
              open={openDialog}
              handleClose={handleClose}
              title={"Edit Meal " + selectedTransport.name}
              onSubmit={handleSubmit}
            >
              <Grid container spacing={1}>
                <Grid item md={6}>
                  <TextField
                    readOnly
                    onChange={handleInputChange}
                    name="transportName"
                    label="Transport Name"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 1 }}
                    value={selectedTransport.name}
                  />

                  <TextField
                    name="price"
                    label="Transport Price"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="e.g. 123"
                    value={selectedTransport.price}
                    error={transportPriceError}
                    helperText={
                      transportPriceError
                        ? "Transport price cannot be negative"
                        : ""
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
                  />

                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <Autocomplete
                      readOnly
                      id="transportLuggage"
                      options={TranportLugagge}
                      getOptionLabel={(option) => option.name}
                      value={
                        selectedTransport
                          ? TranportLugagge.find(
                              (option) =>
                                option.value === selectedTransport.luggage
                            )
                          : null
                      }
                      onChange={handleInputChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Transport luggage"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <Autocomplete
                      readOnly
                      id="transportType"
                      options={TranportTypeList}
                      value={
                        selectedTransport
                          ? TranportTypeList.find(
                              (option) =>
                                option.value === selectedTransport.type
                            )
                          : null
                      }
                      getOptionLabel={(option) => option.name}
                      onChange={handleInputChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Transport Type"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <Autocomplete
                      readOnly
                      id="transportCpacity"
                      options={TranportCapacityList}
                      value={
                        selectedTransport
                          ? TranportCapacityList.find(
                              (option) =>
                                option.value === selectedTransport.capacity
                            )
                          : null
                      }
                      getOptionLabel={(option) => option.name}
                      onChange={handleInputChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Transport Capacity"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                  </FormControl>
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
            <TransportTable
              searchTerm={searchTerm}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              transports={transportData}
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
            Are you sure you want to delete {selectedTransport.name}?
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

export default EditTransport;
