import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  deletBaggage,
  editBaggage,
  getBaggageById,
  getBaggageList,
} from "../../api";
import Alert from "../Global/Alert";
import Dialog from "../Global/Dailog";
import Sidebar, { DrawerHeader, Main } from "../Sidebar";
import SearchBundleForm from "../forms/SearchBundleForm";
import BaggageTable from "./BaggageTable";

const EditBaggage = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => {
    setOpenDialog(false);
    setSelectedBaggage("");
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

  const [selectedBaggage, setSelectedBaggage] = useState("");
  const [baggageData, setBaggageData] = useState([]);
  const [originalBaggageData, setOriginalBaggageData] = useState("");

  const handleSearch = (search) => {
    setSearchTerm(search);
  };

  const handleEditClick = (id) => {
    fetchSelectedBaggageData(id);
    handleOpen();
  };

  const handleDeleteClick = (id) => {
    fetchSelectedBaggageData(id);
    handleConfirmDeleteOpen();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setSelectedBaggage((prevState) => ({
      ...prevState,
      [name]: parseFloat(value),
    }));
  };

  const hasChanges =
    JSON.stringify(selectedBaggage) !== JSON.stringify(originalBaggageData);

  const fetchSelectedBaggageData = async (id) => {
    const baggageData = await getBaggageById(id);
    setOriginalBaggageData(baggageData);
    setSelectedBaggage(baggageData);
  };

  const fetchBundleData = async () => {
    const baggageData = await getBaggageList();
    setBaggageData(baggageData);
  };

  useEffect(() => {
    fetchBundleData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleConfirmOpen();
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await deletBaggage(selectedBaggage.id);
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

    const baggage = {
      name: selectedBaggage.name,
      kg: selectedBaggage.kg,
      domesticPrice: parseFloat(selectedBaggage.domesticPrice),
      internationalPrice: parseFloat(selectedBaggage.internationalPrice),
    };

    try {
      const response = await editBaggage(baggage);
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
                Edit Baggage
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <SearchBundleForm onSearch={handleSearch} />
            </Box>
            <Dialog
              open={openDialog}
              handleClose={handleClose}
              title={"Edit " + selectedBaggage.name}
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
                    value={selectedBaggage ? selectedBaggage.name : ""}
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
                    value={selectedBaggage ? selectedBaggage.domesticPrice : ""}
                    onChange={handleInputChange}
                    type="number"
                    inputProps={{ step: "any" }}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="baggageKg"
                    label="Baggage KG"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    value={selectedBaggage ? `${selectedBaggage.kg} KG` : ""}
                    readOnly
                  />

                  <TextField
                    name="internationalPrice"
                    label="Bundle International Price"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="123"
                    value={
                      selectedBaggage ? selectedBaggage.internationalPrice : ""
                    }
                    onChange={handleInputChange}
                    type="number"
                    inputProps={{ step: "any" }}
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
            <BaggageTable
              searchTerm={searchTerm}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              baggages={baggageData}
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
            Are you sure you want to delete {selectedBaggage.name}?
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

export default EditBaggage;
