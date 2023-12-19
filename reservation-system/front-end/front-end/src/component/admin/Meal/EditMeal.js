import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  deletMeal,
  getFilteredMealList,
  getMealById,
  getMealList,
} from "../../api";
import Alert from "../Global/Alert";
import Dialog from "../Global/Dailog";
import Sidebar, { DrawerHeader, Main } from "../Sidebar";
import SearchMealForm from "../forms/SearchMealForm";
import MealTable from "./MealTable";

const EditMeal = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const handleConfirmDeleteOpen = () => setOpenConfirmDeleteDialog(true);
  const handleConfirmDeleteClose = () => setOpenConfirmDeleteDialog(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedMeal, setSelectedMeal] = useState("");
  const [mealData, setMealData] = useState([]);
  const [filterMealType, setfilterMealType] = useState(null);

  const handleSearch = (search) => {
    setSearchTerm(search);
  };

  const handleDeleteClick = (id) => {
    fetchSelectedMealData(id);
    handleConfirmDeleteOpen();
  };

  const handleFilterSubmit = (mealType) => {
    setfilterMealType(mealType);
    fetchFilteredMeal(mealType);
  };

  const mealTypeList = [
    { name: "Normal", value: 0 },
    { name: "Vegan", value: 1 },
  ];

  const fetchSelectedMealData = async (id) => {
    const mealData = await getMealById(id);
    setSelectedMeal(mealData);
  };

  const fetchMealData = async () => {
    const mealData = await getMealList();
    setMealData(mealData);
  };

  const fetchFilteredMeal = async (mealType) => {
    const mealData = await getFilteredMealList(mealType);
    setMealData(mealData);
  };

  useEffect(() => {
    fetchMealData();
  }, []);

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await deletMeal(selectedMeal.id);
      setSnackbarMessage(response);
      setSnackbarSeverity("success");
      if (filterMealType) {
        fetchFilteredMeal(filterMealType);
      } else {
        fetchMealData();
      }
      handleConfirmDeleteClose();
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
                Edit Meal
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <SearchMealForm
                onSearch={handleSearch}
                mealType={mealTypeList}
                onFilterSubmit={handleFilterSubmit}
              />
            </Box>

            <MealTable
              searchTerm={searchTerm}
              handleDeleteClick={handleDeleteClick}
              meals={mealData}
            />
          </Box>

          <Dialog
            open={openConfirmDeleteDialog}
            handleClose={handleConfirmDeleteClose}
            title="Confirm Delete"
            onSubmit={handleConfirmDelete}
          >
            Are you sure you want to delete {selectedMeal.name}?
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

export default EditMeal;
