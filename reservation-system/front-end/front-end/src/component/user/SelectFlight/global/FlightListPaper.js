import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUserFilteredFlights } from "../../../api";
import FlightList from "./FlightList";

const DepartureFlight = ({
  searchFlight,
  isSelectReturnFlightPage,
  selectedDepartureFlight,
}) => {
  const [flightData, setFlightData] = useState([]);

  const location = useLocation();

  const fetchFilterFlightData = async () => {
    if (searchFlight.flightDepartureDate) {
      let departureAirport = searchFlight.flightDepartureAirport;
      let arrivalAirport = searchFlight.flightArrivalAirport;
      let departureDate = searchFlight.flightDepartureDate;

      if (isSelectReturnFlightPage) {
        departureAirport = searchFlight.flightArrivalAirport;
        arrivalAirport = searchFlight.flightDepartureAirport;
        departureDate = searchFlight.flightReturnDate;
      }

      try {
        const flightData = await getUserFilteredFlights(
          departureAirport,
          arrivalAirport,
          dayjs(departureDate),
          0,
          searchFlight.flightClass
        );
        console.log(flightData);
        setFlightData(flightData);
      } catch (error) {
        console.error("Error fetching flight data", error);
      }
    }
  };

  useEffect(() => {
    fetchFilterFlightData();
  }, [searchFlight, isSelectReturnFlightPage, location]);

  return (
    <>
      <FlightList flightData={flightData} searchFlight={searchFlight} />
    </>
  );
};

export default DepartureFlight;
