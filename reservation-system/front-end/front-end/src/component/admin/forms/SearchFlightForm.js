import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  Paper,
  TextField,
  Toolbar,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import { getAirports } from "../../api";

const SearchFlightForm = ({ onFilter }) => {
  const [filterDepartureDateStart, setFilterDepartureDateStart] =
    useState(null);
  const [filterDepartureDateEnd, setFilterDepartureDateEnd] = useState(null);
  const [filterArrivalDateStart, setFilterArrivalDateStart] = useState(null);
  const [filterArrivalDateEnd, setFilterArrivalDateEnd] = useState(null);
  const [filterDepartureAirport, setFilterDepartureAirport] = useState(null);
  const [filterArrivalAirport, setFilterArrivalAirport] = useState(null);
  const [filterFlightType, setFilterFlightType] = useState(null);
  const [filterFlightStatus, setFilterFlightStatus] = useState(null);

  const [airports, setAirports] = useState(null);

  const flightType = [
    { name: "Domestic", value: 0 },
    { name: "International", value: 1 },
  ];

  const flightStatus = [
    { name: "Booking", value: 0 },
    { name: "Onboarding", value: 1 },
    { name: "Depatured", value: 2 },
    { name: "Arrived", value: 3 },
    { name: "Delayed", value: 4 },
  ];

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

  const handleClear = () => {
    setFilterDepartureDateStart(null);
    setFilterDepartureDateEnd(null);
    setFilterArrivalDateStart(null);
    setFilterArrivalDateEnd(null);
    setFilterDepartureAirport(null);
    setFilterArrivalAirport(null);
    setFilterFlightType(null);
    setFilterFlightStatus(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const filters = {
      filterDepartureDateStart,
      filterDepartureDateEnd,
      filterArrivalDateStart,
      filterArrivalDateEnd,
      filterDepartureAirport,
      filterArrivalAirport,
      filterFlightType,
      filterFlightStatus,
    };

    onFilter(filters);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Paper elevation={2}>
        <Toolbar>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="on"
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "left",
              m: "0 auto",
              padding: "0 20px",
              width: "100%",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={1}>
                <Grid item md={3}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Autocomplete
                      id="departure-airport"
                      options={airports}
                      getOptionLabel={(option) =>
                        `${option.code} - ${option.name}`
                      }
                      onChange={(event, newValue) =>
                        setFilterDepartureAirport(newValue?.code)
                      }
                      value={
                        filterDepartureAirport
                          ? airports.find(
                              (airport) =>
                                airport.code === filterDepartureAirport
                            )
                          : null
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Departure Airport"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Autocomplete
                      id="arrival-airport"
                      options={airports}
                      getOptionLabel={(option) =>
                        `${option.code} - ${option.name}`
                      }
                      onChange={(event, newValue) =>
                        setFilterArrivalAirport(newValue?.code)
                      }
                      value={
                        filterArrivalAirport
                          ? airports.find(
                              (airport) => airport.code === filterArrivalAirport
                            )
                          : null
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Arrival Airport"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Autocomplete
                      id="flight-type"
                      options={flightType}
                      getOptionLabel={(option) => `${option.name}`}
                      onChange={(event, newValue) =>
                        setFilterFlightType(newValue?.value)
                      }
                      value={
                        filterFlightType !== null
                          ? flightType.find(
                              (status) => status.value === filterFlightType
                            )
                          : null
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Flight Type"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3}>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Autocomplete
                      id="flight-status"
                      options={flightStatus}
                      getOptionLabel={(option) => `${option.name}`}
                      onChange={(event, newValue) =>
                        setFilterFlightStatus(newValue?.value)
                      }
                      value={
                        filterFlightStatus !== null
                          ? flightStatus.find(
                              (type) => type.value === filterFlightStatus
                            )
                          : null
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Flight Status"
                          variant="outlined"
                          required
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item md={3}>
                  <DatePicker
                    label="Departure Date Start"
                    value={filterDepartureDateStart}
                    onChange={(newValue) => {
                      setFilterDepartureDateStart(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ mt: 2, width: "100%" }}
                  />
                </Grid>
                <Grid item md={3}>
                  <DatePicker
                    label="Departure Date End"
                    value={filterDepartureDateEnd}
                    onChange={(newValue) => {
                      setFilterDepartureDateEnd(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ mt: 2, width: "100%" }}
                  />
                </Grid>
                <Grid item md={3}>
                  <DatePicker
                    label="Arrival Date Start"
                    value={filterArrivalDateStart}
                    onChange={(newValue) => {
                      setFilterArrivalDateStart(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ mt: 2, width: "100%" }}
                  />
                </Grid>
                <Grid item md={3}>
                  <DatePicker
                    label="Arrival Date End"
                    value={filterArrivalDateEnd}
                    onChange={(newValue) => {
                      setFilterArrivalDateEnd(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ mt: 2, width: "100%" }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid
                  item
                  md={12}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    type="button"
                    variant="contained"
                    sx={{ mt: 1, mb: 1, mr: 1 }}
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 1, mb: 1 }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>
        </Toolbar>
      </Paper>
    </Box>
  );
};

export default SearchFlightForm;
