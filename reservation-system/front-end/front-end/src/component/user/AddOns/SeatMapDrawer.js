import ChildFriendlyOutlinedIcon from "@mui/icons-material/ChildFriendlyOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FoodBankOutlinedIcon from "@mui/icons-material/FoodBankOutlined";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import {
  Box,
  Button,
  Card,
  Drawer,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  getAirplaneById,
  getBookedSeats,
  getNotAvailableSeats,
} from "../../api";

function SeatMapDrawer({
  flight,
  open,
  toggleDrawer,
  handleSeatConfirm,
  flightData,
}) {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seats, setSeats] = useState([]);
  const [notAvailableSeats, setNotAvailableSeats] = useState({});
  const [bookedSeats, setBookedSeats] = useState({});
  const [airplanetData, setAirplanetData] = useState(null);
  const theme = useTheme();

  console.log(flightData);
  const handleBoxClick = (rowIndex, seatIndex) => {
    const seatAlphabet = getSeatAlphabet(seatIndex);

    let modifiedRowIndex = rowIndex + 1;
    if (airplanetData?.type === 0 && flight?.class === "Economy") {
      modifiedRowIndex += 5;
    } else if (airplanetData?.type === 1 && flight?.class === "Economy") {
      modifiedRowIndex += 9;
    }

    const selectedSeat = { rowIndex, seatIndex, seatAlphabet };
    const sessionSelectedSeat = { modifiedRowIndex, seatIndex, seatAlphabet };
    setSelectedSeat(selectedSeat);
    sessionStorage.setItem("selectedSeat", JSON.stringify(sessionSelectedSeat));
  };

  const fetchNotAvalableFlightSeat = async (airplaneId) => {
    const seatData = await getNotAvailableSeats(airplaneId);
    const seatsMap = seatData.reduce((map, seat) => {
      const [row, seatLetter] = [seat.slice(0, -1), seat.slice(-1)];
      if (!map[row]) map[row] = [];
      map[row].push(seatLetter);
      return map;
    }, {});

    setNotAvailableSeats(seatsMap);
  };

  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      const departureflight = JSON.parse(
        sessionStorage.getItem("departureFlight")
      );

      const returnflight = JSON.parse(sessionStorage.getItem("returnFlight"));

      console.log(flightData?.id);
      console.log(departureflight?.id);

      if (flightData?.id === departureflight?.id) {
        const adultAndBabyKeys = Object.keys(sessionStorage).filter(
          (key) => key.startsWith("Adult") || key.startsWith("Baby")
        );

        let newBookedSeats = {};

        adultAndBabyKeys.forEach((key) => {
          const data = JSON.parse(sessionStorage.getItem(key));
          if (data.departureSeat) {
            const { modifiedRowIndex, seatAlphabet } = data.departureSeat;

            if (!newBookedSeats[modifiedRowIndex])
              newBookedSeats[modifiedRowIndex] = [];
            newBookedSeats[modifiedRowIndex].push(seatAlphabet);
          }
        });

        try {
          const seatData = await getBookedSeats(flightData?.id);
          const seatsMap = seatData.reduce((map, seat) => {
            const [row, seatLetter] = [seat.slice(0, -1), seat.slice(-1)];

            if (!map[row]) map[row] = [];
            map[row].push(seatLetter);
            return map;
          }, {});

          Object.keys(seatsMap).forEach((key) => {
            if (newBookedSeats[key]) {
              newBookedSeats[key] = [
                ...new Set([...seatsMap[key], ...newBookedSeats[key]]),
              ];
            } else {
              newBookedSeats[key] = seatsMap[key];
            }
          });
        } catch (error) {
          throw error;
        }

        setBookedSeats(newBookedSeats);
      }

      if (flightData?.id === returnflight?.id) {
        const adultAndBabyKeys = Object.keys(sessionStorage).filter(
          (key) => key.startsWith("Adult") || key.startsWith("Baby")
        );

        let newBookedSeats = {};

        adultAndBabyKeys.forEach((key) => {
          const data = JSON.parse(sessionStorage.getItem(key));
          if (data.returnSeat) {
            const { modifiedRowIndex, seatAlphabet } = data.returnSeat;

            if (!newBookedSeats[modifiedRowIndex])
              newBookedSeats[modifiedRowIndex] = [];
            newBookedSeats[modifiedRowIndex].push(seatAlphabet);
          }
        });

        try {
          const seatData = await getBookedSeats(flightData.id);
          const seatsMap = seatData.reduce((map, seat) => {
            const [row, seatLetter] = [seat.slice(0, -1), seat.slice(-1)];

            if (!map[row]) map[row] = [];
            map[row].push(seatLetter);
            return map;
          }, {});

          // Merge the seatsMap and newBookedSeats
          Object.keys(seatsMap).forEach((key) => {
            if (newBookedSeats[key]) {
              newBookedSeats[key] = [
                ...new Set([...seatsMap[key], ...newBookedSeats[key]]),
              ]; // merge arrays and remove duplicates
            } else {
              newBookedSeats[key] = seatsMap[key]; // if key doesn't exist in newBookedSeats, create it
            }
          });
        } catch (error) {
          throw error;
        }

        // Set the new data to state
        setBookedSeats(newBookedSeats);
      }

      // Fetch other data
      fetchNotAvalableFlightSeat(flightData.airplane_id);
      fetchAirplaneData(flightData.airplane_id);
    };

    if (flightData) {
      fetchDataAndUpdateState();
    }
  }, [flightData]);

  const isSeatAvailable = (rowIndex, seatIndex) => {
    const adjustedRowIndex =
      rowIndex +
      (airplanetData?.type === 0 && flight?.class === "Economy" ? 5 : 1) +
      (airplanetData?.type === 1 && flight?.class === "Economy" ? 9 : 0);

    const rowSeats = notAvailableSeats[adjustedRowIndex];
    if (!rowSeats) return true;
    return !rowSeats.includes(getSeatAlphabet(seatIndex));
  };

  const isSeatBooked = (rowIndex, seatIndex) => {
    const adjustedRowIndex =
      rowIndex +
      (airplanetData?.type === 0 && flight?.class === "Economy" ? 5 : 1) +
      (airplanetData?.type === 1 && flight?.class === "Economy" ? 9 : 0);

    const rowSeats = bookedSeats[adjustedRowIndex];
    if (!rowSeats) return false;
    return rowSeats.includes(getSeatAlphabet(seatIndex));
  };

  const fetchAirplaneData = async (id) => {
    const airplaneData = await getAirplaneById(id);
    setAirplanetData(airplaneData);
  };

  useEffect(() => {
    if (airplanetData?.type === 0 && flight?.class === "Business") {
      setSeats(Array(2).fill(Array(4).fill(false)));
    } else if (airplanetData?.type === 0 && flight?.class === "Economy") {
      setSeats(Array(23).fill(Array(6).fill(false)));
    } else if (airplanetData?.type === 1 && flight?.class === "Business") {
      setSeats(Array(5).fill(Array(6).fill(false)));
    } else {
      setSeats(Array(34).fill(Array(8).fill(false)));
    }
  }, [airplanetData, flight]);

  const getSeatAlphabet = (seatIndex) => {
    return String.fromCharCode(65 + seatIndex);
  };

  return (
    <Drawer
      sx={{
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 800,
        },
      }}
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          height: 10000,
          color: "white",
          p: 5,
          position: "relative",
        }}
      >
        <Box display="flex" justifyContent="center">
          <Card sx={{ width: 300, borderRadius: "20px", p: 2 }}>
            <Box display="flex" justifyContent="center">
              <Grid container spacing={2}>
                <Grid item xs={4} sx={{ textAlign: "center" }}>
                  <WcOutlinedIcon fontSize="large" />{" "}
                  <Typography>Toilet</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}>
                  <FoodBankOutlinedIcon fontSize="large" />{" "}
                  <Typography>Galley</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}>
                  <ChildFriendlyOutlinedIcon fontSize="large" />{" "}
                  <Typography>Bassinet</Typography>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Box>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {airplanetData?.type === 1 && flight?.class === "Business" && (
            <>
              <Grid container justifyContent="center">
                <Grid item xs={4} sx={{ textAlign: "right", mt: 2 }}>
                  <WcOutlinedIcon fontSize="large" />
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center", mt: 2 }}></Grid>
                <Grid item xs={4} sx={{ textAlign: "left", mt: 2 }}>
                  <FoodBankOutlinedIcon fontSize="large" />
                </Grid>
              </Grid>
              <Grid container justifyContent="center">
                <Grid item xs={3} sx={{ textAlign: "right", mt: 2 }}>
                  <KeyboardDoubleArrowLeftOutlinedIcon />
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "center", mt: 2 }}>
                  <Typography variant="h3"> EXIT </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: "left", mt: 2 }}>
                  <KeyboardDoubleArrowRightOutlinedIcon />
                </Grid>
              </Grid>
            </>
          )}

          {airplanetData?.type === 0 && flight?.class === "Business" && (
            <>
              <Grid container justifyContent="center">
                <Grid item xs={4} sx={{ textAlign: "right", mt: 2 }}>
                  <WcOutlinedIcon fontSize="large" />
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center", mt: 2 }}></Grid>
                <Grid item xs={4} sx={{ textAlign: "left", mt: 2 }}>
                  <FoodBankOutlinedIcon fontSize="large" />
                </Grid>
              </Grid>
              <Grid container justifyContent="center">
                <Grid item xs={3} sx={{ textAlign: "right", mt: 2 }}>
                  <KeyboardDoubleArrowLeftOutlinedIcon />
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "center", mt: 2 }}>
                  <Typography variant="h3"> EXIT </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: "left", mt: 2 }}>
                  <KeyboardDoubleArrowRightOutlinedIcon />
                </Grid>
              </Grid>
            </>
          )}

          {airplanetData?.type === 1 && flight?.class === "Economy" ? (
            <>
              <Grid container justifyContent="center">
                <Grid item xs={4} sx={{ textAlign: "right", mt: 2 }}>
                  <WcOutlinedIcon fontSize="large" />
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center", mt: 2 }}>
                  <FoodBankOutlinedIcon fontSize="large" />
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "left", mt: 2 }}>
                  <WcOutlinedIcon fontSize="large" />
                </Grid>
              </Grid>
              <Grid container justifyContent="center">
                <Grid item xs={3} sx={{ textAlign: "right", mt: 2 }}>
                  <KeyboardDoubleArrowLeftOutlinedIcon />
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "center", mt: 2 }}>
                  <Typography variant="h3"> EXIT </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: "left", mt: 2 }}>
                  <KeyboardDoubleArrowRightOutlinedIcon />
                </Grid>
              </Grid>
              <Grid container justifyContent="center">
                <Grid item xs={3} sx={{ textAlign: "right", mt: 2 }}></Grid>
                <Grid item xs={6} sx={{ textAlign: "center", mt: 2 }}>
                  <FoodBankOutlinedIcon fontSize="large" />
                </Grid>
                <Grid item xs={3} sx={{ textAlign: "left", mt: 2 }}></Grid>
              </Grid>
              <Grid
                container
                justifyContent="center"
                direction="row"
                sx={{ mt: 2 }}
              >
                <Grid item xs={12} sx={{ mt: 2, ml: 22 }}>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Box sx={{ mr: 15 }}>
                      <ChildFriendlyOutlinedIcon fontSize="large" />
                    </Box>
                    <Box sx={{ mr: 22 }}>
                      <ChildFriendlyOutlinedIcon fontSize="large" />
                    </Box>
                    <ChildFriendlyOutlinedIcon fontSize="large" />
                  </Box>
                </Grid>
              </Grid>
            </>
          ) : null}

          {airplanetData?.type === 1 && flight?.class === "Business" && (
            <>
              <Grid container justifyContent="center">
                <Grid item xs={3} sx={{ textAlign: "right", mt: 2 }}></Grid>
                <Grid item xs={6} sx={{ textAlign: "center", mt: 2 }}>
                  <FoodBankOutlinedIcon fontSize="large" />
                </Grid>
                <Grid item xs={3} sx={{ textAlign: "left", mt: 2 }}>
                  <WcOutlinedIcon fontSize="large" />
                </Grid>
              </Grid>
              <Grid
                container
                justifyContent="center"
                direction="row"
                sx={{ mt: 2 }}
              >
                <Grid item xs={12} sx={{ mt: 2, ml: 31 }}>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Box sx={{ mr: 14 }}>
                      <ChildFriendlyOutlinedIcon fontSize="large" />
                    </Box>
                    <Box sx={{ mr: 8 }}>
                      <ChildFriendlyOutlinedIcon fontSize="large" />
                    </Box>
                    <ChildFriendlyOutlinedIcon fontSize="large" />
                  </Box>
                </Grid>
              </Grid>
            </>
          )}

          {seats.map((row, rowIndex) => (
            <Grid item xs={12} key={rowIndex}>
              <Grid container justifyContent="center">
                <Grid item xs={1} sx={{ mt: rowIndex === 0 ? 4 : 2 }}>
                  <Typography sx={{ ml: 6 }} variant="caption">{` ${
                    rowIndex +
                    (airplanetData?.type === 0 && flight?.class === "Economy"
                      ? 5
                      : 1) +
                    (airplanetData?.type === 1 && flight?.class === "Economy"
                      ? 9
                      : 0)
                  }`}</Typography>
                </Grid>
                {row.map((seat, seatIndex) => {
                  if (
                    airplanetData?.type === 1 &&
                    flight?.class === "Economy" &&
                    (rowIndex === 18 || rowIndex === 19) &&
                    (seatIndex === 0 || seatIndex === 1)
                  ) {
                    if (seatIndex === 1) {
                      return (
                        <Grid item xs={1}>
                          <WcOutlinedIcon fontSize="large" />
                        </Grid>
                      );
                    } else {
                      return <Grid item xs={1} />;
                    }
                  }

                  if (
                    airplanetData?.type === 1 &&
                    flight?.class === "Economy" &&
                    rowIndex === 19 &&
                    seatIndex >= 2 &&
                    seatIndex <= 5
                  ) {
                    if (seatIndex === 4) {
                      return (
                        <>
                          <Grid item xs={1.5}>
                            <WcOutlinedIcon fontSize="large" />
                          </Grid>
                        </>
                      );
                    } else {
                      return <Grid item xs={1} />;
                    }
                  }
                  return airplanetData?.type === 1 &&
                    flight?.class === "Economy" &&
                    rowIndex >= seats.length - 4 &&
                    seatIndex === 4 ? null : (
                    <Grid
                      item
                      key={seatIndex}
                      sx={{
                        ml:
                          (seatIndex === 3 &&
                            airplanetData?.type === 0 &&
                            flight?.class === "Economy") ||
                          (seatIndex === 2 &&
                            airplanetData?.type === 0 &&
                            flight?.class === "Business") ||
                          ((seatIndex === 2 || seatIndex === 4) &&
                            airplanetData?.type === 1 &&
                            flight?.class === "Business")
                            ? 5
                            : (seatIndex === 2 || seatIndex === 6) &&
                              airplanetData?.type === 1 &&
                              flight?.class === "Economy"
                            ? 5
                            : 1,
                      }}
                    >
                      {rowIndex === 0 && (
                        <Typography sx={{ ml: 3 }} variant="caption">
                          {getSeatAlphabet(seatIndex)}
                        </Typography>
                      )}
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 2,
                          backgroundColor:
                            !isSeatAvailable(rowIndex, seatIndex) ||
                            isSeatBooked(rowIndex, seatIndex)
                              ? "grey"
                              : selectedSeat &&
                                selectedSeat.rowIndex === rowIndex &&
                                selectedSeat.seatIndex === seatIndex
                              ? theme.palette.primary.main
                              : theme.palette.primary.dark,
                          cursor:
                            !isSeatAvailable(rowIndex, seatIndex) ||
                            isSeatBooked(rowIndex, seatIndex)
                              ? "not-allowed"
                              : "pointer",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onClick={() => {
                          if (
                            isSeatAvailable(rowIndex, seatIndex) &&
                            !isSeatBooked(rowIndex, seatIndex)
                          ) {
                            handleBoxClick(rowIndex, seatIndex);
                          }
                        }}
                      >
                        {!isSeatAvailable(rowIndex, seatIndex) && (
                          <CloseOutlinedIcon />
                        )}
                      </Box>
                    </Grid>
                  );
                })}
                <Grid item xs={1} sx={{ mt: rowIndex === 0 ? 4 : 2 }}>
                  <Typography sx={{ ml: 2 }} variant="caption">
                    {` ${
                      rowIndex +
                      (airplanetData?.type === 0 && flight?.class === "Economy"
                        ? 5
                        : 1) +
                      (airplanetData?.type === 1 && flight?.class === "Economy"
                        ? 9
                        : 0)
                    }`}
                  </Typography>
                </Grid>
              </Grid>
              {airplanetData?.type === 0 &&
                flight?.class === "Economy" &&
                rowIndex === 9 && (
                  <Grid container justifyContent="center" alignItems="center">
                    <Grid item xs={3} sx={{ textAlign: "right", mt: 2 }}>
                      <KeyboardDoubleArrowLeftOutlinedIcon />
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "center", mt: 2 }}>
                      <Typography variant="h3"> EXIT </Typography>
                    </Grid>
                    <Grid item xs={3} sx={{ textAlign: "left", mt: 2 }}>
                      <KeyboardDoubleArrowRightOutlinedIcon />
                    </Grid>
                  </Grid>
                )}{" "}
              {airplanetData?.type === 0 &&
                flight?.class === "Economy" &&
                rowIndex === 10 && (
                  <Grid container justifyContent="center" alignItems="center">
                    <Grid item xs={3} sx={{ textAlign: "right", mt: 2 }}>
                      <KeyboardDoubleArrowLeftOutlinedIcon />
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "center", mt: 2 }}>
                      <Typography variant="h3"> EXIT </Typography>
                    </Grid>
                    <Grid item xs={3} sx={{ textAlign: "left", mt: 2 }}>
                      <KeyboardDoubleArrowRightOutlinedIcon />
                    </Grid>
                  </Grid>
                )}
              {airplanetData?.type === 1 &&
                flight?.class === "Economy" &&
                rowIndex === 19 && (
                  <>
                    <Grid container justifyContent="center" alignItems="center">
                      <Grid item xs={3} sx={{ textAlign: "right", mt: 2 }}>
                        <KeyboardDoubleArrowLeftOutlinedIcon />
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "center", mt: 2 }}>
                        <Typography variant="h3"> EXIT </Typography>
                      </Grid>
                      <Grid item xs={3} sx={{ textAlign: "left", mt: 2 }}>
                        <KeyboardDoubleArrowRightOutlinedIcon />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      justifyContent="center"
                      direction="row"
                      sx={{ mt: 2 }}
                    >
                      <Grid item xs={12} sx={{ mt: 2, ml: 32 }}>
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                          <Box sx={{ mr: 18 }}>
                            <ChildFriendlyOutlinedIcon fontSize="large" />
                          </Box>
                          <Box sx={{ mr: 22 }}>
                            <ChildFriendlyOutlinedIcon fontSize="large" />
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </>
                )}
              {rowIndex === seats.length - 1 &&
                airplanetData?.type === 1 &&
                flight?.class === "Economy" && (
                  <>
                    <Grid container justifyContent="center">
                      <Grid item xs={3} sx={{ textAlign: "right", mt: 2 }}>
                        {" "}
                        <WcOutlinedIcon fontSize="large" />
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "center", mt: 2 }}>
                        <FoodBankOutlinedIcon fontSize="large" />
                      </Grid>
                      <Grid item xs={3} sx={{ textAlign: "left", mt: 2 }}>
                        <WcOutlinedIcon fontSize="large" />
                      </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                      <Grid item xs={3} sx={{ textAlign: "right", mt: 2 }}>
                        <KeyboardDoubleArrowLeftOutlinedIcon />
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "center", mt: 2 }}>
                        <Typography variant="h3"> EXIT </Typography>
                      </Grid>
                      <Grid item xs={3} sx={{ textAlign: "left", mt: 2 }}>
                        <KeyboardDoubleArrowRightOutlinedIcon />
                      </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                      <Grid item xs={4} sx={{ textAlign: "right", mt: 2 }}>
                        {" "}
                        <FoodBankOutlinedIcon fontSize="large" />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sx={{ textAlign: "center", mt: 2 }}
                      ></Grid>
                      <Grid item xs={4} sx={{ textAlign: "left", mt: 2 }}>
                        <FoodBankOutlinedIcon fontSize="large" />
                      </Grid>
                    </Grid>
                  </>
                )}
              {rowIndex === seats.length - 1 &&
                airplanetData?.type === 0 &&
                flight?.class === "Economy" && (
                  <>
                    <Grid container justifyContent="center">
                      <Grid item xs={4} sx={{ textAlign: "right", mt: 2 }}>
                        <WcOutlinedIcon fontSize="large" />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sx={{ textAlign: "center", mt: 2 }}
                      ></Grid>
                      <Grid item xs={4} sx={{ textAlign: "left", mt: 2 }}>
                        <FoodBankOutlinedIcon fontSize="large" />
                      </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                      <Grid item xs={3} sx={{ textAlign: "right", mt: 2 }}>
                        <KeyboardDoubleArrowLeftOutlinedIcon />
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "center", mt: 2 }}>
                        <Typography variant="h3"> EXIT </Typography>
                      </Grid>
                      <Grid item xs={3} sx={{ textAlign: "left", mt: 2 }}>
                        <KeyboardDoubleArrowRightOutlinedIcon />
                      </Grid>
                    </Grid>
                  </>
                )}
            </Grid>
          ))}
        </Grid>
      </Paper>
      <Paper
        sx={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "#000000",
          p: 2,
          width: 784,
          height: "70px",
        }}
        elevation={0}
      >
        <Grid container justifyContent="center">
          <Grid item xs={6}>
            <Typography variant="h3">
              {selectedSeat &&
                `Seat ${
                  selectedSeat.rowIndex +
                  (airplanetData?.type === 0 && flight?.class === "Economy"
                    ? 5
                    : airplanetData?.type === 1 && flight?.class === "Economy"
                    ? 9
                    : 0) +
                  1
                }${selectedSeat.seatAlphabet}`}
            </Typography>
          </Grid>
          <Grid item xs={5} sx={{ alignContent: "center" }}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                sx={{ borderRadius: "15px" }}
                size="medium"
                onClick={handleSeatConfirm}
              >
                Select Seat
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Drawer>
  );
}

export default SeatMapDrawer;
