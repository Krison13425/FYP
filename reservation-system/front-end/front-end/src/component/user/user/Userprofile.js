import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {
  createPasswordResetToken,
  getAllBookingByUserId,
  getUserDetails,
  updateUserDetails,
} from "../../api";
import NavBar from "../global/Navbar";

const UserProfile = () => {
  const [value, setValue] = useState(0);
  const [isFilled, setIsFilled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [update, setupdated] = useState(false);
  const [userDetails, setUserDetails] = useState({
    userFirstName: "",
    userLastName: "",
    userDOB: "",
  });
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [cookies] = useCookies(["user"]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem("id");
      if (id) {
        const data = await getUserDetails(id);
        if (data) {
          setUserDetails({
            userFirstName: data.userFirstName,
            userLastName: data.userLastName,
            userDOB: data.userDOB ? dayjs(data.userDOB) : null,
          });
          setIsFilled(true);
          setReadOnly(true);
        } else {
          setReadOnly(false);
          setSnackbarOpen(true);
          setSnackbarMessage(
            "Please Insert the User Profile Detials First for other functions"
          );
          setSnackbarSeverity("error");
        }
      }
    };

    fetchData();
  }, [value]);

  useEffect(() => {
    if (value === 1) {
      const fetchData = async () => {
        const id = localStorage.getItem("id");
        if (id) {
          const data = await getAllBookingByUserId(id);
          if (data) {
            setBookingData(data);
          }
        }
      };

      fetchData();
    }
  }, [value]);

  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem("id");
      if (id) {
        const data = await getUserDetails(id);
        if (data) {
          setUserDetails(data);
          setIsFilled(true);
          setReadOnly(true);
        } else {
          setReadOnly(false);
          setSnackbarOpen(true);
          setSnackbarMessage(
            "Please Insert the User Profile Detials First for other functions"
          );
          setSnackbarSeverity("error");
        }
      }
    };

    fetchData();
  }, [update]);

  const updateUserDetailsclick = async () => {
    if (loading) {
      console.log("Update in progress...");
      return;
    }

    setLoading(true);
    try {
      const id = localStorage.getItem("id");
      if (id) {
        const response = await updateUserDetails(id, userDetails);
        if (response === "User Details updated successfully") {
          setupdated(true);
          setSnackbarMessage("User details updated successfully");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage("Failed to update user details");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      }
    } catch (error) {
      setSnackbarMessage("Error updating user details");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      const email = localStorage.getItem("useremail");
      const response = await createPasswordResetToken(email);

      setSnackbarMessage(
        "A verification Email has been sent to your email. Please verify your email for resetting the password."
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);

      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const areUserDetailsFilled = () => {
    return (
      userDetails.userFirstName.trim() !== "" &&
      userDetails.userLastName.trim() !== "" &&
      userDetails.userDOB
    );
  };

  return (
    <>
      <NavBar />

      <Box display={"flex"} flexDirection="row">
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: "divider", width: 200 }}
        >
          <Tab
            label="My Profile"
            {...a11yProps(0)}
            sx={{ fontSize: 20, padding: 2 }}
          />

          <Tab
            label="Bookings"
            {...a11yProps(1)}
            sx={{ fontSize: 20, padding: 2 }}
            disabled={!areUserDetailsFilled()}
            onClick={() => {
              if (!areUserDetailsFilled()) {
                setSnackbarOpen(true);
                setSnackbarMessage(
                  "Please Insert the User Profile Detials to Check for the Bookings"
                );
                setSnackbarSeverity("error");
              }
            }}
          />

          {localStorage.getItem("logintype") === "0" && (
            <Tab
              label="Change Password"
              {...a11yProps(2)}
              sx={{ fontSize: 20, padding: 2 }}
              disabled={!areUserDetailsFilled()}
              onClick={() => {
                if (!areUserDetailsFilled()) {
                  setSnackbarOpen(true);
                  setSnackbarMessage(
                    "Please Insert the User Profile Detials Before Request Reset Password"
                  );
                  setSnackbarSeverity("error");
                }
              }}
            />
          )}
        </Tabs>

        <TabPanel value={value} index={0}>
          <Typography variant="h1">User profile</Typography>
          <Stack direction="row">
            <Typography variant="h6" style={{ color: "red" }} sx={{ mt: 2 }}>
              **
            </Typography>
            <Typography variant="h4" sx={{ mt: 2 }}>
              Please ensure the details you provide match those on your
              government-issued ID (e.g., Passport).
            </Typography>
          </Stack>
          <Box component="form">
            <TextField
              id="first_name"
              label="First Name"
              sx={{
                mt: 2,
                width: "100%",
                "& .MuiOutlinedInput-root": { borderRadius: "20px" },
              }}
              value={userDetails.userFirstName}
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={(event) => {
                setUserDetails({
                  ...userDetails,
                  userFirstName: event.target.value,
                });
              }}
              disabled={readOnly}
            />

            <TextField
              id="last_name"
              label="Last Name"
              sx={{
                mt: 2,
                width: "100%",
                "& .MuiOutlinedInput-root": { borderRadius: "20px" },
              }}
              value={userDetails.userLastName}
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={(event) => {
                setUserDetails({
                  ...userDetails,
                  userLastName: event.target.value,
                });
              }}
              disabled={readOnly}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{
                  mt: 2,
                  width: "100%",
                  "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                }}
                value={userDetails.userDOB ? dayjs(userDetails.userDOB) : null}
                label="Date of Birth"
                onChange={(newValue) => {
                  if (newValue !== null) {
                    setUserDetails({
                      ...userDetails,
                      userDOB: dayjs(newValue),
                    });
                    setIsFilled(
                      userDetails.userFirstName.trim() !== "" ||
                        userDetails.userLastName.trim() !== "" ||
                        newValue !== null
                    );
                  }
                }}
                disabled={readOnly}
                renderInput={(params) => (
                  <TextField {...params} disabled={readOnly} />
                )}
                views={["year", "month", "day"]}
                openTo="year"
                format="DD/MM/YYYY"
                maxDate={dayjs().subtract(18, "years")}
              />
            </LocalizationProvider>

            <Button
              variant="contained"
              color="primary"
              disabled={!isFilled || loading || readOnly}
              sx={{
                mt: 2,
                borderRadius: "20px",
                width: "30%",
                alignSelf: "flex-end",
                fontSize: "1rem",
              }}
              onClick={updateUserDetailsclick}
            >
              Update
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Typography variant="h1">Your Booking</Typography>
          {bookingData && bookingData.length !== 0 ? (
            bookingData.map((booking, index) => (
              <Box sx={{ width: 1300 }}>
                <Grid container spacing={1} sx={{ mt: 3 }}>
                  <Grid item xs={4} sx={{ textAlign: "left" }}>
                    <Typography variant="h3">Booking Reference Id</Typography>{" "}
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Typography variant="h3">Booking Date</Typography>{" "}
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "right" }}></Grid>
                </Grid>
                <Paper
                  key={index}
                  elevation={0}
                  sx={{ mt: 2, p: 3, borderRadius: "25px" }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={4} sx={{ textAlign: "left" }}>
                      <Typography variant="h3" sx={{ mt: 1 }}>
                        {booking.referenceId}
                      </Typography>{" "}
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "center" }}>
                      <Typography variant="h3" sx={{ mt: 1 }}>
                        {dayjs(booking.createdDate).format("DD MMM YYYY")}
                      </Typography>{" "}
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "right" }}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          width: "50%",
                          borderRadius: "50px",
                          fontSize: "1rem",
                        }}
                        size="large"
                        onClick={() => {
                          if (cookies.user && cookies.user !== undefined) {
                            navigate(
                              `/ViewBookings?referenceId=${booking?.referenceId}&lastName=${booking?.lastName}`
                            );
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            ))
          ) : (
            <Typography sx={{ mt: 3 }}>No Booking Found</Typography>
          )}
        </TabPanel>

        {localStorage.getItem("logintype") === "0" && (
          <TabPanel value={value} index={2}>
            <Typography variant="h1">Change Password</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                mt: 5,
                borderRadius: "15px",
                alignSelf: "flex-end",
                fontSize: "1rem",
              }}
              onClick={handleChangePassword}
            >
              Request Change Password
            </Button>
          </TabPanel>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={8000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%", fontSize: "1rem" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default UserProfile;
