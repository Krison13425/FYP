import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Toolbar,
} from "@mui/material";
import { useState } from "react";

const SearchBundleForm = ({ onSearch }) => {
  const [search, setSearch] = useState("");

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
                  label="Search Bundle Name"
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
          </Grid>
        </Toolbar>
      </Paper>
    </Box>
  );
};

export default SearchBundleForm;
