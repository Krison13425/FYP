import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useLocation } from "react-router-dom";
import Table from "../Global/Table";

const BaggageTable = ({
  searchTerm,
  handleEditClick,
  handleDeleteClick,
  baggages,
}) => {
  const location = useLocation();

  const filteredData = baggages.filter((baggage) => {
    const Values = Object.values(baggage);
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
    { id: "name", label: "Baggage Name", minWidth: 100 },
    {
      id: "kg",
      label: "Baggage KG",
      minWidth: 100,
    },
    { id: "domesticPrice", label: "Domestic Price", minWidth: 100 },
    { id: "internationalPrice", label: "International Price", minWidth: 100 },
  ];

  if (location.pathname === "/admin/updateBaggage") {
    columns.push(editColumn);
    columns.push(deleteColumn);
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Table data={filteredData} columns={columns} />
    </Paper>
  );
};

export default BaggageTable;
