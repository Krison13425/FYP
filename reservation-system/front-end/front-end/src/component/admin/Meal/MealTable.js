import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useLocation } from "react-router-dom";
import Table from "../Global/Table";

const MealTable = ({
  searchTerm,
  handleEditClick,
  handleDeleteClick,
  meals,
}) => {
  const location = useLocation();

  const filteredData = meals.filter((meal) => {
    const Values = Object.values(meal);
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
    { id: "name", label: "Meal Name", minWidth: 100 },
    {
      id: "type",
      label: "Meal Type",
      minWidth: 100,
      format: (value) => (value === 1 ? "Vegan" : "Normal"),
    },
  ];

  if (location.pathname === "/admin/updateMeal") {
    columns.push(deleteColumn);
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Table data={filteredData} columns={columns} />
    </Paper>
  );
};

export default MealTable;
