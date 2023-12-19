import FlightLandOutlinedIcon from "@mui/icons-material/FlightLandOutlined";
import FlightOutlinedIcon from "@mui/icons-material/FlightOutlined";
import FlightTakeoffOutlinedIcon from "@mui/icons-material/FlightTakeoffOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import { Box, Grid, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import CountedPaper from "./Global/CountedPaper";
import Sidebar, { DrawerHeader, Main } from "./Sidebar";

import { getFlightCountByStatus, getMonthlyFlightCount } from "../api";
import BarChart from "./Global/Chart";

const DashBoard = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  const [todayFlightCount, setTodayFlightCount] = useState(false);
  const [totalFlightCount, setTotalFlightCount] = useState(false);
  const [departuredFlightCount, setDepartedFlightCount] = useState(false);
  const [arrivedFlightCount, setArrivedFlightCount] = useState(false);
  const [totalFlightCountByMonth, setTotalFlightCountByMonth] = useState([]);

  const fecthTodayFlightCount = async () => {
    const todayFlightCount = await getFlightCountByStatus("", 1, 0, 0);
    setTodayFlightCount(todayFlightCount);
  };

  const fecthTotalFlightCount = async () => {
    const totalFlightCount = await getFlightCountByStatus("", 0, 0, 0);
    setTotalFlightCount(totalFlightCount);
  };

  const fecthArrivedFlightCount = async () => {
    const arrivedFlightCount = await getFlightCountByStatus("2", 1, 0, 0);
    setArrivedFlightCount(arrivedFlightCount);
  };

  const fecthDeparturedFlightCount = async () => {
    const departedFlightCount = await getFlightCountByStatus("3", 1, 0, 0);
    setDepartedFlightCount(departedFlightCount);
  };

  const reloadData = async () => {
    await Promise.all([, fecthTotalFlightCountByMonth()]);
  };

  const fecthTotalFlightCountByMonth = async () => {
    const totalFlightCountByMonth = await getMonthlyFlightCount(0);
    const initialCounts = Array(12).fill(0);
    const countsWithValues = Object.entries(totalFlightCountByMonth).reduce(
      (counts, [month, count]) => {
        counts[month - 1] = count;
        return counts;
      },
      initialCounts
    );
    setTotalFlightCountByMonth(countsWithValues);
  };

  useEffect(() => {
    fecthTodayFlightCount();
    fecthTotalFlightCount();
    fecthArrivedFlightCount();
    fecthDeparturedFlightCount();
    fecthTotalFlightCountByMonth();
  }, []);

  return (
    <>
      <Sidebar open={openSidebar} setOpen={setOpenSidebar} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Main open={openSidebar}>
          <DrawerHeader />
          <Box>
            <Grid container spacing={4}>
              <Grid item md={3}>
                <CountedPaper
                  label="TOTAL FLIGHTS"
                  value={totalFlightCount}
                  Icon={FlightOutlinedIcon}
                  color="primary.main"
                />
              </Grid>
              <Grid item md={3}>
                <CountedPaper
                  label="TODAY FLIGHTS"
                  value={todayFlightCount}
                  Icon={TodayOutlinedIcon}
                  color="secondary.main"
                />
              </Grid>
              <Grid item md={3}>
                <CountedPaper
                  label="DEPARTURED FLIGHTS"
                  value={departuredFlightCount}
                  Icon={FlightTakeoffOutlinedIcon}
                  color="primary.light"
                />
              </Grid>
              <Grid item md={3}>
                <CountedPaper
                  label="ARRIVED FLIGHTS"
                  value={arrivedFlightCount}
                  Icon={FlightLandOutlinedIcon}
                  color="secondary.light"
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item md={7} sx={{ mt: 2 }}>
                <Paper elevation={8} sx={{ borderRadius: "15px" }}>
                  <BarChart
                    chartSeries={[
                      { name: "Flights", data: totalFlightCountByMonth },
                    ]}
                    onSync={reloadData}
                  />
                </Paper>
              </Grid>
            </Grid>
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
            ></Box>
          </Box>
        </Main>
      </div>
    </>
  );
};

export default DashBoard;
