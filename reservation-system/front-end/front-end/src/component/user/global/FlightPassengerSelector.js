import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import { FormControl, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

const FlightPassengerSelector = ({
  passengers,
  setPassengers,
  onPassengerChange,
}) => {
  const handleIncrement = (type) => {
    const totalPassengers = Object.values(passengers).reduce(
      (a, b) => a + b,
      0
    );
    if (totalPassengers < 9) {
      const newPassengers = {
        ...passengers,
        [type]: Math.min(passengers[type] + 1, 9),
      };
      setPassengers(newPassengers);
      if (onPassengerChange) {
        onPassengerChange(newPassengers);
      }
    }
  };

  const handleDecrement = (type) => {
    if (type === "adults" && passengers[type] === 1) {
      return;
    }
    const totalPassengers = Object.values(passengers).reduce(
      (a, b) => a + b,
      0
    );

    if (totalPassengers > 1) {
      const newPassengers = {
        ...passengers,
        [type]: Math.max(passengers[type] - 1, 0),
      };
      setPassengers(newPassengers);
      if (onPassengerChange) {
        onPassengerChange(newPassengers);
      }
    }
  };

  const options = ["adults", "children", "babies"].map((type) => ({
    label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
    type,
  }));

  const totalPassengers = Object.values(passengers).reduce((a, b) => a + b, 0);

  return (
    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.label}
        renderOption={(props, option, { selected }) => (
          <Box sx={{ display: "flex", p: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Typography variant="h5" sx={{ mt: 1, ml: 1 }}>
                  {option.label}
                </Typography>
                {option.type === "adults" && (
                  <Typography variant="h6" sx={{ ml: 1, color: "grey" }}>
                    12 years and above
                  </Typography>
                )}
                {option.type === "children" && (
                  <Typography variant="h6" sx={{ ml: 1, color: "grey" }}>
                    2 to 11 years
                  </Typography>
                )}
                {option.type === "babies" && (
                  <Typography variant="h6" sx={{ ml: 1, color: "grey" }}>
                    Below 2 years
                  </Typography>
                )}
              </Grid>
              <Grid item xs={4}>
                <Box display="flex" justifyContent="center">
                  <Button
                    disabled={
                      (option.type === "adults" && passengers.adults === 1) ||
                      (option.type !== "adults" && totalPassengers === 1) ||
                      passengers[option.type] === 0
                    }
                    onClick={() => handleDecrement(option.type)}
                  >
                    <RemoveCircleOutlineOutlinedIcon />
                  </Button>

                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {passengers[option.type]}
                  </Typography>
                  <Button
                    disabled={totalPassengers === 9}
                    onClick={() => handleIncrement(option.type)}
                  >
                    <AddCircleOutlineOutlinedIcon />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Passengers"
            placeholder="Select passenger type"
            inputProps={{
              ...params.inputProps,
              value: `${totalPassengers} Guest ${
                totalPassengers > 1 ? "Passengers" : "Passenger"
              }`,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default FlightPassengerSelector;
