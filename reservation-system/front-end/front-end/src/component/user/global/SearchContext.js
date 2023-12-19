import dayjs from "dayjs";
import React, { createContext, useEffect, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const initialFlightState = {
    flightDepartureAirport: null,
    flightArrivalAirport: null,
    flightDepartureDate: null,
    flightReturnDate: null,
    tripType: null,
    flightClass: null,
    passengers: null,
  };

  const [searchFlight, setSearchFlight] = useState(initialFlightState);
  const [originalFlightSearch, setOriginalFlightSearch] =
    useState(initialFlightState);

  const [searchCounter, setSearchCounter] = useState(0);

  useEffect(() => {
    const storedSearchFlight = sessionStorage.getItem("searchFlight");
    if (storedSearchFlight) {
      const parsedStoredSearchFlight = JSON.parse(storedSearchFlight);
      setSearchFlight(parsedStoredSearchFlight);
      setOriginalFlightSearch(parsedStoredSearchFlight);
    } else {
      setSearchFlight(initialFlightState);
      setOriginalFlightSearch(initialFlightState);
    }
  }, [searchCounter]);

  const updateSearchFlight = (flightData) => {
    setSearchFlight(flightData);
    setOriginalFlightSearch(flightData);
    handleMainSearch(flightData);
  };

  const changeSearchFlight = (flightData) => {
    setSearchFlight(flightData);
  };

  const handleMainSearch = async (flightData) => {
    sessionStorage.setItem("searchFlight", JSON.stringify(flightData));
  };

  const handleSearch = async () => {
    let searchFlightCopy = { ...searchFlight };

    if (searchFlightCopy.tripType === "one-way") {
      delete searchFlightCopy.flightReturnDate;
    }

    sessionStorage.setItem("searchFlight", JSON.stringify(searchFlightCopy));
    setSearchCounter((prevCounter) => prevCounter + 1);
  };

  const handleInputChange = (event, value, name) => {
    if (dayjs.isDayjs(value)) {
      changeSearchFlight({
        ...searchFlight,
        [name]: value,
      });
    } else {
      const { name, value } = event.target;
      changeSearchFlight({ ...searchFlight, [name]: value });
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchFlight,
        originalFlightSearch,
        updateSearchFlight,
        handleInputChange,
        handleSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
