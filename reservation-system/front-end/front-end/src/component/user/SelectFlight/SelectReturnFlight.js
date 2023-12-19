import { Box, Button, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFlightById } from "../../api";
import NavBar from "../global/Navbar";
import { SearchContext } from "../global/SearchContext";
import BookingStepper from "../global/Stepper";
import DateTab from "./global/DateTab";
import FlightCard from "./global/FLightCard";
import DepartureFlight from "./global/FlightListPaper";
import DepartureFlightDetails from "./global/SelectedDepartureFLight";

const SelectReturnFlight = () => {
  const { originalFlightSearch } = useContext(SearchContext);
  const [selectedDepartureFlight, setSelectedDepartureFlight] = useState(null);
  const [selectedSearchFlight, setSelectedSearchFlight] =
    useState(originalFlightSearch);

  const fetchSelectedFlightData = async (id) => {
    const flightData = await getFlightById(id);
    setSelectedDepartureFlight(flightData);
  };
  const navigate = useNavigate();

  useEffect(() => {
    const departureFlightString = sessionStorage.getItem("departureFlight");
    const departureFlight = JSON.parse(departureFlightString);
    if (departureFlight) {
      fetchSelectedFlightData(departureFlight.id);
    }
  }, []);

  const handleDateChange = (date) => {
    setSelectedSearchFlight({
      ...originalFlightSearch,
      flightReturnDate: date,
    });
  };

  useEffect(() => {
    setSelectedSearchFlight(originalFlightSearch);
  }, [originalFlightSearch]);

  const handleBack = () => {
    sessionStorage.removeItem("departureFlight");
    navigate("/SelectDepartureFlight");
  };
  return (
    <>
      <NavBar />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FlightCard />
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          ".MuiStepLabel-label": { fontSize: "1rem" },
          mt: 2,
        }}
      >
        <Stack>
          <BookingStepper
            activeStep={1}
            tripType={originalFlightSearch?.tripType}
          />
          <DateTab
            departuredate={originalFlightSearch?.flightReturnDate}
            returndate={originalFlightSearch?.flightReturnDate}
            flightdeparturedate={selectedDepartureFlight?.departure_time}
            departureairport={originalFlightSearch?.flightDepartureAirport}
            arrivalairport={originalFlightSearch?.flightArrivalAirport}
            flightclass={originalFlightSearch?.flightClass}
            onDateChange={handleDateChange}
            selectedDepartureFligthData={selectedDepartureFlight}
          />
        </Stack>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <DepartureFlightDetails
          selectedDepartureFlight={selectedDepartureFlight}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <DepartureFlight
          searchFlight={selectedSearchFlight}
          isSelectReturnFlightPage={true}
          selectedDepartureFlight={selectedDepartureFlight}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mt: 3,
          mb: 3,
        }}
      >
        <Button
          onClick={handleBack}
          variant="outlined"
          size="large"
          sx={{
            borderRadius: "20px",
            "&:hover": {
              backgroundColor: "primary.main",
              color: "white",
            },
            fontSize: "1rem",
          }}
        >
          Back
        </Button>
      </Box>
    </>
  );
};

export default SelectReturnFlight;
