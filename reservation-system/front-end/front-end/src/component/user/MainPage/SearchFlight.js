import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAirports } from "../../api";
import FlightPassengerSelector from "../global/FlightPassengerSelector";
import { SearchContext } from "../global/SearchContext";

const SearchFlight = () => {
  const [errors, setErrors] = useState({
    flightDepartureDate: null,
    flightReturnDate: null,
    flightAirport: null,
    flightDepartureAirport: null,
  });
  const [airports, setAirports] = useState([]);

  const [flightDepartureAirport, setFlightepartureAirport] = useState("");
  const [flightArrivalAirport, setFlightArrivalAirport] = useState("");
  const [flightDepartureDate, setFlightDepartureDate] = useState(dayjs());
  const [flightReturnDate, setFlightReturnDate] = useState(
    dayjs().add(5, "day")
  );
  const [tripType, setTripType] = useState("roundtrip");
  const [flightClass, setFlightClass] = useState("Economy");

  const { updateSearchFlight } = useContext(SearchContext);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    babies: 0,
  });

  const navigate = useNavigate();

  const fetchAirports = async () => {
    try {
      const data = await getAirports();
      setAirports(data);
    } catch (error) {
      console.error("Failed to fetch airports:", error);
    }
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  const handleFlightSearch = async (e) => {
    e.preventDefault();

    let errorMessages = {};

    if (!flightDepartureDate) {
      errorMessages.flightDepartureDate = "Departure Date is required";
    }

    if (!flightReturnDate) {
      errorMessages.flightReturnDate = "Return Date is required";
    }

    if (!flightArrivalAirport) {
      errorMessages.flightArrivalAirport = "Arrival Airport is required";
    }

    if (!flightArrivalAirport) {
      errorMessages.flightArrivalAirport = "Arrival Airport is required";
    } else if (flightDepartureAirport === flightArrivalAirport) {
      errorMessages.flightAirport =
        "Departure and Arrival airports cannot be the same";
    }

    if (!flightDepartureAirport) {
      errorMessages.flightDepartureAirport = "Departure Airport is required";
    }

    if (
      tripType === "roundtrip" &&
      flightReturnDate &&
      flightDepartureDate &&
      flightReturnDate.isBefore(flightDepartureDate)
    ) {
      errorMessages.flightReturnDate =
        "Return Date must be after Departure Date";
    }

    if (Object.keys(errorMessages).length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...errorMessages,
      }));
      return;
    }
    let searchFlight;
    if (tripType === "roundtrip") {
      searchFlight = {
        flightDepartureAirport,
        flightArrivalAirport,
        flightDepartureDate,
        flightReturnDate,
        tripType,
        flightClass,
        passengers,
      };
    } else {
      searchFlight = {
        flightDepartureAirport,
        flightArrivalAirport,
        flightDepartureDate,
        tripType,
        flightClass,
        passengers,
      };
    }

    updateSearchFlight(searchFlight);

    navigate("/SelectDepartureFlight");
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "-25%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: 1000,
          height: 300,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          borderRadius: "20px",
        }}
      >
        <CardContent>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={tripType}
                    onChange={(event) => setTripType(event.target.value)}
                  >
                    <FormControlLabel
                      value="roundtrip"
                      control={<Radio />}
                      label="Roundtrip"
                    />
                    <FormControlLabel
                      value="one-way"
                      control={<Radio />}
                      label="One Way"
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Autocomplete
                      id="from"
                      options={airports}
                      getOptionLabel={(option) =>
                        `${option.name} (${option.code})`
                      }
                      onChange={(event, newValue) => {
                        setFlightepartureAirport(newValue?.code);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          flightAirport: null,
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="From"
                          variant="outlined"
                          error={!!errors.flightDepartureAirport}
                          helperText={errors.flightDepartureAirport}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "20px",
                            },
                          }}
                        />
                      )}
                    />
                  </FormControl>

                  {tripType === "roundtrip" ? (
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <DatePicker
                          label="Departure Date"
                          minDate={dayjs()}
                          value={flightDepartureDate}
                          onChange={(newValue) => {
                            setFlightDepartureDate(newValue);
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              flightDepartureDate: null,
                            }));
                          }}
                          renderInput={(params) => <TextField {...params} />}
                          sx={{
                            mt: 2,
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "20px",
                            },
                          }}
                        />
                        {errors.flightReturnDate && (
                          <Typography
                            style={{ color: "red", fontSize: "0.8rem" }}
                          >
                            {errors.flightReturnDate}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        <DatePicker
                          label="Returning Date"
                          minDate={dayjs()}
                          value={flightReturnDate}
                          onChange={(newValue) => {
                            setFlightReturnDate(newValue);
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              flightReturnDate: null,
                            }));
                          }}
                          renderInput={(params) => <TextField {...params} />}
                          sx={{
                            mt: 2,
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "20px",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <DatePicker
                      label="Departure Date"
                      minDate={dayjs()}
                      value={flightDepartureDate}
                      onChange={(newValue) => {
                        setFlightDepartureDate(newValue);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          flightDepartureDate: null,
                        }));
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      sx={{
                        mt: 2,
                        width: "100%",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "20px",
                        },
                      }}
                    />
                  )}

                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel id="flight-class-label">
                      Flight Class
                    </InputLabel>
                    <Select
                      labelId="flight-class-label"
                      id="flight-class"
                      value={flightClass}
                      onChange={(event) => {
                        setFlightClass(event.target.value);
                      }}
                      label="Flight Class"
                      style={{ borderRadius: "20px" }}
                    >
                      <MenuItem value="Economy">Economy</MenuItem>
                      <MenuItem value="Business">Business</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Autocomplete
                      id="to"
                      options={airports}
                      getOptionLabel={(option) =>
                        `${option.name} (${option.code})`
                      }
                      onChange={(event, newValue) => {
                        setFlightArrivalAirport(newValue?.code);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          flightAirport: null,
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="To"
                          variant="outlined"
                          error={
                            !!(
                              errors.flightArrivalAirport ||
                              errors.flightAirport
                            )
                          }
                          helperText={
                            errors.flightArrivalAirport || errors.flightAirport
                          }
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "20px",
                            },
                          }}
                        />
                      )}
                    />
                  </FormControl>

                  <FlightPassengerSelector
                    passengers={passengers}
                    setPassengers={setPassengers}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 5,
                      mb: 2,
                    }}
                  >
                    <Button
                      onClick={handleFlightSearch}
                      variant="contained"
                      sx={{
                        borderRadius: "20px",
                      }}
                      size="medium"
                    >
                      Search
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SearchFlight;
