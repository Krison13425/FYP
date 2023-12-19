import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useLocation } from "react-router-dom";
import Table from "../Global/Table";

const TransportTable = ({
  searchTerm,
  handleEditClick,
  handleDeleteClick,
  transports,
}) => {
  const location = useLocation();

  const filteredData = transports.filter((transport) => {
    const Values = Object.values(transport);
    for (const value of Values) {
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

  const deleteColumn = {
    id: "id",
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
    { id: "name", label: "Transport Name", minWidth: 100 },
    {
      id: "type",
      label: "Transport Type",
      minWidth: 100,
      format: (value) => (value === 1 ? "MPV" : "Sedan"),
    },
    { id: "price", label: "Transport Price", minWidth: 100 },
    { id: "capacity", label: "Transport Capacity", minWidth: 100 },
    { id: "luggage", label: "Transport Luggage", minWidth: 100 },
  ];

  if (location.pathname === "/admin/updateTransport") {
    columns.push(editColumn);
    columns.push(deleteColumn);
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Table data={filteredData} columns={columns} />
    </Paper>
  );
};

export default TransportTable;
