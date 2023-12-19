import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  calculateExtraPrice,
  calculateExtraPriceChange,
  calculatePrice,
  getBaggageById,
  getFlightById,
  getMealById,
} from "../../api";
import NavBar from "../global/Navbar";
import { SearchContext } from "../global/SearchContext";
import BookingStepper from "../global/Stepper";
import BaggageList from "./Baggage";
import FlightFees from "./FlightFees";
import MealList from "./Meal";
import PassengerTab from "./PassengerTab";
import SeatMapDrawer from "./SeatMapDrawer";
import SelectedBaggageDetails from "./SelectedBaggageDetails";
import SelectedMealDetails from "./SelectedMealDetails";
import SelectedSeatDetails from "./SelectedSeatDetails";
import checkSessionAndRedirect from "../SessionCheck";

const AddOns = () => {
  const navigate = useNavigate();
  const { originalFlightSearch } = useContext(SearchContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [colorChange, setColorChange] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const [departureFlight, setDepartureFlight] = useState(null);
  const [depFlight, setDepFlight] = useState(null);
  const [showDepartureBaggages, setShowDepartureBaggages] = useState(true);
  const [showDepartureMeals, setShowDepartureMeals] = useState(false);
  const [showDepartureSeats, setShowDepartureSeats] = useState(false);
  useState(false);
  const [
    showSelectedDepartureBaggageDetails,
    setShowSelectedDepartureBaggageDetails,
  ] = useState(false);
  const [
    showSelectedDepartureMealDetails,
    setShowSelectedDepartureMealDetails,
  ] = useState(false);
  const [
    showSelectedDepartureSeatDetails,
    setShowSelectedDepartureSeatDetails,
  ] = useState(false);
  const [selectedDepartureBaggageData, setSelectedDepartureBaggageData] =
    useState(null);
  const [selectedDepartureMealData, setSelectedDepartureMealData] =
    useState(null);
  const [selectedDepartureSeatData, setSelectedDepartureSeatData] =
    useState(null);

  const [returnFlight, setReturnFlight] = useState(null);
  const [retFlight, setRetFlight] = useState(null);
  const [showReturnBaggages, setShowReturnBaggages] = useState(false);
  const [showReturnMeals, setShowReturnMeals] = useState(false);
  const [showReturnSeats, setShowReturnSeats] = useState(false);
  useState(false);
  const [
    showSelectedReturnBaggageDetails,
    setShowSelectedReturnBaggageDetails,
  ] = useState(false);
  const [showSelectedReturnMealDetails, setShowSelectedReturnMealDetails] =
    useState(false);
  const [showSelectedReturnSeatDetails, setShowSelectedReturnSeatDetails] =
    useState(false);
  const [selectedReturnBaggageData, setSelectedReturnBaggageData] =
    useState(null);
  const [selectedReturnMealData, setSelectedReturnMealData] = useState(null);
  const [selectedReturnSeatData, setSelectedReturnSeatData] = useState(null);

  const [tabValue, setTabValue] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [totalPrice, setTotalPrice] = useState(null);

  useEffect(() => {
    if (originalFlightSearch && originalFlightSearch.passengers) {
      initializePassengerDataToSessionStorage(originalFlightSearch);
    }

    sessionStorage.removeItem("passenger");
  }, []);

  useEffect(() => {
    if (originalFlightSearch?.tripType === "one-way") {
      console.log("one");
      checkSessionAndRedirect(navigate, "departureFlight", "/");
    }

    if (originalFlightSearch?.tripType !== "one-way") {
      console.log("route");
      checkSessionAndRedirect(navigate, "departureFlight", "/");
      checkSessionAndRedirect(navigate, "returnFlight", "/");
    }
  }, []);

  const initializePassengerDataToSessionStorage = (originalFlightSearch) => {
    if (originalFlightSearch && originalFlightSearch.passengers) {
      const { adults, children, babies } = originalFlightSearch.passengers;

      for (let i = 0; i < adults; i++) {
        sessionStorage.setItem(`Adult${i + 1}`, JSON.stringify({}));
      }

      for (let i = 0; i < children; i++) {
        sessionStorage.setItem(`Child${i + 1}`, JSON.stringify({}));
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const departureFlight = JSON.parse(
        sessionStorage.getItem("departureFlight")
      );
      setDepFlight(departureFlight);
      const returnFlight = JSON.parse(sessionStorage.getItem("returnFlight"));
      setRetFlight(returnFlight);

      if (departureFlight) {
        try {
          const depFlightData = await fetchFlightData(departureFlight.id);
          setDepartureFlight(depFlightData);
        } catch (error) {
          console.error("Failed to fetch departure flight data:", error);
        }
      }

      if (returnFlight) {
        try {
          const retFlightData = await fetchFlightData(returnFlight.id);
          setReturnFlight(retFlightData);
        } catch (error) {
          console.error("Failed to fetch return flight data:", error);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const passenger = JSON.parse(
      sessionStorage.getItem(getPassengerTypeLabel(tabValue))
    );
    if (passenger && Object.keys(passenger).length === 0) {
      setShowDepartureBaggages(true);
      setShowReturnBaggages(false);
      setShowDepartureMeals(false);
      setShowReturnMeals(false);
      setShowDepartureSeats(false);
      setShowReturnSeats(false);
      setShowSelectedDepartureBaggageDetails(false);
      setShowSelectedDepartureMealDetails(false);
      setShowSelectedReturnBaggageDetails(false);
      setShowSelectedReturnMealDetails(false);
      setShowSelectedDepartureSeatDetails(false);
      setShowSelectedReturnSeatDetails(false);
      setSelectedDepartureBaggageData(null);
      setSelectedReturnBaggageData(null);
      setSelectedDepartureMealData(null);
      setSelectedReturnMealData(null);
      setSelectedDepartureSeatData(null);
      setSelectedReturnSeatData(null);
    } else {
      if (passenger?.departureBaggageId) {
        fetchSelectedBaggageData(passenger.departureBaggageId).then(
          (baggageData) => {
            setSelectedDepartureBaggageData(baggageData);
          }
        );

        setShowDepartureBaggages(false);
        setShowSelectedDepartureBaggageDetails(true);
      } else {
        setShowDepartureBaggages(true);
        setShowSelectedDepartureBaggageDetails(false);
      }

      if (passenger?.returnBaggageId) {
        fetchSelectedBaggageData(passenger.returnBaggageId).then(
          (baggageData) => {
            setSelectedReturnBaggageData(baggageData);
          }
        );
        setShowReturnBaggages(false);
        setShowSelectedReturnBaggageDetails(true);
      } else {
        setShowReturnBaggages(true);
        setShowSelectedReturnBaggageDetails(false);
      }

      if (passenger?.departureMealId) {
        fetchSelectedMealData(passenger.departureMealId).then((mealData) => {
          setSelectedDepartureMealData(mealData);
        });
        setShowDepartureMeals(false);
        setShowSelectedDepartureMealDetails(true);
      } else {
        setShowDepartureMeals(true);
        setShowSelectedDepartureMealDetails(false);
      }
      if (passenger?.returnMealId) {
        fetchSelectedMealData(passenger.returnMealId).then((mealData) => {
          setSelectedReturnMealData(mealData);
        });
        setShowReturnMeals(false);
        setShowSelectedReturnMealDetails(true);
      } else {
        setShowReturnMeals(true);
        setShowSelectedReturnMealDetails(false);
      }

      if (passenger?.departureSeat) {
        setSelectedDepartureSeatData(
          `${passenger.departureSeat.modifiedRowIndex}${passenger.departureSeat.seatAlphabet}`
        );
        setShowDepartureSeats(false);
        setShowSelectedDepartureSeatDetails(true);
      } else {
        setShowDepartureSeats(true);
        setShowSelectedDepartureSeatDetails(false);
      }

      if (passenger?.returnSeat) {
        setSelectedReturnSeatData(
          `${passenger.returnSeat.modifiedRowIndex}${passenger.returnSeat.seatAlphabet}`
        );
        setShowReturnSeats(false);
        setShowSelectedReturnSeatDetails(true);
      } else {
        setShowReturnSeats(true);
        setShowSelectedReturnSeatDetails(false);
      }
    }
  }, [tabValue, originalFlightSearch]);

  useEffect(() => {
    if (originalFlightSearch && originalFlightSearch.passengers) {
      const { adults, children, babies } = originalFlightSearch.passengers;
      let buttonShouldBeDisabled = false;

      const validatePassengerData = (passengerType, passengerCount) => {
        for (let i = 0; i < passengerCount; i++) {
          const passengerData = JSON.parse(
            sessionStorage.getItem(`${passengerType}${i + 1}`)
          );

          if (originalFlightSearch.tripType === "roundtrip") {
            if (
              !passengerData ||
              !passengerData.departureBaggageId ||
              !passengerData.returnBaggageId ||
              !passengerData.departureMealId ||
              !passengerData.returnMealId ||
              !passengerData.departureSeat ||
              !passengerData.returnSeat
            ) {
              return false;
            }
          } else {
            if (
              !passengerData ||
              !passengerData.departureBaggageId ||
              !passengerData.departureMealId ||
              !passengerData.departureSeat
            ) {
              return false;
            }
          }
        }
        return true;
      };

      buttonShouldBeDisabled =
        !validatePassengerData("Adult", adults) ||
        !validatePassengerData("Child", children);

      setIsButtonDisabled(buttonShouldBeDisabled);
    }
  }, [
    selectedDepartureBaggageData,
    selectedDepartureMealData,
    selectedReturnBaggageData,
    selectedReturnMealData,
    selectedDepartureSeatData,
    selectedReturnSeatData,
  ]);

  const calculateAndLogPrice = async () => {
    const departureFlight = JSON.parse(
      sessionStorage.getItem("departureFlight")
    );
    const returnFlight = JSON.parse(sessionStorage.getItem("returnFlight"));

    const passengers = [
      {
        passengerType: "Adult",
        passengerCount: originalFlightSearch?.passengers?.adults,
      },
      {
        passengerType: "Child",
        passengerCount: originalFlightSearch?.passengers?.children,
      },
      {
        passengerType: "Baby",
        passengerCount: originalFlightSearch?.passengers?.babies,
      },
    ];

    let flightDetails = [];
    if (returnFlight != null) {
      flightDetails = [departureFlight, returnFlight];
    } else {
      flightDetails = [departureFlight];
    }
    const passengerDetails = passengers;

    let price = await fetchTotalPrice(flightDetails, passengerDetails);

    for (let passenger of passengerDetails) {
      for (let i = 0; i < passenger.passengerCount; i++) {
        const passengerData = JSON.parse(
          sessionStorage.getItem(`${passenger.passengerType}${i + 1}`)
        );

        if (passengerData && passengerData.departureBaggageId) {
          const deapartureBaggageData = await fetchSelectedBaggageData(
            passengerData.departureBaggageId
          );
          const departflightData = await fetchFlightData(departureFlight.id);
          if (deapartureBaggageData && departflightData?.flight_type === 0) {
            price += deapartureBaggageData?.domesticPrice;
          } else {
            price += deapartureBaggageData?.internationalPrice;
          }
        }

        if (returnFlight && passengerData && passengerData.returnBaggageId) {
          const returnBundleData = await fetchSelectedBaggageData(
            passengerData.returnBaggageId
          );
          const returnflightData = await fetchFlightData(returnFlight.id);
          if (returnBundleData && returnflightData?.flight_type === 0) {
            price += returnBundleData?.domesticPrice;
          } else {
            price += returnBundleData?.internationalPrice;
          }
        }
      }
    }

    setTotalPrice(price);
  };

  useEffect(() => {
    calculateAndLogPrice();
  }, [originalFlightSearch]);

  const fetchTotalPrice = async (flightDetails, passengerDetails) => {
    const totalPrice = await calculatePrice(flightDetails, passengerDetails);
    return totalPrice;
  };

  const fetchExtraPriceChange = async (totalprice, baggageId, flightId) => {
    const totalPrice = await calculateExtraPriceChange(
      totalprice,
      baggageId,
      flightId
    );
    return totalPrice;
  };

  const fetchExtraPrice = async (totalprice, baggageId, flightId) => {
    const totalPrice = await calculateExtraPrice(
      totalprice,
      baggageId,
      flightId
    );
    return totalPrice;
  };

  const fetchFlightData = async (id) => {
    const flightData = await getFlightById(id);
    return flightData;
  };

  const fetchSelectedBaggageData = async (id) => {
    const baggageData = await getBaggageById(id);
    return baggageData;
  };

  const fetchSelectedMealData = async (id) => {
    const mealData = await getMealById(id);
    return mealData;
  };

  const handleShowReturnBaggage = () => {
    if ((totalPrice && selectedReturnBaggageData, returnFlight)) {
      fetchExtraPriceChange(
        totalPrice,
        selectedReturnBaggageData.id,
        returnFlight.id
      ).then((price) => {
        const priceChange = price - totalPrice;
        setTotalPrice(price);

        setColorChange(
          priceChange > 0 ? "green" : priceChange < 0 ? "red" : ""
        );

        setTimeout(() => {
          setColorChange("");
        }, 1000);
      });
    }
    const passenger = getPassengerTypeLabel(tabValue);
    if (passenger) {
      let passengerData = sessionStorage.getItem(passenger);
      if (passengerData) {
        passengerData = JSON.parse(passengerData);
        delete passengerData.returnBaggageId;
        sessionStorage.setItem(passenger, JSON.stringify(passengerData));
      }
    }
    setShowReturnBaggages(true);
    setShowSelectedReturnBaggageDetails(false);
    setIsButtonDisabled(true);
  };

  const handleShowDepartureBaggage = () => {
    if ((totalPrice && selectedDepartureBaggageData, departureFlight)) {
      fetchExtraPriceChange(
        totalPrice,
        selectedDepartureBaggageData.id,
        departureFlight.id
      ).then((price) => {
        const priceChange = price - totalPrice;
        setTotalPrice(price);

        setColorChange(
          priceChange > 0 ? "green" : priceChange < 0 ? "red" : ""
        );

        setTimeout(() => {
          setColorChange("");
        }, 1000);
      });
    }
    const passenger = getPassengerTypeLabel(tabValue);

    if (passenger) {
      let passengerData = sessionStorage.getItem(passenger);
      console.log(passengerData);
      if (passengerData) {
        passengerData = JSON.parse(passengerData);
        delete passengerData.departureBaggageId;
        sessionStorage.setItem(passenger, JSON.stringify(passengerData));
      }
    }
    setShowDepartureBaggages(true);
    setShowSelectedDepartureBaggageDetails(false);
    setIsButtonDisabled(true);
  };

  const handleShowReturnMeal = () => {
    setShowReturnMeals(true);
    setShowSelectedReturnMealDetails(false);
    setIsButtonDisabled(true);
  };

  const handleShowDepartureMeal = () => {
    setShowDepartureMeals(true);
    setShowSelectedDepartureMealDetails(false);
    setIsButtonDisabled(true);
  };

  const handleShowReturnSeat = () => {
    setShowReturnSeats(true);
    setShowSelectedReturnSeatDetails(false);
    setIsButtonDisabled(true);
  };

  const handleShowDepartureSeat = () => {
    setShowDepartureSeats(true);
    setShowSelectedDepartureSeatDetails(false);
    setIsButtonDisabled(true);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleDeparutreBaggageConfirm = () => {
    const baggageId = sessionStorage.getItem("BaggageId");
    const passenger = getPassengerTypeLabel(tabValue);

    if (baggageId && passenger) {
      let passengerData = sessionStorage.getItem(passenger);
      if (passengerData) {
        passengerData = JSON.parse(passengerData);
        passengerData.departureBaggageId = baggageId;
        sessionStorage.setItem(passenger, JSON.stringify(passengerData));

        fetchSelectedBaggageData(baggageId).then((baggageData) => {
          setSelectedDepartureBaggageData(baggageData);
        });
      }

      if (totalPrice && departureFlight) {
        fetchExtraPrice(totalPrice, baggageId, departureFlight.id).then(
          (price) => {
            const priceChange = price - totalPrice;
            setTotalPrice(price);

            setColorChange(
              priceChange > 0 ? "green" : priceChange < 0 ? "red" : ""
            );

            setTimeout(() => {
              setColorChange("");
            }, 1000);
          }
        );
      }
    }

    if (originalFlightSearch?.tripType === "roundtrip") {
      setShowDepartureBaggages(false);
      setShowSelectedDepartureBaggageDetails(true);

      if (!selectedReturnBaggageData) {
        setShowReturnBaggages(true);
      }
    } else {
      setShowDepartureBaggages(false);
      setShowSelectedDepartureBaggageDetails(true);
      if (!selectedDepartureMealData) {
        setShowDepartureMeals(true);
      }
    }
  };

  const handleReturnBaggageConfirm = () => {
    const baggageId = sessionStorage.getItem("BaggageId");
    const passenger = getPassengerTypeLabel(tabValue);

    if (baggageId && passenger) {
      let passengerData = sessionStorage.getItem(passenger);
      if (passengerData) {
        passengerData = JSON.parse(passengerData);
        passengerData.returnBaggageId = baggageId;
        sessionStorage.setItem(passenger, JSON.stringify(passengerData));

        fetchSelectedBaggageData(baggageId).then((baggageData) => {
          setSelectedReturnBaggageData(baggageData);
        });

        if (totalPrice && returnFlight) {
          fetchExtraPrice(totalPrice, baggageId, returnFlight.id).then(
            (price) => {
              const priceChange = price - totalPrice;
              setTotalPrice(price);

              setColorChange(
                priceChange > 0 ? "green" : priceChange < 0 ? "red" : ""
              );

              setTimeout(() => {
                setColorChange("");
              }, 1000);
            }
          );
        }
      }
    }

    setShowReturnBaggages(false);
    setShowSelectedReturnBaggageDetails(true);
    if (!selectedDepartureMealData) {
      setShowDepartureMeals(true);
    }
  };

  const handleDepartureMealConfirm = () => {
    const mealId = sessionStorage.getItem("MealId");
    const passenger = getPassengerTypeLabel(tabValue);
    if (mealId && passenger) {
      let passengerData = sessionStorage.getItem(passenger);
      if (passengerData) {
        passengerData = JSON.parse(passengerData);
        passengerData.departureMealId = mealId;
        sessionStorage.setItem(passenger, JSON.stringify(passengerData));

        fetchSelectedMealData(mealId).then((mealData) => {
          setSelectedDepartureMealData(mealData);
        });
      }
    }

    if (originalFlightSearch?.tripType === "roundtrip") {
      setShowDepartureMeals(false);
      setShowSelectedDepartureMealDetails(true);
      if (!selectedReturnMealData) {
        setShowReturnMeals(true);
      }
    } else {
      setShowDepartureMeals(false);
      setShowSelectedDepartureBaggageDetails(true);
      if (!selectedDepartureSeatData) {
        setShowDepartureSeats(true);
      }
    }
  };

  const handleReturnMealConfirm = () => {
    const mealId = sessionStorage.getItem("MealId");
    const passenger = getPassengerTypeLabel(tabValue);
    if (mealId && passenger) {
      let passengerData = sessionStorage.getItem(passenger);
      if (passengerData) {
        passengerData = JSON.parse(passengerData);
        passengerData.returnMealId = mealId;
        sessionStorage.setItem(passenger, JSON.stringify(passengerData));

        fetchSelectedMealData(mealId).then((mealData) => {
          setSelectedReturnMealData(mealData);
        });
      }
    }

    setShowReturnMeals(false);
    setShowSelectedReturnMealDetails(true);
    if (!selectedDepartureSeatData) {
      setShowDepartureSeats(true);
    }
  };

  const handleDepartureSeatConfirm = () => {
    setDrawerOpen(false);
    const seat = JSON.parse(sessionStorage.getItem("selectedSeat"));
    console.log(seat);
    const passenger = getPassengerTypeLabel(tabValue);

    if (seat && passenger) {
      let passengerData = sessionStorage.getItem(passenger);
      if (passengerData) {
        passengerData = JSON.parse(passengerData);
        passengerData.departureSeat = seat;
        sessionStorage.setItem(passenger, JSON.stringify(passengerData));
        setSelectedDepartureSeatData(
          `${seat.modifiedRowIndex}${seat.seatAlphabet}`
        );
      }
      sessionStorage.removeItem("selectedSeat");
    }

    if (originalFlightSearch?.tripType === "roundtrip") {
      setShowDepartureSeats(false);
      setShowSelectedDepartureSeatDetails(true);
      if (!selectedReturnSeatData) {
        setShowReturnSeats(true);
      }
    } else {
      setShowDepartureSeats(false);
      setShowSelectedDepartureSeatDetails(true);
    }
  };

  const handleReturnSeatConfirm = () => {
    setDrawerOpen(false);
    const seat = JSON.parse(sessionStorage.getItem("selectedSeat"));
    const passenger = getPassengerTypeLabel(tabValue);

    if (seat && passenger) {
      let passengerData = sessionStorage.getItem(passenger);
      if (passengerData) {
        passengerData = JSON.parse(passengerData);
        passengerData.returnSeat = seat;
        sessionStorage.setItem(passenger, JSON.stringify(passengerData));
        setSelectedReturnSeatData(
          `${seat.modifiedRowIndex}${seat.seatAlphabet}`
        );
      }
    }

    setShowReturnSeats(false);
    setShowSelectedReturnSeatDetails(true);
  };

  const getPassengerTypeLabel = (tabValue) => {
    if (originalFlightSearch && originalFlightSearch.passengers) {
      const { adults, children } = originalFlightSearch.passengers;
      if (tabValue < adults) {
        return `Adult${tabValue + 1}`;
      } else if (tabValue < adults + children) {
        return `Child${tabValue - adults + 1}`;
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddonConfirm = () => {
    sessionStorage.removeItem("MealId");
    sessionStorage.removeItem("BaggageId");

    navigate("/InsertPassengerInfomation");
  };

  const handleOpenDialog = () => {
    setShowDialog(true);
  };
  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  return (
    <>
      <NavBar />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          ".MuiStepLabel-label": { fontSize: "1rem" },
        }}
      >
        <BookingStepper
          activeStep={3}
          tripType={originalFlightSearch?.tripType}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mt: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h2">Select AddOns</Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mt: 2,
        }}
      >
        <PassengerTab
          tabValue={tabValue}
          handleTabChange={handleTabChange}
          originalFlightSearch={originalFlightSearch}
        />
      </Box>
      {originalFlightSearch?.tripType === "roundtrip" ? (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 2,
              textAlign: "center",
            }}
          >
            {showDepartureBaggages && departureFlight ? (
              <BaggageList
                flight={departureFlight}
                flightType={"departure"}
                handleBaggageConfirm={handleDeparutreBaggageConfirm}
              />
            ) : null}

            {!showDepartureBaggages && selectedDepartureBaggageData ? (
              <SelectedBaggageDetails
                selectedBaggage={selectedDepartureBaggageData}
                originalFlightSearch={originalFlightSearch}
                handleShowBaggage={handleShowDepartureBaggage}
                flight={departureFlight}
                flightType={"departure"}
              />
            ) : null}
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 2,
              textAlign: "center",
            }}
          >
            {showReturnBaggages && returnFlight ? (
              <BaggageList
                flight={returnFlight}
                flightType={"return"}
                handleBaggageConfirm={handleReturnBaggageConfirm}
              />
            ) : null}

            {!showReturnBaggages && selectedReturnBaggageData ? (
              <SelectedBaggageDetails
                selectedBaggage={selectedReturnBaggageData}
                originalFlightSearch={originalFlightSearch}
                handleShowBaggage={handleShowReturnBaggage}
                flight={returnFlight}
                flightType={"return"}
              />
            ) : null}
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 2,
              textAlign: "center",
            }}
          >
            {showDepartureBaggages && departureFlight ? (
              <BaggageList
                flight={departureFlight}
                flightType={"departure"}
                handleBaggageConfirm={handleDeparutreBaggageConfirm}
              />
            ) : null}

            {!showDepartureBaggages && selectedDepartureBaggageData ? (
              <SelectedBaggageDetails
                selectedBaggage={selectedDepartureBaggageData}
                originalFlightSearch={originalFlightSearch}
                handleShowBaggage={handleShowDepartureBaggage}
                flight={departureFlight}
                flightType={"departure"}
              />
            ) : null}
          </Box>
        </>
      )}

      {originalFlightSearch?.tripType === "roundtrip" ? (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 2,
              textAlign: "center",
            }}
          >
            {showDepartureMeals && departureFlight ? (
              <MealList
                flight={departureFlight}
                flightType={"departure"}
                handleMealConfirm={handleDepartureMealConfirm}
              />
            ) : null}

            {!showDepartureMeals && selectedDepartureMealData ? (
              <SelectedMealDetails
                selectedMeal={selectedDepartureMealData}
                originalFlightSearch={originalFlightSearch}
                handleShowMeal={handleShowDepartureMeal}
                flight={departureFlight}
                flightType={"departure"}
              />
            ) : null}
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 2,
              textAlign: "center",
            }}
          >
            {showReturnMeals && returnFlight ? (
              <MealList
                flight={returnFlight}
                flightType={"return"}
                handleMealConfirm={handleReturnMealConfirm}
              />
            ) : null}

            {!showReturnMeals && selectedReturnMealData ? (
              <SelectedMealDetails
                selectedMeal={selectedReturnMealData}
                originalFlightSearch={originalFlightSearch}
                handleShowMeal={handleShowReturnMeal}
                flight={returnFlight}
                flightType={"return"}
              />
            ) : null}
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 2,
              textAlign: "center",
            }}
          >
            {showDepartureMeals && departureFlight ? (
              <MealList
                flight={departureFlight}
                flightType={"departure"}
                handleMealConfirm={handleDepartureMealConfirm}
              />
            ) : null}

            {!showDepartureMeals && selectedDepartureMealData ? (
              <SelectedMealDetails
                selectedMeal={selectedDepartureMealData}
                originalFlightSearch={originalFlightSearch}
                handleShowMeal={handleShowDepartureMeal}
                flight={departureFlight}
                flightType={"departure"}
              />
            ) : null}
          </Box>
        </>
      )}

      {originalFlightSearch?.tripType === "roundtrip" ? (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 2,
              textAlign: "center",
            }}
          >
            {showDepartureSeats && departureFlight ? (
              <>
                <Paper
                  sx={{ p: 2, mt: 2, width: 1100, borderRadius: "20px" }}
                  elevation={0}
                  variant="outlined"
                  display="flex"
                >
                  <Grid container spacing={1}>
                    <Grid item xs={3} sx={{ textAlign: "center", mt: 1 }}>
                      <Typography variant="h3">
                        Select Departure Seat
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          borderRadius: "20px",
                          height: "40px",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                        size="large"
                        onClick={toggleDrawer(true)}
                      >
                        select
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>

                <SeatMapDrawer
                  flightData={departureFlight}
                  open={drawerOpen}
                  toggleDrawer={toggleDrawer}
                  handleSeatConfirm={handleDepartureSeatConfirm}
                  flight={depFlight}
                />
              </>
            ) : null}

            {!showDepartureSeats && selectedDepartureSeatData ? (
              <SelectedSeatDetails
                selectedSeat={selectedDepartureSeatData}
                originalFlightSearch={originalFlightSearch}
                handleShowSeat={handleShowDepartureSeat}
                flightType={"departure"}
              />
            ) : null}
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 2,
              textAlign: "center",
            }}
          >
            {showReturnSeats && returnFlight ? (
              <>
                <Paper
                  sx={{ p: 2, mt: 2, width: 1100, borderRadius: "20px" }}
                  elevation={0}
                  variant="outlined"
                  display="flex"
                >
                  <Grid container spacing={1}>
                    <Grid item xs={3} sx={{ textAlign: "center", mt: 1 }}>
                      <Typography variant="h3">Select Return Seat</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          borderRadius: "20px",
                          height: "40px",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                        size="large"
                        onClick={toggleDrawer(true)}
                      >
                        select
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>

                <SeatMapDrawer
                  flightData={returnFlight}
                  open={drawerOpen}
                  toggleDrawer={toggleDrawer}
                  handleSeatConfirm={handleReturnSeatConfirm}
                  flight={retFlight}
                />
              </>
            ) : null}

            {!showReturnSeats && selectedReturnSeatData ? (
              <SelectedSeatDetails
                selectedSeat={selectedReturnSeatData}
                originalFlightSearch={originalFlightSearch}
                handleShowSeat={handleShowReturnSeat}
                flightType={"return"}
              />
            ) : null}
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 2,
              textAlign: "center",
            }}
          >
            {showDepartureSeats && departureFlight ? (
              <>
                <Paper
                  sx={{ p: 2, mt: 2, width: 1100, borderRadius: "20px" }}
                  elevation={0}
                  variant="outlined"
                  display="flex"
                >
                  <Grid container spacing={1}>
                    <Grid item xs={3} sx={{ textAlign: "center", mt: 1 }}>
                      <Typography variant="h3">
                        Select Departure Seat
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          borderRadius: "20px",
                          height: "40px",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                        size="large"
                        onClick={toggleDrawer(true)}
                      >
                        select
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>

                <SeatMapDrawer
                  flightData={departureFlight}
                  open={drawerOpen}
                  toggleDrawer={toggleDrawer}
                  handleSeatConfirm={handleDepartureSeatConfirm}
                  flight={depFlight}
                />
              </>
            ) : null}

            {!showDepartureSeats && selectedDepartureSeatData ? (
              <SelectedSeatDetails
                selectedSeat={selectedDepartureSeatData}
                originalFlightSearch={originalFlightSearch}
                handleShowSeat={handleShowDepartureSeat}
                flightType={"departure"}
              />
            ) : null}
          </Box>
        </>
      )}
      <Box sx={{ mt: 10, pb: 15 }}>
        <Paper
          sx={{
            width: "100%",
            alignItems: "center",
            position: "fixed",
            bottom: 0,
            p: 2,
            borderRadius: "20px",
          }}
        >
          <Grid container spacing={1}>
            <Grid
              item
              xs={6}
              sx={{ textAlign: "center", mt: 1 }}
              direction="row"
            >
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="h6" sx={{ mt: 1 }}>
                  MYR
                </Typography>
                <Typography
                  variant="h2"
                  style={{ color: colorChange, marginLeft: "8px" }}
                >
                  {totalPrice}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={2} sx={{ textAlign: "right" }}>
              <Button
                onClick={handleOpenDialog}
                variant="contained"
                sx={{
                  borderRadius: "20px",
                  width: "150px",
                  height: "40px",
                  fontSize: "1rem",
                }}
              >
                View Details
              </Button>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: "left" }}>
              <Button
                disabled={isButtonDisabled}
                onClick={handleAddonConfirm}
                variant="contained"
                sx={{
                  borderRadius: "20px",
                  width: "150px",
                  height: "40px",
                  fontSize: "1rem",
                  mr: 2,
                }}
              >
                Confirm
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <FlightFees
        open={showDialog}
        departflight={depFlight}
        returnflight={retFlight}
        originalFlightSearch={originalFlightSearch}
        onClose={handleCloseDialog}
        departflightData={departureFlight}
        returnflightData={returnFlight}
        totalPrice={totalPrice}
      />
    </>
  );
};

export default AddOns;
