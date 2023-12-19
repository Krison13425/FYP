import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useLocation } from "react-router-dom";
import Table from "../Global/Table";

const PlaneTable = ({
  searchTerm,
  handleEditClick,
  handleDeleteClick,
  airplanes,
  countries,
}) => {
  const location = useLocation();

  const filteredData = airplanes.filter((plane) =>
    plane.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const editColumn = {
    id: "id",
    label: "Edit",
    minWidth: 170,
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
    id: "id",
    label: "Delete",
    minWidth: 170,
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
    { id: "name", label: "Airplane Name", minWidth: 170 },
    {
      id: "type",
      label: "Airplane Type",
      minWidth: 170,
      format: (value) => (value === 0 ? "A320" : "A330"),
    },
    { id: "speed", label: "Airplane Speed", minWidth: 170 },
    {
      id: "location",
      label: "Location",
      minWidth: 170,
      format: (value) => `${countries[value] || "Loading..."}`,
    },
    {
      id: "status",
      label: "Status",
      minWidth: 170,
      format: (value) => (value === 0 ? "Available" : "Maintaining"),
    },
  ];

  if (location.pathname === "/admin/updatePlane") {
    columns.push(editColumn);
    columns.push(deleteColumn);
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Table data={filteredData} columns={columns} />
    </Paper>
  );
};

export default PlaneTable;
