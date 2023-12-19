import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Toolbar,
} from "@mui/material";
import { useState } from "react";

const SearchAirportForm = ({ onSearch, countries = [], onFilterSubmit }) => {
  const [search, setSearch] = useState("");
  const [filterLocation, setfilterLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterSubmit(filterLocation);
  };

  const handleLocationChange = (event, option) => {
    setfilterLocation(option ? option.code : "");
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Paper elevation={2}>
        <Toolbar>
          <Grid container spacing={2} justifyContent="center">
            <Grid item md={3} mt={1} mb={2}>
              <Box
                fullWidth
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  m: "0 auto",
                  padding: "0 20px",
                }}
              >
                <TextField
                  id="search-field"
                  label="Search"
                  value={search}
                  onChange={handleSearch}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grid>

            <Grid item md={3} mb={2}>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <Autocomplete
                  id="location"
                  options={countries}
                  getOptionLabel={(option) => `${option.name}`}
                  onChange={handleLocationChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Location"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item md={3} mt={2} mb={1}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "left",
                  m: "0 auto",
                  width: "100%",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </Paper>
    </Box>
  );
};

export default SearchAirportForm;
