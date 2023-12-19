import { Sync as SyncIcon } from "@mui/icons-material";
import { Button, Card, CardContent, CardHeader, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import ApexCharts from "react-apexcharts";

const Chart = (props) => {
  const { series, options, ...other } = props;

  return <ApexCharts options={options} series={series} type="bar" {...other} />;
};

Chart.propTypes = {
  options: PropTypes.object.isRequired,
  series: PropTypes.array.isRequired,
};

const BarChart = (props) => {
  const theme = useTheme();
  const { chartSeries } = props;

  const chartOptions = {
    tooltip: {
      theme: theme.palette.mode,
      style: {
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
      },
    },
    chart: { toolbar: { show: false } },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    fill: { type: "solid", colors: [theme.palette.primary.main], opacity: 1 },
    grid: { borderColor: theme.palette.primary.driver },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: { style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.secondary },
        formatter: (value) => `${value}`,
      },
    },
    legend: { show: false },
    plotOptions: { bar: { columnWidth: "40%" } },
  };

  return (
    <Card>
      <CardHeader
        action={
          <Button
            color="primary"
            startIcon={<SyncIcon />}
            onClick={props.onSync}
            sx={{ borderRadius: "15px" }}
          >
            Sync
          </Button>
        }
        title="Flights Overview"
      />
      <Divider />
      <CardContent>
        <Chart
          options={chartOptions}
          series={chartSeries}
          height={320}
          width="100%"
        />
      </CardContent>
    </Card>
  );
};

BarChart.propTypes = {
  chartSeries: PropTypes.array.isRequired,
  onSync: PropTypes.func.isRequired,
};

export default BarChart;
