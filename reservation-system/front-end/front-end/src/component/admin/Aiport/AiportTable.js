import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useLocation } from "react-router-dom";
import Table from "../Global/Table";

const AirportTable = ({
  searchTerm,
  handleEditClick,
  handleDeleteClick,
  airports,
  countries,
}) => {
  const location = useLocation();

  const filteredData = airports.filter((port) => {
    const airportValues = Object.values(port);
    for (const value of airportValues) {
      if (
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  });
  const editColumn = {
    id: "code",
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

  const deleteColumn = {
    id: "code",
    label: "Delete",
    minWidth: 100,
    format: (value) => (
      <Button
        type="button"
        variant="contained"
        onClick={() => handleDeleteClick(value)}
        color="error"
      >
        Delete
      </Button>
    ),
  };

  const columns = [
    { id: "code", label: "Airport IATA Code", minWidth: 100 },
    {
      id: "name",
      label: "Airport Name",
      minWidth: 100,
    },
    { id: "municipal", label: "Airport Municipal", minWidth: 100 },
    {
      id: "country_code",
      label: "Airport Country",
      minWidth: 100,
      format: (value) => `${countries[value] || "Loading..."}`,
    },
    {
      id: "latitude",
      label: "Airport latitude",
      minWidth: 100,
    },
    {
      id: "longitude",
      label: "Airport longitude",
      minWidth: 100,
    },
    {
      id: "address",
      label: "Airport address",
      minWidth: 100,
    },
    {
      id: "phone",
      label: "Airport Phone",
      minWidth: 100,
    },
    {
      id: "terminal",
      label: "Airport Terminal",
      minWidth: 100,
    },
  ];

  if (location.pathname === "/admin/updateAirport") {
    columns.push(editColumn);
    columns.push(deleteColumn);
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Table data={filteredData} columns={columns} />
    </Paper>
  );
};

export default AirportTable;
