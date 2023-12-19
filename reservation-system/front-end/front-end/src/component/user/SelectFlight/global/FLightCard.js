import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import { getAirports } from "../../../api";
import FlightPassengerSelector from "../../global/FlightPassengerSelector";
import { SearchContext } from "../../global/SearchContext";

const FlightCard = () => {
  const { searchFlight, handleInputChange, updateSearchFlight, handleSearch } =
    useContext(SearchContext);

  const [errors, setErrors] = useState({});
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const isSelectReturnFlightPage = location.pathname === "/SelectReturnFlight";

  if (!searchFlight.passengers) {
    searchFlight.passengers = { adults: 1, children: 0, babies: 0 };
  }

  const handlePassengerChange = (newPassengers) => {
    updateSearchFlight({
      ...searchFlight,
      passengers: newPassengers,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAirports();
        setAirports(data);
      } catch (error) {
        console.error("Failed to fetch airports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    let errorMessages = {};

    if (!searchFlight.flightDepartureAirport) {
      errorMessages.flightDepartureAirport = "Departure Airport is required";
    }

    if (!searchFlight.flightArrivalAirport) {
      errorMessages.flightArrivalAirport = "Arrival Airport is required";
    }

    if (
      searchFlight.flightDepartureAirport === searchFlight.flightArrivalAirport
    ) {
      errorMessages.flightAirport =
        "Departure and Arrival airports cannot be the same";
    }

    if (!searchFlight.flightDepartureDate) {
      errorMessages.flightDepartureDate = "Departure Date is required";
    }

    if (
      searchFlight.tripType === "roundtrip" &&
      searchFlight.flightReturnDate &&
      searchFlight.flightDepartureDate &&
      dayjs(searchFlight.flightReturnDate).isBefore(
        dayjs(searchFlight.flightDepartureDate)
      )
    ) {
      errorMessages.flightReturnDate =
        "Return Date must be after Departure Date";
    }

    setErrors(errorMessages);

    return Object.keys(errorMessages).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    sessionStorage.removeItem("deapartureFlight");
    sessionStorage.removeItem("returnFlight");

    if (validateForm()) {
      handleSearch();
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        backgroundColor: "black",
        borderRadius: "20px",
        width: 1300,
      }}
    >
      <CardContent>
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                {/* Trip Type */}
                <Grid item xs={4}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel id="trip-type-label">Trip Type</InputLabel>
                    <Select
                      labelId="trip-type-label"
                      id="trip-type"
                      name="tripType"
                      value={searchFlight.tripType || ""}
                      onChange={handleInputChange}
                      label="Trip Type"
                      style={{ borderRadius: "20px" }}
                      readOnly={isSelectReturnFlightPage}
                    >
                      <MenuItem value="roundtrip">Roundtrip</MenuItem>
                      <MenuItem value="one-way">One Way</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Flight Passengers */}
                <Grid item xs={4}>
                  <FlightPassengerSelector
                    passengers={searchFlight.passengers}
                    setPassengers={handlePassengerChange}
                    onPassengerChange={handlePassengerChange}
                  />
                </Grid>

                {/* Flight Class */}
                <Grid item xs={4}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel id="flight-class-label">
                      Flight Class
                    </InputLabel>
                    <Select
                      labelId="flight-class-label"
                      id="flightClass"
                      name="flightClass"
                      value={searchFlight.flightClass || ""}
                      onChange={handleInputChange}
                      label="Flight Class"
                      style={{ borderRadius: "20px" }}
                    >
                      <MenuItem value="Economy">Economy</MenuItem>
                      <MenuItem value="Business">Business</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                {/* Departure Airport */}
                <Grid item xs={3}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    {loading ? (
                      <div>Loading...</div> // Placeholder content
                    ) : (
                      <Autocomplete
                        id="from"
                        options={airports}
                        value={
                          searchFlight.flightDepartureAirport
                            ? airports.find(
                                (option) =>
                                  option.code ===
                                  searchFlight.flightDepartureAirport
                              )
                            : null
                        }
                        getOptionLabel={(option) =>
                          `${option.name} (${option.code})`
                        }
                        onChange={(event, newValue) =>
                          updateSearchFlight({
                            ...searchFlight,
                            flightDepartureAirport: newValue?.code || "",
                          })
                        }
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
                        readOnly={isSelectReturnFlightPage}
                      />
                    )}
                  </FormControl>
                </Grid>

                {/* Arrival Airport */}
                <Grid item xs={3}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    {loading ? (
                      <div>Loading...</div> // Placeholder content
                    ) : (
                      <Autocomplete
                        id="to"
                        options={airports}
                        value={
                          searchFlight.flightArrivalAirport
                            ? airports.find(
                                (option) =>
                                  option.code ===
                                  searchFlight.flightArrivalAirport
                              )
                            : null
                        }
                        getOptionLabel={(option) =>
                          `${option.name} (${option.code})`
                        }
                        onChange={(event, newValue) =>
                          updateSearchFlight({
                            ...searchFlight,
                            flightArrivalAirport: newValue?.code || "",
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="To"
                            variant="outlined"
                            error={!!errors.flightArrivalAirport}
                            helperText={errors.flightArrivalAirport}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "20px",
                              },
                            }}
                          />
                        )}
                        readOnly={isSelectReturnFlightPage}
                      />
                    )}
                  </FormControl>
                </Grid>

                {/* Departure and Return Date */}
                <Grid item xs={5}>
                  {searchFlight.tripType === "roundtrip" ? (
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <DatePicker
                          name="flightDepartureDate"
                          label="Departure Date"
                          minDate={dayjs()}
                          format="DD/MM/YYYY (ddd)"
                          value={
                            searchFlight.flightDepartureDate
                              ? dayjs(searchFlight.flightDepartureDate)
                              : null
                          }
                          onChange={(date) =>
                            handleInputChange(null, date, "flightDepartureDate")
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={!!errors.flightReturnDate}
                              helperText={errors.flightReturnDate}
                            />
                          )}
                          readOnly={isSelectReturnFlightPage}
                          sx={{
                            mt: 2,
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "20px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <DatePicker
                          name="flightReturnDate"
                          label="Returning Date"
                          minDate={dayjs()}
                          format="DD/MM/YYYY (ddd)"
                          value={
                            searchFlight.flightReturnDate
                              ? dayjs(searchFlight.flightReturnDate)
                              : null
                          }
                          onChange={(date) =>
                            handleInputChange(null, date, "flightReturnDate")
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={!!errors.flightReturnDate}
                              helperText={errors.flightReturnDate}
                            />
                          )}
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
                      name="flightDepartureDate"
                      label="Departure Date"
                      minDate={dayjs()}
                      format="DD/MM/YYYY (ddd)"
                      value={
                        searchFlight.flightDepartureDate
                          ? dayjs(searchFlight.flightDepartureDate)
                          : null
                      }
                      onChange={(date) =>
                        handleInputChange(null, date, "flightDepartureDate")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errors.flightDepartureDate}
                          helperText={errors.flightDepartureDate}
                        />
                      )}
                      sx={{
                        mt: 2,
                        width: "100%",
                        "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                      }}
                    />
                  )}
                </Grid>

                {/* Search Button */}
                <Grid
                  item
                  xs={1}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      borderRadius: "20px",
                    }}
                    size="medium"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </form>
          </LocalizationProvider>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FlightCard;
