import { useTheme } from "@mui/material";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Table from "../Global/Table";

const CountryTable = ({ searchTerm, handleEditClick, countries }) => {
  const theme = useTheme();

  const filteredData = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { id: "name", label: "Country Name", minWidth: 170 },
    {
      id: "on_off",
      label: "On Off",
      minWidth: 170,
      format: (valus, country) => (
        <Switch
          checked={country.on_off === 1}
          onChange={() => handleEditClick(country)}
        />
      ),
    },
  ];

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Table data={filteredData} columns={columns} />
    </Paper>
  );
};

export default CountryTable;
