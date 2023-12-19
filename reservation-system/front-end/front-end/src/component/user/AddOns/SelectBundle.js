import { Box, Button, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBundleById } from "../../api";
import NavBar from "../global/Navbar";
import { SearchContext } from "../global/SearchContext";
import BookingStepper from "../global/Stepper";
import BundleList from "./Bundle";
import SelectedBundleDetails from "./SelectedBundleDetails";

const SelectBundle = () => {
  const { originalFlightSearch } = useContext(SearchContext);

  const [departureFlight, setDepartureFlight] = useState(null);
  const [selectedDepartureBundleData, setSelectedDepartureBundleData] =
    useState(null);
  const [
    showSelectedDepartureBundleDetails,
    setShowSelectedDepartureBundleDetails,
  ] = useState(false);
  const [showDepartureBundles, setShowDepartureBundles] = useState(true);

  const [showReturnBundles, setShowReturnBundles] = useState(false);
  const [showSelectedReturnBundleDetails, setShowSelectedReturnBundleDetails] =
    useState(false);
  const [selectedReturnBundleData, setSelectedReturnBundleData] =
    useState(null);
  const [returnFlight, setReturnFlight] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const departureFlightData = sessionStorage.getItem("departureFlight");
    const returnFlightData = sessionStorage.getItem("returnFlight");

    if (departureFlightData) {
      const parsedData = JSON.parse(departureFlightData);
      setDepartureFlight(parsedData);
    }

    if (returnFlightData) {
      const parsedData = JSON.parse(returnFlightData);
      setReturnFlight(parsedData);
    }
  }, []);

  useEffect(() => {
    if (originalFlightSearch && originalFlightSearch.passengers) {
      const { adults, children, babies } = originalFlightSearch.passengers;

      for (let i = 0; i < adults; i++) {
        sessionStorage.removeItem(`Adult${i + 1}`);
      }

      for (let i = 0; i < children; i++) {
        sessionStorage.removeItem(`Child${i + 1}`);
      }
    }
  }, [originalFlightSearch]);

  useEffect(() => {
    if (departureFlight?.bundleId && returnFlight?.bundleId) {
      setShowDepartureBundles(true);
      setShowReturnBundles(false);
      setShowSelectedDepartureBundleDetails(false);
      setShowSelectedReturnBundleDetails(false);
      setSelectedDepartureBundleData(null);
      setSelectedReturnBundleData(null);
    } else {
      if (departureFlight?.bundleId) {
        fetchSelectedBundleData(departureFlight.bundleId).then((bundleData) => {
          setSelectedDepartureBundleData(bundleData);
        });

        setShowDepartureBundles(false);
        setShowSelectedDepartureBundleDetails(true);
      } else {
        setShowDepartureBundles(true);
        setShowSelectedDepartureBundleDetails(false);
      }

      if (returnFlight?.bundleId) {
        fetchSelectedBundleData(departureFlight.bundleId).then((bundleData) => {
          setSelectedReturnBundleData(bundleData);
        });
        setShowReturnBundles(false);
        setShowSelectedReturnBundleDetails(true);
      } else {
        setShowReturnBundles(true);
        setShowSelectedReturnBundleDetails(false);
      }
    }
  }, [departureFlight, returnFlight]);

  const [bundleSelected, setBundleSelected] = useState(false);

  const fetchSelectedBundleData = async (id) => {
    const bundleData = await getBundleById(id);
    return bundleData;
  };

  const handleBundleSelected = (isSelected) => {
    setBundleSelected(isSelected);
  };

  const handleShowDepartureBundles = () => {
    setShowDepartureBundles(true);
    setShowSelectedDepartureBundleDetails(false);
  };

  const handleShowReturnBundles = () => {
    setShowReturnBundles(true);
    setShowSelectedReturnBundleDetails(false);
  };

  const handleDepartureBundleConfirm = () => {
    const bundleId = sessionStorage.getItem("BundleId");
    if (bundleId) {
      let departureFlightData = sessionStorage.getItem("departureFlight");
      if (departureFlightData) {
        departureFlightData = JSON.parse(departureFlightData);
        departureFlightData.bundleId = bundleId;
        sessionStorage.setItem(
          "departureFlight",
          JSON.stringify(departureFlightData)
        );

        fetchSelectedBundleData(bundleId).then((bundleData) => {
          setSelectedDepartureBundleData(bundleData);
        });
      }
    }

    setShowDepartureBundles(false);
    setShowSelectedDepartureBundleDetails(true);
    setShowReturnBundles(true);
    setBundleSelected(false);
  };

  const handleReturnBundleConfirm = () => {
    const bundleId = sessionStorage.getItem("BundleId");
    if (bundleId) {
      let returnFlightData = sessionStorage.getItem("returnFlight");

      if (returnFlightData) {
        returnFlightData = JSON.parse(returnFlightData);
        returnFlightData.bundleId = bundleId;
        sessionStorage.setItem(
          "returnFlight",
          JSON.stringify(returnFlightData)
        );

        fetchSelectedBundleData(bundleId).then((bundleData) => {
          setSelectedReturnBundleData(bundleData);
        });
      }
    }

    setShowReturnBundles(false);
    setShowSelectedReturnBundleDetails(true);
    setBundleSelected(false);
  };

  const handleBundleConfirm = () => {
    sessionStorage.removeItem("BundleId");
    setShowDepartureBundles(true);
    setShowReturnBundles(false);
    setShowSelectedDepartureBundleDetails(false);
    setShowSelectedReturnBundleDetails(false);
    setSelectedDepartureBundleData(null);
    setSelectedReturnBundleData(null);
    setDepartureFlight(null);
    setReturnFlight(null);
    setBundleSelected(false);
    navigate("/AddOns");
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
          activeStep={2}
          tripType={originalFlightSearch?.tripType}
        />
      </Box>

      {originalFlightSearch?.tripType === "roundtrip" ? (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 3,
            }}
          >
            {showDepartureBundles && departureFlight ? (
              <Stack>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",

                    mb: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h2">Select Departure Bundle</Typography>
                </Box>
                <BundleList
                  flight={departureFlight}
                  handleBundleSelected={handleBundleSelected}
                />
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                  }}
                >
                  <Button
                    disabled={!bundleSelected}
                    onClick={handleDepartureBundleConfirm}
                    variant="contained"
                    sx={{
                      borderRadius: "20px",
                      width: "200px",
                      height: "40px",
                      fontSize: "1rem",
                    }}
                  >
                    Confirm Selection
                  </Button>
                </Box>
              </Stack>
            ) : null}

            {showSelectedDepartureBundleDetails &&
            selectedDepartureBundleData ? (
              <SelectedBundleDetails
                selectedBundle={selectedDepartureBundleData}
                originalFlightSearch={originalFlightSearch}
                handleShowBundles={handleShowDepartureBundles}
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
              mt: 3,
            }}
          >
            {showSelectedDepartureBundleDetails &&
            !showSelectedReturnBundleDetails &&
            showReturnBundles &&
            returnFlight ? (
              <Stack>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",

                    mb: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h2">Select Return Bundle</Typography>
                </Box>
                <BundleList
                  flight={returnFlight}
                  handleBundleSelected={handleBundleSelected}
                />
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                  }}
                >
                  <Button
                    disabled={!bundleSelected}
                    onClick={handleReturnBundleConfirm}
                    variant="contained"
                    sx={{
                      borderRadius: "20px",
                      width: "200px",
                      height: "40px",
                      fontSize: "1rem",
                    }}
                  >
                    Confirm Selection
                  </Button>
                </Box>
              </Stack>
            ) : null}

            {showSelectedReturnBundleDetails && selectedReturnBundleData ? (
              <SelectedBundleDetails
                selectedBundle={selectedReturnBundleData}
                originalFlightSearch={originalFlightSearch}
                handleShowBundles={handleShowReturnBundles}
                flight={departureFlight}
                flightType={"return"}
              />
            ) : null}
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <Button
              disabled={showDepartureBundles || showReturnBundles}
              onClick={handleBundleConfirm}
              variant="contained"
              sx={{
                borderRadius: "20px",
                width: "150px",
                height: "40px",
                fontSize: "1rem",
              }}
            >
              Confirm
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 3,
            }}
          >
            {showDepartureBundles && departureFlight ? (
              <Stack>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",

                    mb: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h2">Select Departure Bundle</Typography>
                </Box>
                <BundleList
                  flight={departureFlight}
                  handleBundleSelected={handleBundleSelected}
                />
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                  }}
                >
                  <Button
                    disabled={!bundleSelected}
                    onClick={handleDepartureBundleConfirm}
                    variant="contained"
                    sx={{
                      borderRadius: "20px",
                      width: "200px",
                      height: "40px",
                      fontSize: "1rem",
                    }}
                  >
                    Confirm Selection
                  </Button>
                </Box>
              </Stack>
            ) : null}

            {showSelectedDepartureBundleDetails &&
            selectedDepartureBundleData ? (
              <SelectedBundleDetails
                selectedBundle={selectedDepartureBundleData}
                originalFlightSearch={originalFlightSearch}
                handleShowBundles={handleShowDepartureBundles}
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
              mt: 3,
            }}
          >
            <Button
              disabled={showDepartureBundles}
              onClick={handleBundleConfirm}
              variant="contained"
              sx={{
                borderRadius: "20px",
                width: "150px",
                height: "40px",
                fontSize: "1rem",
              }}
            >
              Confirm
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default SelectBundle;
