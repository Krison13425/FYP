import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCountryList, getUserDetails } from "../../api";
import NavBar from "../global/Navbar";
import { SearchContext } from "../global/SearchContext";
import BookingStepper from "../global/Stepper";
import PassengerDailog from "./Dailog";

const InsertUserInformation = () => {
  const { originalFlightSearch } = useContext(SearchContext);
  const [passengers, setPassengers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countryData, setCountryData] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("MY");
  const [birthDate, setBirthDate] = useState(null);
  const [phoneCode, setPhoneCode] = useState(null);
  const [emergencyPhoneCode, setEmergencyPhoneCode] = useState(null);
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState(null);
  const [emergencyName, setEmergencyName] = useState(null);
  const [email, setEmail] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [confirmEmail, setConfirmEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [confirmError, setConfirmError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [emergencyPhoneNumberError, setEmergencyPhoneNumberError] =
    useState(false);
  const [inputValue, setInputValue] = useState("");

  const [error, setError] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [formMode, setFormMode] = useState("insert");
  const [editPassengerKey, setEditPassengerKey] = useState(null);

  const [userDetails, setUserDetails] = useState({
    userFirstName: "",
    userLastName: "",
    userDOB: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const [userCheck, setUserCheck] = useState(false);

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleBack = () => {
    setShowDialog(false);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const navigate = useNavigate();

  const title = [
    { value: "Mr", label: "Mr." },
    { value: "Mrs", label: "Mrs." },
    { value: "Ms", label: "Ms" },
    { value: "Tun", label: "Tun" },
    { value: "Tan Sri", label: "Tan Sri" },
  ];

  useEffect(() => {
    console.log(formMode);
    console.log(editPassengerKey);
    if (formMode === "insert") {
      let passengerType = passengers[currentIndex]?.type;
      let storedPassengers =
        JSON.parse(sessionStorage.getItem("passenger")) || {};
      let storedPassengersByPassengerType = storedPassengers[passengerType];

      if (storedPassengersByPassengerType) {
        setFirstName(storedPassengersByPassengerType.firstName || "");
        setLastName(storedPassengersByPassengerType.lastName || "");
        setSelectedTitle(storedPassengersByPassengerType.selectedTitle || null);
        setNationality(storedPassengersByPassengerType.nationality || null);
        setBirthDate(dayjs(storedPassengersByPassengerType.birthDate) || null);
      } else {
        resetForm();
      }

      if (passengerType === "Adult1") {
        let contactInfo = JSON.parse(sessionStorage.getItem("contactInfo"));

        if (contactInfo) {
          setEmail(contactInfo.email);
          setConfirmEmail(contactInfo.confirmEmail);
          setPhoneCode(contactInfo.phoneCode);
          setPhoneNumber(contactInfo.phoneNumber);
        }

        let emergencyInfo = JSON.parse(sessionStorage.getItem("emergencyInfo"));

        if (emergencyInfo) {
          setEmergencyName(emergencyInfo.emergencyName);
          setEmergencyPhoneCode(emergencyInfo.emergencyPhoneCode);
          setEmergencyPhoneNumber(emergencyInfo.emergencyPhoneNumber);
        }
      }
    } else {
      let passengerType = sessionStorage.getItem("passengerKey");
      let storedPassengers =
        JSON.parse(sessionStorage.getItem("passenger")) || {};
      let storedPassengersByPassengerType = storedPassengers[passengerType];

      if (storedPassengersByPassengerType) {
        setFirstName(storedPassengersByPassengerType.firstName || "");
        setLastName(storedPassengersByPassengerType.lastName || "");
        setSelectedTitle(storedPassengersByPassengerType.selectedTitle || null);
        setNationality(storedPassengersByPassengerType.nationality || null);
        setBirthDate(dayjs(storedPassengersByPassengerType.birthDate) || null);
      } else {
        resetForm();
      }

      if (passengerType === "Adult1") {
        let contactInfo = JSON.parse(sessionStorage.getItem("contactInfo"));

        if (contactInfo) {
          setEmail(contactInfo.email);
          setConfirmEmail(contactInfo.confirmEmail);
          setPhoneCode(contactInfo.phoneCode);
          setPhoneNumber(contactInfo.phoneNumber);
        }

        let emergencyInfo = JSON.parse(sessionStorage.getItem("emergencyInfo"));

        if (emergencyInfo) {
          setEmergencyName(emergencyInfo.emergencyName);
          setEmergencyPhoneCode(emergencyInfo.emergencyPhoneCode);
          setEmergencyPhoneNumber(emergencyInfo.emergencyPhoneNumber);
        }
      }
    }
  }, [currentIndex, passengers, formMode]);

  useEffect(() => {
    let passengerData = [];

    for (let i = 0; i < originalFlightSearch.passengers?.adults; i++) {
      passengerData.push({ type: `Adult${i + 1}` });
    }

    for (let i = 0; i < originalFlightSearch.passengers?.children; i++) {
      passengerData.push({ type: `Child${i + 1}` });
    }

    for (let i = 0; i < originalFlightSearch.passengers?.babies; i++) {
      passengerData.push({ type: `Baby${i + 1}` });
    }

    setPassengers(passengerData);
  }, [originalFlightSearch]);

  useEffect(() => {
    if (formMode === "insert") {
      let passengerType = passengers[currentIndex]?.type;
      let storedPassengers =
        JSON.parse(sessionStorage.getItem("passenger")) || {};
      let storedPassengersByPassengerType = storedPassengers[passengerType];

      if (storedPassengersByPassengerType) {
        setFirstName(storedPassengersByPassengerType.firstName || "");
        setLastName(storedPassengersByPassengerType.lastName || "");
        setSelectedTitle(storedPassengersByPassengerType.selectedTitle || null);
        setNationality(storedPassengersByPassengerType.nationality || null);
        setBirthDate(dayjs(storedPassengersByPassengerType.birthDate) || null);
      } else {
        resetForm();
      }

      if (passengerType === "Adult1") {
        let contactInfo = JSON.parse(sessionStorage.getItem("contactInfo"));

        if (contactInfo) {
          setEmail(contactInfo.email);
          setConfirmEmail(contactInfo.confirmEmail);
          setPhoneCode(contactInfo.phoneCode);
          setPhoneNumber(contactInfo.phoneNumber);
        }

        let emergencyInfo = JSON.parse(sessionStorage.getItem("emergencyInfo"));

        if (emergencyInfo) {
          setEmergencyName(emergencyInfo.emergencyName);
          setEmergencyPhoneCode(emergencyInfo.emergencyPhoneCode);
          setEmergencyPhoneNumber(emergencyInfo.emergencyPhoneNumber);
        }
      }
    }
  }, [currentIndex, passengers]);

  const fetchCountryList = async () => {
    const countryList = await getCountryList();
    const malaysiaIndex = countryList.findIndex(
      (country) => country.code === "MY"
    );
    if (malaysiaIndex !== -1) {
      countryList.splice(0, 0, countryList.splice(malaysiaIndex, 1)[0]);
    }
    setCountryData(countryList);
  };

  useEffect(() => {
    fetchCountryList();

    if (sessionStorage.getItem("formMode")) {
      setFormMode(sessionStorage.getItem("formMode"));
    }
    setEditPassengerKey(sessionStorage.getItem("passengerKey"));
  }, []);

  const processEmailChange = (newEmail) => {
    setEmail(newEmail);
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    setError(!pattern.test(newEmail));
  };

  const handleEmail = (event) => {
    processEmailChange(event.target.value);
  };

  const handleConfirmEmail = (event) => {
    processConfirmEmailChange(event.target.value);
  };

  const processConfirmEmailChange = (newConfirmEmail) => {
    setConfirmEmail(newConfirmEmail);
    setConfirmError(newConfirmEmail !== email);
  };

  const handlePhoneNumber = (event, phoneNumberType) => {
    const input = event.target.value;
    setInputValue(input);
    const numericInput = input.replace(/[^0-9]/g, "");

    const MAX_PHONE_NUMBER_LENGTH = 10;

    if (phoneNumberType === "emergency") {
      if (numericInput === phoneNumber) {
        setEmergencyPhoneNumberError(true);
      } else {
        setEmergencyPhoneNumber(numericInput);
        setEmergencyPhoneNumberError(false);
      }
    } else {
      setPhoneNumber(numericInput);
      if (numericInput === emergencyPhoneNumber) {
        setPhoneNumberError(true);
      } else {
        setPhoneNumberError(false);
      }
    }

    if (numericInput.length > MAX_PHONE_NUMBER_LENGTH) {
      if (phoneNumberType === "emergency") {
        setEmergencyPhoneNumberError(true);
      } else {
        setPhoneNumberError(true);
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    if (name === "firstName") {
      setFirstName(value);
    } else if (name === "lastName") {
      setLastName(value);
    } else if (name === "emergencyName") {
      setEmergencyName(value);
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setNationality("MY");
    setBirthDate(null);
    setPhoneCode(false);
    setEmergencyPhoneCode(false);
    setEmergencyPhoneNumber(null);
    setEmergencyName(null);
    setEmail(null);
    setSelectedTitle(null);
    setConfirmEmail(null);
    setPhoneNumber(null);
    setConfirmError(false);
    setPhoneNumberError(false);
    setEmergencyPhoneNumberError(false);
    setError(false);
  };

  const nextPassenger = () => {
    let passengerType;

    if (formMode === "insert") {
      passengerType = passengers[currentIndex]?.type;
    } else {
      passengerType = editPassengerKey;
    }

    let storedPassengers =
      JSON.parse(sessionStorage.getItem(passengerType)) || {};

    const passengerKey = passengerType;

    let passengerData;
    if (storedPassengers) {
      passengerData = {
        firstName,
        lastName,
        birthDate,
        selectedTitle,
        nationality,
        ...storedPassengers,
      };
    } else {
      passengerData = {
        firstName,
        lastName,
        birthDate,
        selectedTitle,
        nationality,
      };
    }

    let passengerToStore = { [passengerKey]: passengerData };

    let existingPassengers =
      JSON.parse(sessionStorage.getItem("passenger")) || {};

    if (existingPassengers) {
      let updatedPassengers = { ...existingPassengers };
      for (const key in passengerToStore) {
        if (passengerToStore.hasOwnProperty(key)) {
          updatedPassengers[key] = {
            ...existingPassengers[key],
            ...passengerToStore[key],
          };
        }
      }
      sessionStorage.setItem("passenger", JSON.stringify(updatedPassengers));
      sessionStorage.removeItem(passengerType);
    } else {
      sessionStorage.setItem("passenger", JSON.stringify(passengerToStore));
      sessionStorage.removeItem(passengerType);
    }

    if (passengerType === "Adult1") {
      const contacData = {
        email,
        confirmEmail,
        phoneCode,
        phoneNumber,
      };

      sessionStorage.setItem("contactInfo", JSON.stringify(contacData));

      const emergencyData = {
        emergencyName,
        emergencyPhoneCode,
        emergencyPhoneNumber,
      };

      sessionStorage.setItem("emergencyInfo", JSON.stringify(emergencyData));
    }

    if (formMode === "edit") {
      sessionStorage.removeItem("formMode");
      sessionStorage.removeItem("passengerKey");
      navigate("/ConfirmBooking");
    } else if (
      formMode === "insert" &&
      currentIndex !== passengers.length - 1
    ) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      resetForm();
    } else {
      navigate("/ConfirmBooking");
    }
  };

  const handleTitleChange = (event) => {
    setSelectedTitle(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem("id");
      if (id) {
        const data = await getUserDetails(id);
        if (data) {
          setUserDetails({
            userFirstName: data.userFirstName,
            userLastName: data.userLastName,
            userDOB: dayjs(data.userDOB),
          });
          setUserEmail(localStorage.getItem("useremail"));
        }
      }
    };

    fetchData();
  }, []);

  const isUserDetailsEmpty = (details) => {
    return (
      !details.userFirstName.trim() &&
      !details.userLastName.trim() &&
      !details.userDOB.trim()
    );
  };

  const validatePartial = () => {
    return (
      !firstName || !lastName || !nationality || !birthDate || !selectedTitle
    );
  };

  const validateComplete = () => {
    return (
      validatePartial() ||
      !phoneCode ||
      !emergencyPhoneCode ||
      !emergencyPhoneNumber ||
      !emergencyName ||
      !email ||
      !confirmEmail ||
      !phoneNumber ||
      error ||
      confirmError ||
      phoneNumberError ||
      emergencyPhoneNumberError
    );
  };

  return (
    <>
      <NavBar />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          ".MuiStepLabel-label": { fontSize: "1rem" },
        }}
      >
        <BookingStepper
          activeStep={4}
          tripType={originalFlightSearch?.tripType}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mt: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" style={{ color: "red" }}>
          **
        </Typography>
        <Typography variant="h6">
          Fill in all passenger details as it appears on their passport or
          government-issued ID. Passport expiry dates are required to be more
          than 6 months away from the flight date. Otherwise, your entry to the
          destination country may be denied.
        </Typography>
        <Typography variant="h6" style={{ color: "red" }}>
          **
        </Typography>
      </Box>

      {passengers.length > 0 && (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h2">
              {formMode === "insert"
                ? passengers[currentIndex]?.type
                : editPassengerKey}
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 2,
              textAlign: "center",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: 1000,
                display: "flex",
                p: 3,
                borderRadius: "30px",
              }}
            >
              <Grid container spacing={3}>
                <Grid item md={12} sx={{ textAlign: "left" }}>
                  <Typography variant="h3">Personal Information</Typography>
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="firstName"
                    value={firstName}
                    sx={{
                      borderRadius: "20px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "20px",
                      },
                    }}
                    label="First Name/Given Name"
                    variant="outlined"
                    fullWidth
                    required
                    onChange={handleInputChange}
                    onKeyDown={handleInputChange}
                  />
                  <Grid container spacing={1} sx={{ flexDirection: "row" }}>
                    <Grid item md={6}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{
                          mt: 2,
                          borderRadius: "20px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                          },
                        }}
                      >
                        <InputLabel>Title</InputLabel>
                        <Select
                          label="Title"
                          input={<OutlinedInput label="Title" />}
                          value={selectedTitle}
                          onChange={handleTitleChange}
                        >
                          {title.map((item) => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={6}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{
                          mt: 2,
                          borderRadius: "20px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                          },
                        }}
                      >
                        <Autocomplete
                          options={countryData}
                          getOptionLabel={(option) => option?.name}
                          value={
                            countryData.find(
                              (country) => country.code === nationality
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            setNationality(newValue?.code);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Nationality"
                              variant="outlined"
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item md={6}>
                  <TextField
                    name="lastName"
                    label="Last Name/SureName"
                    variant="outlined"
                    value={lastName}
                    fullWidth
                    required
                    sx={{
                      borderRadius: "20px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "20px",
                      },
                    }}
                    onChange={handleInputChange}
                    onKeyDown={handleInputChange}
                  />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{
                        mt: 2,
                        width: "100%",
                        "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                      }}
                      label="BirthDate"
                      value={birthDate}
                      onChange={(newValue) => {
                        setBirthDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      views={["year", "month", "day"]}
                      openTo="year"
                      maxDate={
                        passengers[currentIndex]?.type?.includes("Baby") ||
                        editPassengerKey?.includes("Baby")
                          ? dayjs().subtract(1, "years").add(1, "day")
                          : passengers[currentIndex]?.type?.includes("Child") ||
                            editPassengerKey?.includes("Child")
                          ? dayjs().subtract(2, "years")
                          : passengers[currentIndex]?.type?.includes("Adult") ||
                            editPassengerKey?.includes("Adult")
                          ? dayjs().subtract(12, "years")
                          : null
                      }
                      minDate={
                        passengers[currentIndex]?.type?.includes("Baby") ||
                        editPassengerKey?.includes("Baby")
                          ? dayjs().subtract(3, "years")
                          : passengers[currentIndex]?.type?.includes("Child") ||
                            editPassengerKey?.includes("Child")
                          ? dayjs().subtract(12, "years")?.add(1, "day")
                          : passengers[currentIndex]?.type?.includes("Adult") ||
                            editPassengerKey?.includes("Adult")
                          ? dayjs().subtract(100, "years")
                          : null
                      }
                      format="DD/MM/YYYY"
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item md={6}>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    {!isUserDetailsEmpty(userDetails) &&
                      (passengers[currentIndex]?.type === "Adult1" ||
                        editPassengerKey === "Adult1") && (
                        <FormControlLabel
                          control={
                            <Checkbox
                              icon={<RadioButtonUncheckedOutlinedIcon />}
                              checkedIcon={<CheckCircleIcon />}
                              checked={userCheck}
                              onChange={(e) => {
                                setUserCheck(e.target.checked);
                                if (e.target.checked) {
                                  setFirstName(userDetails.userFirstName);
                                  setLastName(userDetails.userLastName);
                                  setBirthDate(userDetails.userDOB);
                                  processEmailChange(userEmail);
                                  setConfirmEmail(userEmail);
                                  setConfirmError(false);
                                } else {
                                  setFirstName("");
                                  setLastName("");
                                  setBirthDate(null);
                                  setEmail("");
                                  setConfirmEmail("");
                                }
                              }}
                              name="useUserDetails"
                              color="primary"
                            />
                          }
                          label={
                            <Typography variant="h5">Use My Details</Typography>
                          }
                        />
                      )}
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {(formMode === "insert" &&
            passengers[currentIndex]?.type === "Adult1") ||
          (formMode === "edit" && editPassengerKey === "Adult1") ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                  textAlign: "center",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    width: 1000,
                    display: "flex",
                    p: 3,
                    borderRadius: "30px",
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item md={12} sx={{ textAlign: "left" }}>
                      <Typography variant="h3">Contact Information</Typography>
                      <Stack direction="row">
                        <Typography variant="h6" style={{ color: "red" }}>
                          ***
                        </Typography>
                        <Typography variant="h6">
                          Please ensure you get these details right. We'll email
                          you your travel itinerary and notify you of any
                          important changes to your booking.
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item md={6}>
                      <TextField
                        sx={{
                          borderRadius: "20px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                          },
                        }}
                        value={email}
                        label="Email"
                        variant="outlined"
                        fullWidth
                        required
                        onChange={handleEmail}
                        error={error}
                        helperText={error ? "Invalid email address" : ""}
                        InputLabelProps={{ shrink: email ? true : false }}
                      />

                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{
                          mt: 2,
                          borderRadius: "20px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                          },
                        }}
                      >
                        <Autocomplete
                          fullWidth
                          options={countryData}
                          value={
                            countryData?.find(
                              (country) => country?.code === phoneCode
                            ) || null
                          }
                          getOptionLabel={(option) =>
                            option ? `${option.name} (+${option.phone})` : ""
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Country Calling Code"
                              variant="outlined"
                              required
                            />
                          )}
                          onChange={(event, newValue) => {
                            setPhoneCode(newValue ? newValue.code : null);
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={6}>
                      <TextField
                        sx={{
                          borderRadius: "20px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                          },
                        }}
                        error={confirmError}
                        helperText={
                          confirmError ? "Email addresses do not match" : ""
                        }
                        label="Confirm Email"
                        variant="outlined"
                        fullWidth
                        required
                        value={confirmEmail}
                        onChange={handleConfirmEmail}
                        InputLabelProps={{
                          shrink: confirmEmail ? true : false,
                        }}
                      />
                      <TextField
                        sx={{
                          borderRadius: "20px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                          },
                          mt: 2,
                        }}
                        label="Phone Number"
                        variant="outlined"
                        fullWidth
                        required
                        value={phoneNumber}
                        error={phoneNumberError}
                        helperText={
                          phoneNumberError
                            ? "The Maximum Length of the Phone Number is 15 Digit"
                            : ""
                        }
                        onChange={(event) =>
                          handlePhoneNumber(event, "regular")
                        }
                        onKeyPress={(event) => {
                          const keyCode = event.which || event.keyCode;
                          const isValidKey = !(
                            keyCode !== 8 &&
                            keyCode !== 9 &&
                            keyCode !== 46 &&
                            (keyCode < 48 || keyCode > 57)
                          );

                          if (!isValidKey) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </Grid>
                    <Grid item md={6}></Grid>
                  </Grid>
                </Paper>
              </Box>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                  textAlign: "center",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    width: 1000,
                    display: "flex",
                    p: 3,
                    borderRadius: "30px",
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item md={12} sx={{ textAlign: "left" }}>
                      <Typography variant="h3">Emercency Contact</Typography>
                    </Grid>
                    <Grid item md={12}>
                      <TextField
                        name="emergencyName"
                        sx={{
                          borderRadius: "20px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                          },
                        }}
                        value={emergencyName}
                        label="Emercency Contact Name"
                        variant="outlined"
                        fullWidth
                        required
                        onChange={handleInputChange}
                        onKeyDown={handleInputChange}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{
                          borderRadius: "20px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                          },
                        }}
                      >
                        <Autocomplete
                          fullWidth
                          options={countryData}
                          value={
                            countryData?.find(
                              (country) => country?.code === emergencyPhoneCode
                            ) || null
                          }
                          getOptionLabel={(option) =>
                            `${option.name} (+${option.phone})`
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Country Calling Code"
                              variant="outlined"
                              required
                            />
                          )}
                          onChange={(event, newValue) => {
                            setEmergencyPhoneCode(
                              newValue ? newValue.code : null
                            );
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={6}>
                      <TextField
                        sx={{
                          borderRadius: "20px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                          },
                        }}
                        label="Emergency Phone Number"
                        variant="outlined"
                        value={emergencyPhoneNumber}
                        fullWidth
                        required
                        onChange={(event) =>
                          handlePhoneNumber(event, "emergency")
                        }
                        error={emergencyPhoneNumberError}
                        helperText={
                          emergencyPhoneNumberError
                            ? inputValue === phoneNumber
                              ? "Emergency Phone Number cannot be the same as Phone Number"
                              : "The Maximum Length of the Phone Number is 15 Digit"
                            : ""
                        }
                        onKeyPress={(event) => {
                          const keyCode = event.which || event.keyCode;
                          const isValidKey = !(
                            keyCode !== 8 &&
                            keyCode !== 9 &&
                            keyCode !== 46 &&
                            (keyCode < 48 || keyCode > 57)
                          );

                          if (!isValidKey) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </Grid>
                    <Grid item md={6}></Grid>
                  </Grid>
                </Paper>
              </Box>
            </>
          ) : (
            <></>
          )}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 5,
            }}
          >
            {currentIndex > 0 && (
              <Button
                type="submit"
                variant="contained"
                size="large"
                onClick={handleOpenDialog}
                sx={{ borderRadius: "20px", mr: 70, fontSize: "1rem" }}
              >
                Previous Passenger
              </Button>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              onClick={nextPassenger}
              sx={{ borderRadius: "20px", fontSize: "1rem" }}
              disabled={
                formMode === "insert"
                  ? currentIndex === 0
                    ? validateComplete()
                    : validatePartial()
                  : formMode === "edit" && editPassengerKey === "Adult1"
                  ? validateComplete()
                  : validatePartial()
              }
            >
              {formMode === "edit"
                ? "Confirm"
                : currentIndex === passengers.length - 1
                ? "Confirm Booking"
                : "Next Passenger"}
            </Button>
          </Box>
        </>
      )}

      <PassengerDailog
        open={showDialog}
        onClose={handleCloseDialog}
        back={handleBack}
      />
    </>
  );
};

export default InsertUserInformation;
