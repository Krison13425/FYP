import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import NoLuggageIcon from "@mui/icons-material/NoLuggage";
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
import { getBaggageList } from "../../api";

const BaggageList = ({ flight, flightType, handleBaggageConfirm }) => {
  const [baggageData, setBaggageData] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBaggage, setSelectedBaggage] = useState(null);

  const handleDetailsClick = () => {
    setDetailsOpen((prevState) => !prevState);
  };

  const fetchsetBaggageData = async () => {
    const baggageData = await getBaggageList();
    setBaggageData(baggageData);
  };

  useEffect(() => {
    fetchsetBaggageData();
  }, []);

  const handleCheckboxChange = (id) => {
    if (selectedBaggage === null || selectedBaggage !== id) {
      setSelectedBaggage(id);
      sessionStorage.setItem("BaggageId", id);
    }
  };

  if (!baggageData || baggageData.length === 0)
    return (
      <Typography variant="h4" sx={{ mt: 5 }}>
        No baggage found
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
          <Grid item xs={5} sx={{ mt: 2, textAlign: "center" }}>
            {flightType === "departure" ? (
              <Typography variant="h3">Departure Add-on Baggage</Typography>
            ) : (
              <Typography variant="h3">Return Add-on Baggage</Typography>
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
          <Grid container spacing={2} direction="row" wrap="wrap">
            {baggageData.map((data) => {
              let price;

              if (flight?.flight_type === 1) {
                price = data.internationalPrice;
              } else {
                price = data.domesticPrice;
              }

              return (
                <>
                  <Grid item>
                    <Card
                      sx={{
                        p: 2,
                        width: 200,
                        height: 300,
                        borderRadius: "20px",
                        mt: 2,
                        cursor: "pointer",
                      }}
                      onClick={() => handleCheckboxChange(data.id)}
                    >
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
                          checked={selectedBaggage === data.id}
                          onChange={() => handleCheckboxChange(data.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Box>
                      <Paper
                        sx={{
                          p: 2,
                          mt: 1,
                          width: 170,
                          height: 200,
                          borderRadius: "20px",
                        }}
                        elevation={3}
                      >
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          {data.kg === 0 ? (
                            <NoLuggageIcon sx={{ fontSize: "35px" }} />
                          ) : (
                            <LuggageOutlinedIcon sx={{ fontSize: "35px" }} />
                          )}
                        </Box>
                        <Grid
                          item
                          xs={12}
                          sx={{
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h3" sx={{ mt: 2 }}>
                            BG {data.kg}
                          </Typography>
                        </Grid>
                        <Grid container spacing={1}>
                          <Grid
                            item
                            xs={12}
                            sx={{
                              textAlign: "center",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="h4" sx={{ mt: 2 }}>
                              + MYR {price}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sx={{
                              textAlign: "center",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="h6" sx={{ mt: 2 }}>
                              {data.kg === 0
                                ? "No Added Baggage"
                                : `Check-in Baggage ${data.kg} kg`}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Card>
                  </Grid>
                </>
              );
            })}
          </Grid>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <Button
              onClick={handleBaggageConfirm}
              variant="contained"
              sx={{
                borderRadius: "20px",
                width: "150px",
                height: "40px",
                fontSize: "1rem",
              }}
              disabled={!selectedBaggage}
            >
              Confirm
            </Button>
          </Box>
        </Collapse>
      </Paper>
    </>
  );
};

export default BaggageList;
