import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createBundle, getBundleList } from "../../api";
import Alert from "../Global/Alert";
import Dialog from "../Global/Dailog";
import Sidebar, { DrawerHeader, Main } from "../Sidebar";
import BundleTable from "./BundleTable";

const CreateBundle = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => {
    setOpenDialog(false);
    resetForm();
  };

  const [bundleName, setBundleName] = useState("");
  const [bundleCheckinBaggage, setBundleCheckinBaggage] = useState(0);
  const [bundlePrioCheckIn, setBundlePrioCheckIn] = useState(0);
  const [bundleDomesticPrice, setBundleDomesticPrice] = useState(0);
  const [bundleInternationalPrice, setBundleInternationalPrice] = useState(0);

  const [isEconomy, setIsEconomy] = useState(false);
  const [isBusiness, setIsBusiness] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [bundleData, setBundleData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const handleSearch = (search) => {
    setSearchTerm(search);
  };

  const fetchData = async () => {
    try {
      const budlesData = await getBundleList();
      setBundleData(budlesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();

    if (isEconomy || isBusiness) {
      setIsFormDisabled(false);
    } else {
      setIsFormDisabled(true);
    }
  }, [isEconomy, isBusiness]);

  const existingBundleNames = bundleData.map((bundle) => bundle.name);

  const economyBundleName = [
    { name: "Economy Basic", value: "Economy Basic" },
    { name: "Economy Plus", value: "Economy Plus" },
    { name: "Economy Max", value: "Economy Max" },
  ].filter((bundle) => !existingBundleNames.includes(bundle.name));

  const businessBundleName = [
    { name: "Business Basic", value: "Business Basic" },
    { name: "Business Elite", value: "Business Elite" },
  ].filter((bundle) => !existingBundleNames.includes(bundle.name));

  const baggage = [
    { name: "0 KG", value: "0" },
    { name: "20 KG", value: "20" },
    { name: "30 KG", value: "30" },
    { name: "40 KG", value: "40" },
  ];

  const prioCheckIn = [
    { name: "Yes", value: "1" },
    { name: "No", value: "0" },
  ];

  const handleBundleChange = (event, newValue) => {
    setBundleName(newValue?.value);
  };

  const handleBaggageChange = (event, newValue) => {
    setBundleCheckinBaggage(newValue?.value);
  };

  const resetForm = () => {
    setIsEconomy(false);
    setIsBusiness(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bundle = {
      name: bundleName,
      checkinBaggage: bundleCheckinBaggage,
      prioCheckIn: bundlePrioCheckIn,
      domesticPrice: parseFloat(bundleDomesticPrice),
      internationalPrice: parseFloat(bundleInternationalPrice),
    };

    try {
      const response = await createBundle(bundle);
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
                Create Bundle
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
              title="Add A New Bundle"
              onSubmit={handleSubmit}
            >
              <Grid container spacing={1}>
                <Grid item md={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isEconomy}
                        onChange={(event) => setIsEconomy(event.target.checked)}
                        name="economy"
                        color="primary"
                      />
                    }
                    label="Economy Class"
                    disabled={isBusiness}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isBusiness}
                        onChange={(event) =>
                          setIsBusiness(event.target.checked)
                        }
                        name="business"
                        color="primary"
                        disabled={isEconomy}
                      />
                    }
                    label="Business Class"
                  />
                </Grid>
                <Grid item md={6}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <Autocomplete
                      disabled={isFormDisabled}
                      id="bundle"
                      options={
                        isEconomy
                          ? economyBundleName
                          : isBusiness
                          ? businessBundleName
                          : []
                      }
                      getOptionLabel={(option) => option.name}
                      onChange={handleBundleChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Bundle Name"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <Autocomplete
                      disabled={isFormDisabled}
                      id="prioCheckIn"
                      options={isBusiness ? [prioCheckIn[0]] : prioCheckIn}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, newValue) =>
                        setBundlePrioCheckIn(newValue?.value)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Priority Check-In"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                  </FormControl>

                  <TextField
                    disabled={isFormDisabled}
                    name="Bundle International Price"
                    label="Bundle International Price"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="123"
                    onChange={(event) =>
                      setBundleInternationalPrice(event.target.value)
                    }
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
                    type="number"
                    inputProps={{ step: "any" }}
                  />
                </Grid>
                <Grid item md={6}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <Autocomplete
                      disabled={isFormDisabled}
                      id="baggage"
                      options={
                        isEconomy
                          ? baggage.slice(0, 3)
                          : isBusiness
                          ? baggage.slice(2, 4)
                          : []
                      }
                      getOptionLabel={(option) => option.name}
                      onChange={handleBaggageChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Baggage"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                  </FormControl>

                  <TextField
                    disabled={isFormDisabled}
                    name="Bundle Domestic Price"
                    label="Bundle Domestic Price"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="123"
                    onChange={(event) =>
                      setBundleDomesticPrice(event.target.value)
                    }
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
                    type="number"
                    inputProps={{ step: "any" }}
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
              <BundleTable searchTerm={searchTerm} bundles={bundleData} />
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

export default CreateBundle;
