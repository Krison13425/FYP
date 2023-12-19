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
import { useEffect, useState } from "react";
import { createTransport, getAllTransports } from "../../api";
import Alert from "../Global/Alert";
import Dialog from "../Global/Dailog";
import Sidebar, { DrawerHeader, Main } from "../Sidebar";
import TransportTable from "./TransportTable";

const CreateTransport = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => {
    setOpenDialog(false);
    resetForm();
  };

  const [transportName, setTransportName] = useState(null);
  const [transportType, setTransportType] = useState(null);
  const [transportCapacity, setTransportCapacity] = useState(null);
  const [transportPrice, setTransportPrice] = useState(null);
  const [transportLuggage, setTransportLuggage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [transportData, setTranportData] = useState([]);
  const [transportPriceError, setTransportPriceError] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const transportData = await getAllTransports();
      setTranportData(transportData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleTransportPriceChange = (event) => {
    const inputPrice = event.target.value;
    setTransportPrice(inputPrice);

    const numericPrice = parseFloat(inputPrice);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      setTransportPriceError(true);
    } else {
      setTransportPriceError(false);
      setTransportPrice(numericPrice.toString());
    }
  };

  const resetForm = () => {
    setTransportName(null);
    setTransportPrice(null);
    setTransportType(null);
    setTransportCapacity(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transport = {
      name: transportName,
      price: parseFloat(transportPrice),
      type: transportType,
      capacity: transportCapacity,
      luggage: transportLuggage,
    };
    try {
      const response = await createTransport(transport);
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
                Create Transport
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
              title="Add A New Transport"
              onSubmit={handleSubmit}
            >
              <Grid container spacing={1}>
                <Grid item md={6}>
                  <TextField
                    name="transportName"
                    label="Transport Name"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="e.g. Economy Sedan"
                    onChange={(event) => setTransportName(event.target.value)}
                  />

                  <TextField
                    name="transportPrice"
                    label="Transport Price"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="e.g. 123"
                    value={transportPrice}
                    error={transportPriceError}
                    helperText={
                      transportPriceError
                        ? "Transport price cannot be negative"
                        : ""
                    }
                    onChange={handleTransportPriceChange}
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

                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <Autocomplete
                      id="transportLuggage"
                      options={TranportLugagge}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, newValue) =>
                        setTransportLuggage(newValue.value)
                      }
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
                      id="transportType"
                      options={TranportCapacityList}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, newValue) =>
                        setTransportType(newValue.value)
                      }
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
                      id="transportCpacity"
                      options={TranportCapacityList}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, newValue) =>
                        setTransportCapacity(newValue.value)
                      }
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
                <Button type="submit" variant="contained">
                  Add
                </Button>
              </Box>
            </Dialog>
            <Box sx={{ display: "flex" }}>
              <TransportTable
                searchTerm={searchTerm}
                transports={transportData}
              />
            </Box>
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

export default CreateTransport;
