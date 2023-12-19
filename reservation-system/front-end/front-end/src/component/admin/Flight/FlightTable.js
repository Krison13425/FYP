import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useLocation } from "react-router-dom";
import Table from "../Global/Table";

const FlightTable = ({
  handleUpdateClick,
  handleEditClick,
  handleDeleteClick,
  flights,
}) => {
  const location = useLocation();

  const flightStatus = {
    0: "Booking",
    4: "Delayed",
    1: "Onboarding",
    2: "Departed",
    3: "Arrived",
  };

  const getFlightStatusName = (value) => {
    return flightStatus[value] || "N/A";
  };

  const editColumn = {
    id: "id",
    label: "Edit",
    minWidth: 100,
    format: (value) => (
      <Button
        type="button"
        variant="contained"
        onClick={() => handleEditClick(value)}
      >
        Edit
      </Button>
    ),
  };

  const updateColumn = {
    id: "id",
    label: "Edit",
    minWidth: 100,
    format: (value, rowData) => {
      if (rowData.flight_status === 1) {
        return (
          <Button
            type="button"
            variant="contained"
            onClick={() => handleUpdateClick(value)}
            disabled={rowData.flight_status === 3}
          >
            Departure
          </Button>
        );
      } else if (rowData.flight_status === 2) {
        return (
          <Button
            type="button"
            variant="contained"
            onClick={() => handleUpdateClick(value)}
            disabled={rowData.flight_status === 3}
          >
            Arrived
          </Button>
        );
      } else if (rowData.flight_status === 0 || rowData.flight_status === 4) {
        return (
          <div>
            <Button
              type="button"
              variant="contained"
              onClick={() => handleUpdateClick(value, 4)}
              disabled={rowData.flight_status === 3}
              sx={{ mr: 2 }}
              color="error"
            >
              Delayed
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={() => handleUpdateClick(value, 1)}
              disabled={rowData.flight_status === 3}
            >
              Onboard
            </Button>
          </div>
        );
      } else {
        return (
          <Button
            type="button"
            variant="contained"
            onClick={() => handleUpdateClick(value)}
            disabled={rowData.flight_status === 3}
          ></Button>
        );
      }
    },
  };

  const columns = [
    { id: "airline_id", label: "Airline", width: 50 },
    { id: "airplane_name", label: "Airplane", width: 50 },
    { id: "departure_airport", label: "Departure Airport", width: 50 },
    { id: "arrival_airport", label: "Arrival Airport", width: 50 },
    {
      id: "departure_time",
      label: "Departure Time",
      width: 50,
      format: (value, row) => {
        let dateValue = row.delayed_departure_time || value;
        let date = new Date(dateValue);
        let options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        };
        return date.toLocaleString("en-GB", options).replace(/\//g, "-");
      },
    },
    {
      id: "arrival_time",
      label: "Arrival Time",
      width: 50,
      format: (value, row) => {
        let dateValue = row.delayed_arrival_time || value;
        let date = new Date(dateValue);
        let options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        };
        return date.toLocaleString("en-GB", options).replace(/\//g, "-");
      },
    },
    {
      id: "duration_time",
      label: "Duration",
      width: 50,
      format: (value) => {
        if (value && typeof value === "string") {
          let [hours, minutes] = value.split(":").map(Number);
          if (!isNaN(hours) && !isNaN(minutes)) {
            return `${hours} hrs ${minutes} mins`;
          }
        }
        return "N/A";
      },
    },
    {
      id: "flight_type",
      label: "Flight Type",
      width: 50,
      format: (value) => (value === 0 ? "Domestic" : "International"),
    },
    {
      id: "flight_status",
      label: "Flight Status",
      width: 50,
      format: getFlightStatusName,
    },
    { id: "economy_price", label: "Economy Price", width: 50 },
    { id: "business_price", label: "Business Price", width: 50 },
  ];

  if (location.pathname === "/admin/updateFlight") {
    columns.push(editColumn);
  }

  if (location.pathname === "/admin/updateFlightStatus") {
    columns.push(updateColumn);
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Table data={flights} columns={columns} />
    </Paper>
  );
};

export default FlightTable;
