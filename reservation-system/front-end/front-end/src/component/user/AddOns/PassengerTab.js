import { useTheme } from "@emotion/react";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { Tab, Tabs } from "@mui/material";

const PassengerTab = ({ tabValue, handleTabChange, originalFlightSearch }) => {
  const theme = useTheme();

  const renderTabs = () => {
    const tabs = [];
    if (originalFlightSearch && originalFlightSearch.passengers) {
      for (let i = 0; i < originalFlightSearch.passengers.adults; i++) {
        const adultData = JSON.parse(sessionStorage.getItem(`Adult${i + 1}`));
        let isAdultDataComplete;

        if (originalFlightSearch.tripType === "round-trip") {
          isAdultDataComplete =
            adultData?.departureBaggageId &&
            adultData?.returnBaggageId &&
            adultData?.departureMealId &&
            adultData?.returnMealId &&
            adultData?.departureSeat &&
            adultData?.returnSeat;
        } else {
          isAdultDataComplete =
            adultData?.departureBaggageId &&
            adultData?.departureMealId &&
            adultData?.departureSeat;
        }

        tabs.push(
          <Tab
            key={`adult${i}`}
            label={`Adult ${i + 1}`}
            selected={tabValue === i}
            onClick={() => handleTabChange(null, i)}
            sx={{
              fontSize: "1.2em",
              minWidth: 100,
              minHeight: 50,
              borderStartStartRadius: "15px",
              borderStartEndRadius: "15px",
              backgroundColor:
                tabValue === i
                  ? `${theme.palette.primary.main}33`
                  : "transparent",
              borderColor:
                tabValue === i
                  ? `${theme.palette.primary.main}`
                  : "transparent",
            }}
            icon={
              isAdultDataComplete ? (
                <CheckCircleOutlineOutlinedIcon style={{ color: "green" }} />
              ) : null
            }
          />
        );
      }
      for (let i = 0; i < originalFlightSearch.passengers.children; i++) {
        const childData = JSON.parse(sessionStorage.getItem(`Child${i + 1}`));
        let isChildDataComplete;

        if (originalFlightSearch.tripType === "round-trip") {
          isChildDataComplete =
            childData?.departureBaggageId &&
            childData?.returnBaggageId &&
            childData?.departureMealId &&
            childData?.returnMealId &&
            childData?.departureSeat &&
            childData?.returnSeat;
        } else {
          isChildDataComplete =
            childData?.departureBaggageId &&
            childData?.departureMealId &&
            childData?.departureSeat;
        }
        tabs.push(
          <Tab
            key={`child${i}`}
            label={`Child ${i + 1}`}
            selected={tabValue === originalFlightSearch.passengers.adults + i}
            onClick={() =>
              handleTabChange(null, originalFlightSearch.passengers.adults + i)
            }
            sx={{
              fontSize: "1.2em",
              minWidth: 100,
              minHeight: 50,
              borderStartStartRadius: "15px",
              borderStartEndRadius: "15px",
              backgroundColor:
                tabValue === originalFlightSearch.passengers.adults + i
                  ? `${theme.palette.primary.main}33`
                  : "transparent",
            }}
            icon={
              isChildDataComplete ? (
                <CheckCircleOutlineOutlinedIcon style={{ color: "green" }} />
              ) : null
            }
          />
        );
      }
    }
    return tabs;
  };

  return (
    <Tabs
      value={tabValue}
      onChange={handleTabChange}
      aria-label="passenger tabs"
    >
      {renderTabs()}
    </Tabs>
  );
};

export default PassengerTab;
