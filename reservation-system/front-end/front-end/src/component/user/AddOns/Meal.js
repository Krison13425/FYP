import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Collapse,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { getMealList } from "../../api";

const MealList = ({ flightType, handleMealConfirm }) => {
  const [mealData, setMealData] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const handleDetailsClick = () => {
    setDetailsOpen((prevState) => !prevState);
  };

  const fetchsetMealData = async () => {
    const mealData = await getMealList();
    setMealData(mealData);
  };

  useEffect(() => {
    fetchsetMealData();
  }, []);

  const handleCheckboxChange = (id) => {
    if (selectedMeal === null || selectedMeal !== id) {
      setSelectedMeal(id);
      sessionStorage.setItem("MealId", id);
    }
  };

  if (!mealData || mealData.length === 0)
    return (
      <Typography variant="h4" sx={{ mt: 5 }}>
        No meal found
      </Typography>
    );
  return (
    <>
      <Paper
        sx={{ p: 2, mt: 2, mb: 2, width: 1100, borderRadius: "20px" }}
        elevation={0}
        variant="outlined"
        display="flex"
      >
        <Grid container spacing={1}>
          <Grid item xs={3} sx={{ mt: 3, textAlign: "center" }}>
            {flightType === "departure" ? (
              <Typography variant="h3">Select Departure Meal</Typography>
            ) : (
              <Typography variant="h3">Select Return Meal</Typography>
            )}
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            cursor: "pointer",
          }}
          onClick={() => handleDetailsClick()}
        >
          <Typography variant="h7" sx={{ mt: 1.2, cursor: "pointer" }}>
            View Baggage Option
          </Typography>
          <IconButton>
            {detailsOpen ? <ExpandLessOutlinedIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Divider sx={{ mt: 2 }} />
        <Collapse in={detailsOpen}>
          {mealData.map((data) => {
            return (
              <>
                <Grid item>
                  <Card
                    sx={{
                      p: 2,
                      width: "100%",
                      height: "100%",
                      borderRadius: "20px",
                      mt: 2,
                      cursor: "pointer",
                    }}
                    onClick={() => handleCheckboxChange(data.id)}
                  >
                    <Grid
                      container
                      spacing={1}
                      direction="row"
                      wrap="wrap"
                      sx={{ position: "relative" }}
                    >
                      <Grid item xs={6} sx={{ mt: 1, textAlign: "center" }}>
                        <Typography variant="h3" sx={{ mt: 1 }}>
                          {data.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ mt: 1, textAlign: "center" }}>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Checkbox
                            icon={
                              <CheckCircleOutlineIcon
                                sx={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: "50%",
                                  m: "auto",
                                }}
                              />
                            }
                            checkedIcon={
                              <CheckCircleIcon
                                sx={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: "50%",
                                  m: "auto",
                                }}
                              />
                            }
                            checked={selectedMeal === data.id}
                            onChange={() => handleCheckboxChange(data.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </>
            );
          })}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <Button
              onClick={handleMealConfirm}
              variant="contained"
              sx={{
                borderRadius: "20px",
                width: "150px",
                height: "40px",
                fontSize: "1rem",
              }}
              disabled={!selectedMeal}
            >
              Confirm
            </Button>
          </Box>
        </Collapse>
      </Paper>
    </>
  );
};

export default MealList;
