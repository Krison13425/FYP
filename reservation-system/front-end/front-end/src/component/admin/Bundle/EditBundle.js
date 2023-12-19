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
  deletBundle,
  editBundle,
  getBundleById,
  getBundleList,
} from "../../api";
import Alert from "../Global/Alert";
import Dialog from "../Global/Dailog";
import Sidebar, { DrawerHeader, Main } from "../Sidebar";
import SearchBundleForm from "../forms/SearchBundleForm";
import BundleTable from "./BundleTable";

const EditBundle = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => {
    setOpenDialog(false);
    setSelectedBundle("");
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

  const [selectedBundle, setSelectedBundle] = useState("");
  const [bundleData, setBundleData] = useState([]);
  const [originalBundleData, setOriginalBundleData] = useState("");

  const [isEconomy, setIsEconomy] = useState(false);
  const [isBusiness, setIsBusiness] = useState(false);

  const handleSearch = (search) => {
    setSearchTerm(search);
  };

  const handleEditClick = (id) => {
    fetchSelectedBundleData(id);
    handleOpen();
  };

  const handleDeleteClick = (id) => {
    fetchSelectedBundleData(id);
    handleConfirmDeleteOpen();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setSelectedBundle((prevState) => ({
      ...prevState,
      [name]: parseFloat(value),
    }));
  };

  const hasChanges =
    JSON.stringify(selectedBundle) !== JSON.stringify(originalBundleData);

  const fetchSelectedBundleData = async (id) => {
    const bundleData = await getBundleById(id);
    setOriginalBundleData(bundleData);
    setIsEconomy(bundleData.name.toLowerCase().includes("economy"));
    setIsBusiness(bundleData.name.toLowerCase().includes("business"));
    setSelectedBundle(bundleData);
  };

  const fetchBundleData = async () => {
    const bundleData = await getBundleList();
    setBundleData(bundleData);
  };

  useEffect(() => {
    fetchBundleData();
  }, []);

  const prioCheckIn = [
    { name: "Yes", value: 1 },
    { name: "No", value: 0 },
  ];

  const getCheckInBaggage = () => {
    if (selectedBundle.checkinBaggage40 === 1) {
      return 40;
    } else if (selectedBundle.checkinBaggage30 === 1) {
      return 30;
    } else if (selectedBundle.checkinBaggage20 === 1) {
      return 20;
    } else {
      return 0;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleConfirmOpen();
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await deletBundle(selectedBundle.id);
      setSnackbarMessage(response);
      setSnackbarSeverity("success");
      fetchBundleData();
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

    const bundle = {
      name: selectedBundle.name,
      checkinBaggage: getCheckInBaggage(),
      prioCheckIn: selectedBundle.prioCheckIn,
      domesticPrice: parseFloat(selectedBundle.domesticPrice),
      internationalPrice: parseFloat(selectedBundle.internationalPrice),
    };

    try {
      const response = await editBundle(bundle);
      setSnackbarMessage(response);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleClose();
      fetchBundleData();
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
                Edit Bundle
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <SearchBundleForm onSearch={handleSearch} />
            </Box>
            <Dialog
              open={openDialog}
              handleClose={handleClose}
              title={"Edit Bundle " + selectedBundle.name}
              onSubmit={handleSubmit}
            >
              <Grid container spacing={1}>
                <Grid item md={6}>
                  <TextField
                    name="bundleName"
                    label="Bundle Name"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    value={selectedBundle ? selectedBundle.name : ""}
                    readOnly
                  />

                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel id="prioCheckIn-label">
                      Priority Check-In
                    </InputLabel>
                    <Select
                      labelId="prioCheckIn-label"
                      label="Priority Check-In"
                      id="prioCheckIn"
                      name="prioCheckIn"
                      value={selectedBundle ? selectedBundle.prioCheckIn : ""}
                      onChange={handleInputChange}
                    >
                      {isBusiness ? (
                        <MenuItem value="1">{prioCheckIn[0].name}</MenuItem>
                      ) : (
                        prioCheckIn.map((option, index) => (
                          <MenuItem key={index} value={option.value}>
                            {option.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>

                  <TextField
                    name="internationalPrice"
                    label="Bundle International Price"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="123"
                    value={
                      selectedBundle ? selectedBundle.internationalPrice : ""
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
                    onChange={handleInputChange}
                    type="number"
                    inputProps={{ step: "any" }}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="bundleBaggage"
                    label="Baggage"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 1 }}
                    value={getCheckInBaggage()}
                    readOnly
                  />

                  <TextField
                    name="domesticPrice"
                    label="Bundle Domestic Price"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="123"
                    value={selectedBundle ? selectedBundle.domesticPrice : ""}
                    onChange={handleInputChange}
                    type="number"
                    inputProps={{ step: "any" }}
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
            <BundleTable
              searchTerm={searchTerm}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              bundles={bundleData}
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
            Are you sure you want to delete {selectedBundle.name}?
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

export default EditBundle;
