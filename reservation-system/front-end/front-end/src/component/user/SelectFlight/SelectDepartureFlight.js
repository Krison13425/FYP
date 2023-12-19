import { Box, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import NavBar from "../global/Navbar";
import { SearchContext } from "../global/SearchContext";
import BookingStepper from "../global/Stepper";
import DateTab from "./global/DateTab";
import FlightCard from "./global/FLightCard";
import DepartureFlight from "./global/FlightListPaper";

const SelectDepartureFlight = () => {
  const { originalFlightSearch } = useContext(SearchContext);
  const [selectedSearchFlight, setSelectedSearchFlight] =
    useState(originalFlightSearch);

  const handleDateChange = (date) => {
    setSelectedSearchFlight({
      ...originalFlightSearch,
      flightDepartureDate: date,
    });
  };

  useEffect(() => {
    setSelectedSearchFlight(originalFlightSearch);
  }, [originalFlightSearch]);

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
            activeStep={0}
            tripType={originalFlightSearch?.tripType}
          />
          <DateTab
            departuredate={originalFlightSearch?.flightDepartureDate}
            returndate={originalFlightSearch?.flightReturnDate}
            departureairport={originalFlightSearch?.flightArrivalAirport}
            arrivalairport={originalFlightSearch?.flightDepartureAirport}
            flightclass={originalFlightSearch?.flightClass}
            onDateChange={handleDateChange}
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
        <DepartureFlight searchFlight={selectedSearchFlight} />
      </Box>
    </>
  );
};

export default SelectDepartureFlight;
