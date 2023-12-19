import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

const PassengerDailog = ({ open, onClose, back }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          p: 2,
        },
      }}
    >
      <DialogTitle sx={{ fontSize: "1.5rem" }}>
        Show Previous Passenger without Saving?
      </DialogTitle>
      <DialogContent>
        <Grid container>
          <Typography variant="h4">
            Are Your Sure You Want To View the Previous Passenger. This
            Passneger Details will Not Save.
          </Typography>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid
          container
          flexDirection={"row"}
          display={"flex"}
          justifyContent="flex-end"
        >
          <Grid md={6}>
            <Button
              onClick={back}
              color="primary"
              variant="contained"
              sx={{
                borderRadius: "20px",
                width: "300px",
                height: "40px",
                fontSize: "1rem",
                ml: 30,
              }}
            >
              Yes, View Previous Passenger
            </Button>
          </Grid>

          <Grid md={6}>
            <Button
              fullWidth
              onClick={handleClose}
              color="primary"
              variant="contained"
              sx={{
                borderRadius: "20px",
                width: "200px",
                height: "40px",
                fontSize: "1rem",
                ml: 20,
              }}
            >
              No, Keep here
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default PassengerDailog;
