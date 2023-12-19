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
import { createMeal, getMealList } from "../../api";
import Alert from "../Global/Alert";
import Dialog from "../Global/Dailog";
import Sidebar, { DrawerHeader, Main } from "../Sidebar";
import MealTable from "./MealTable";

const CreateMeal = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => {
    setOpenDialog(false);
    resetForm();
  };

  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState(0);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const [mealData, setMealData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const mealData = await getMealList();
      setMealData(mealData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const mealTypeList = [
    { name: "Normal", value: 0 },
    { name: "Vegan", value: 1 },
  ];

  const resetForm = () => {
    setMealName("");
    setMealType(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const meal = {
      name: mealName,
      type: parseFloat(mealType),
    };
    try {
      const response = await createMeal(meal);
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
                Create Meal
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
              title="Add A New Meal"
              onSubmit={handleSubmit}
            >
              <Grid container spacing={1}>
                <Grid item md={6}>
                  <TextField
                    name="mealName"
                    label="Meal Name"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mt: 1 }}
                    placeholder="e.g. Nasi Lemak"
                    onChange={(event) => setMealName(event.target.value)}
                  />
                </Grid>
                <Grid item md={6}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <Autocomplete
                      id="mealType"
                      options={mealTypeList}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, newValue) =>
                        setMealType(newValue.value)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Meal Type"
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
              <MealTable searchTerm={searchTerm} meals={mealData} />
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

export default CreateMeal;
