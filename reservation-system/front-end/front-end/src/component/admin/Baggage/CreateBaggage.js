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
import { createBaggage, getBaggageList } from "../../api";
import Alert from "../Global/Alert";
import Dialog from "../Global/Dailog";
import Sidebar, { DrawerHeader, Main } from "../Sidebar";
import BaggageTable from "./BaggageTable";

const CreateBaggage = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => {
    setOpenDialog(false);
    resetForm();
  };

  const [baggageName, setBaggageName] = useState("");
  const [baggageKg, setBaggageKg] = useState(0);
  const [baggageDomesticPrice, setBaggageDomesticPrice] = useState(0);
  const [baggageInternationalPrice, setBaggageInternationalPrice] = useState(0);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [baggageData, setBaggageData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const handleSearch = (search) => {
    setSearchTerm(search);
  };

  const fetchData = async () => {
    try {
      const baggageData = await getBaggageList();
      setBaggageData(baggageData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const existingBaggageKg = baggageData.map((baggage) => baggage.kg);

  const baggageKgList = [
    { name: "20 KG", value: 20 },
    { name: "25 KG", value: 25 },
    { name: "30 KG", value: 30 },
    { name: "40 KG", value: 40 },
    { name: "50 KG", value: 50 },
    { name: "60 KG", value: 60 },
  ].filter((baggage) => !existingBaggageKg.includes(baggage.value));

  const resetForm = () => {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const baggage = {
      name: baggageName,
      kg: parseFloat(baggageKg),
      domesticPrice: parseFloat(baggageDomesticPrice),
      internationalPrice: parseFloat(baggageInternationalPrice),
    };

    try {
      const response = await createBaggage(baggage);
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
                Create Baggage
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
              title="Add A New Baggage"
              onSubmit={handleSubmit}
            >
              <Grid container spacing={1}>
                <Grid item md={6}>
                  <TextField
                    name="baggageName"
                    label="Baggage Name"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="Baggage 20"
                    onChange={(event) => setBaggageName(event.target.value)}
                  />

                  <TextField
                    name="bundlesDomesticPrice"
                    label="Baggage Domestic Price"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="123"
                    onChange={(event) =>
                      setBaggageDomesticPrice(event.target.value)
                    }
                    type="number"
                    inputProps={{ step: "any" }}
                  />
                </Grid>
                <Grid item md={6}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <Autocomplete
                      id="baggageKg"
                      options={baggageKgList}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, newValue) =>
                        setBaggageKg(newValue.value)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Baggage KG"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                  </FormControl>

                  <TextField
                    name="baggageInternationalPrice"
                    label="Baggage International Price"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="123"
                    onChange={(event) =>
                      setBaggageInternationalPrice(event.target.value)
                    }
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
              <BaggageTable searchTerm={searchTerm} baggages={baggageData} />
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

export default CreateBaggage;
