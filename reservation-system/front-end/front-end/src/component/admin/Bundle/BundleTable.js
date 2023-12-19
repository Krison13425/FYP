import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useLocation } from "react-router-dom";
import Table from "../Global/Table";

const BundleTable = ({
  searchTerm,
  handleEditClick,
  handleDeleteClick,
  bundles,
}) => {
  const location = useLocation();

  const filteredData = bundles.filter((bundle) => {
    const Values = Object.values(bundle);
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

  const formatValue = (value, columnId) => {
    if (columnId !== "price" && columnId !== "name" && columnId !== "id") {
      return value === 1 ? <CheckOutlinedIcon /> : <ClearOutlinedIcon />;
    }
    return value;
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
    { id: "name", label: "Bundle Name", minWidth: 100 },
    {
      id: "cabinBaggage",
      label: "Cabin Baggage",
      minWidth: 100,
      format: formatValue,
    },
    {
      id: "freeMeal",
      label: "Free Meal",
      minWidth: 100,
      format: formatValue,
    },
    {
      id: "checkinBaggage20",
      label: "Check-in Baggage 20kg",
      minWidth: 100,
      format: formatValue,
    },
    {
      id: "checkinBaggage30",
      label: "Check-in Baggage 30kg",
      minWidth: 100,
      format: formatValue,
    },
    {
      id: "checkinBaggage40",
      label: "Check-in Baggage 40kg",
      minWidth: 100,
      format: formatValue,
    },

    {
      id: "prioCheckIn",
      label: "Priority Check-In",
      minWidth: 100,
      format: formatValue,
    },
    {
      id: "prioBoarding",
      label: "Priority Boarding",
      minWidth: 100,
      format: formatValue,
    },
    {
      id: "loungeAccess",
      label: "Lounge Access",
      minWidth: 100,
      format: formatValue,
    },
    { id: "domesticPrice", label: "Domestic Price", minWidth: 100 },
    { id: "internationalPrice", label: "International Price", minWidth: 100 },
  ];

  if (location.pathname === "/admin/updateBundle") {
    columns.push(editColumn);
    columns.push(deleteColumn);
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Table data={filteredData} columns={columns} />
    </Paper>
  );
};

export default BundleTable;
