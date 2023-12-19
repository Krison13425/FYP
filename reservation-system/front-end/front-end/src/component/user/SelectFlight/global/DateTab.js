import { useTheme } from "@emotion/react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import dayjs from "dayjs";
import { useContext, useEffect, useRef, useState } from "react";
import { getFlightDatePriceList } from "../../../api";
import { SearchContext } from "../../global/SearchContext";

const DateTab = ({
  departuredate,
  returndate,
  flightdeparturedate,
  departureairport,
  arrivalairport,
  flightclass,
  onDateChange,
  selectedDepartureFligthData,
}) => {
  const { searchFlight } = useContext(SearchContext);
  const [dates, setDates] = useState([]);
  const [value, setValue] = useState(0);
  const tabRefs = useRef([]);
  const theme = useTheme();

  const [datePriceData, setDatePriceData] = useState([]);

  const fetchFlightPriceDateList = async () => {
    if (departuredate || returndate) {
      let departureDate = departuredate;
      let returnDate = returndate;
      let depairport = departureairport;
      let arrairport = arrivalairport;

      if (departuredate === returndate) {
        departureDate = flightdeparturedate;
        returnDate = dayjs(returndate).add(14, "day");
        arrairport = arrairport;
        depairport = depairport;
      } else if (returndate === undefined) {
        returnDate = dayjs(departureDate).add(7, "day");
      }

      const pricedatelist = await getFlightDatePriceList(
        arrairport,
        depairport,
        dayjs(departureDate),
        dayjs(returnDate),
        flightclass
      );
      setDatePriceData(pricedatelist);
    }
  };

  useEffect(() => {
    fetchFlightPriceDateList();
  }, [departuredate, returndate]);

  useEffect(() => {
    const generateDates = () => {
      let baseDate = dayjs(departuredate);
      let endDate = dayjs(returndate);
      let today = dayjs();
      let newDates = [];

      if (departuredate === returndate) {
        endDate = endDate.add(14, "day");
        baseDate = dayjs(flightdeparturedate);
        let totalDays = endDate.diff(baseDate, "day");

        for (let i = 0; i <= totalDays; i++) {
          let newDate = baseDate.add(i, "day");
          newDates.push(newDate.toDate());
        }
      } else if (returndate === undefined) {
        endDate = baseDate.add(7, "day");
        baseDate = dayjs(baseDate);
        let totalDays = endDate.diff(baseDate, "day");

        for (let i = 0; i <= totalDays; i++) {
          let newDate = baseDate.add(i, "day");
          newDates.push(newDate.toDate());
        }
      } else {
        let diffDays = baseDate.diff(today, "day");

        let startDate = diffDays >= 5 ? baseDate.subtract(5, "day") : today;

        let totalDays = endDate.diff(startDate, "day");

        for (let i = 0; i <= totalDays; i++) {
          let newDate = startDate.add(i, "day");
          newDates.push(newDate.toDate());
        }
      }

      setDates(newDates);
    };

    generateDates();
  }, [departuredate, returndate]);

  useEffect(() => {
    const baseDate = dayjs(departuredate).startOf("day");
    const selectedIndex = dates.findIndex((d) =>
      dayjs(d).startOf("day").isSame(baseDate, "day")
    );

    if (selectedIndex !== -1) {
      setValue(selectedIndex);

      if (selectedIndex >= 3) {
        tabRefs.current[selectedIndex].scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    } else {
      setValue(0);
    }
  }, [dates, departuredate]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue >= 3) {
      tabRefs.current[newValue].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }

    if (typeof onDateChange === "function") {
      onDateChange(dates[newValue]);
    }
  };

  return (
    <>
      <Box
        sx={{
          mt: 2,
          width: 800,
          display: "flex",
          justifyContent: dates.length <= 5 ? "center" : "space-between",
          alignItems: "center",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {dates.map((date, index) => {
            const dateStr = dayjs(date).format("YYYY-MM-DD");
            const dateData = datePriceData.find(
              (d) => dayjs(d.date).format("YYYY-MM-DD") === dateStr
            );
            const price = dateData ? dateData.price : undefined;

            return (
              <Tab
                ref={(ref) => (tabRefs.current[index] = ref)}
                key={index}
                label={
                  <>
                    {dayjs(date).format("MMM D, YYYY")} <br />{" "}
                    {price ? `MYR ${price}` : ""}
                  </>
                }
                sx={{
                  fontSize: "1.2em",
                  minWidth: 100,
                  minHeight: 50,
                  borderStartStartRadius: "15px",
                  borderStartEndRadius: "15px",
                  backgroundColor:
                    value === index
                      ? `${theme.palette.primary.main}33`
                      : "transparent",
                }}
              />
            );
          })}
        </Tabs>
      </Box>
    </>
  );
};

export default DateTab;
