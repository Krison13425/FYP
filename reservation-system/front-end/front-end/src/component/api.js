import { toBePartiallyChecked } from "@testing-library/jest-dom/matchers";
import axios from "axios";
import Cookies from "universal-cookie";

const BASE_URL = "http://localhost:8080/api"; // replace with your Spring Boot server address

const cookies = new Cookies();
const user = cookies.get("user");
const token = user ? user : null;

// Airport
export const getAirports = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/airports/code_municipal`);
    const data = Object.entries(response.data).map(([code, name]) => ({
      code,
      name,
    }));
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAirportNameList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/airports/user/code_name`);
    const data = Object.entries(response.data).map(([code, name]) => ({
      code,
      name,
    }));
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAirportList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/airports/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createAirport = async (airport) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/airports/create`,
      JSON.stringify(airport),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFilteredAirportList = async (location) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/airports/filter?location=${location}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAirportByCode = async (code) => {
  try {
    const response = await axios.get(`${BASE_URL}/airports/${code}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const editAirport = async (airport) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/airports/edit`,
      JSON.stringify(airport),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deletAirport = async (code) => {
  try {
    const response = await axios.delete(`${BASE_URL}/airports/delete/${code}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Country
export const getOnCountry = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/countries/on`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = Object.entries(response.data).map(([code, name]) => ({
      code,
      name,
    }));
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCountryList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/countries/all`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateCountryStatus = async (updatedCountries) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/countries/update`,
      JSON.stringify(updatedCountries),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// PLane
export const createPlane = async (airplane) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/airplane/create`,
      JSON.stringify(airplane),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const editPlane = async (airplane) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/airplane/edit`,
      JSON.stringify(airplane),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAirplanesList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/airplane/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAirplanesListByAirport = async (
  departureAirport,
  arrivalAirport
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/airplane/airport?departureAirport=${departureAirport}&arrivalAirport=${arrivalAirport}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = Object.entries(response.data).map(([id, name]) => ({
      id,
      name,
    }));
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFilteredAirplanesList = async (status, location) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/airplane/filter?status=${status}&location=${location}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAirplaneById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/airplane/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deletPlane = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/airplane/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// BUNDLE
export const getBundleList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/bundle/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createBundle = async (bundle) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/bundle/create`,
      JSON.stringify(bundle),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getBundleById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/bundle/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const editBundle = async (bundle) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/bundle/edit`,
      JSON.stringify(bundle),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deletBundle = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/bundle/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getBundlesByClass = async (flightClass) => {
  try {
    const response = await axios.get(`${BASE_URL}/bundle/class`, {
      params: {
        flightClass: flightClass,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error retrieving bundles:", error);
    throw error;
  }
};

// BAGGAGE
export const getBaggageList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/baggage/all`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createBaggage = async (baggage) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/baggage/create`,
      JSON.stringify(baggage),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getBaggageById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/baggage/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const editBaggage = async (bundle) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/baggage/edit`,
      JSON.stringify(bundle),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deletBaggage = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/baggage/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// MEAL
export const getMealList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/meal/all`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFilteredMealList = async (type) => {
  try {
    const response = await axios.get(`${BASE_URL}/meal/filter?type=${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createMeal = async (meal) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/meal/create`,
      JSON.stringify(meal),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getMealById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/meal/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const editMeal = async (meal) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/meal/edit`,
      JSON.stringify(meal),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deletMeal = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/meal/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// FLIGHT
export const getFLightsList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/flight/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createFlight = async (flight) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/flight/create`,
      JSON.stringify(flight),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFilteredFlights = async (
  departureAirport,
  arrivalAirport,
  departureDateStart,
  departureDateEnd,
  arrivalDateStart,
  arrivalDateEnd,
  type,
  status
) => {
  try {
    const response = await axios.get(`${BASE_URL}/flight/filter`, {
      params: {
        departureAirport,
        arrivalAirport,
        departureDateStart,
        departureDateEnd,
        arrivalDateStart,
        arrivalDateEnd,
        type,
        status,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFlightById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/flight/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const editFlightStatus = async (id, status, time) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/flight/edit?id=${id}&status=${status}&departureTime=${time}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deletFlight = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/flight/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const editFlightPrice = async (
  flightId,
  economyPrice,
  businessPrice
) => {
  console.log(flightId, economyPrice, businessPrice);
  try {
    const response = await axios.put(
      `${BASE_URL}/flight/${flightId}/price?economyPrice=${economyPrice}&businessPrice=${businessPrice}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTaodayFlightByStatus = async (status) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/flight/today?status=${status}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFlightCountByStatus = async (
  status,
  isToday,
  isByMonth,
  isDelayed
) => {
  const user = cookies.get("user");
  const token = user ? user : null;
  try {
    const response = await axios.get(`${BASE_URL}/flight/count`, {
      params: {
        status,
        isToday,
        isByMonth,
        isDelayed,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getMonthlyFlightCount = async (isDelayed) => {
  try {
    const user = cookies.get("user");
    const token = user ? user : null;

    const response = await axios.get(
      `${BASE_URL}/flight/count/monthly?isDelayed=${isDelayed}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserFilteredFlights = async (
  departureAirport,
  arrivalAirport,
  departureDate,
  status,
  flightClass
) => {
  try {
    const response = await axios.get(`${BASE_URL}/flight/user/filter`, {
      params: {
        departureAirport,
        arrivalAirport,
        departureDate,
        status,
        flightClass,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFlightDatePriceList = async (
  departureAirport,
  arrivalAirport,
  departureDateStart,
  departureDateEnd,
  flightClass
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/flight/user/date_price_list`,
      {
        params: {
          departureAirport,
          arrivalAirport,
          departureDateStart,
          departureDateEnd,
          flightClass,
        },
      }
    );
    const data = Object.entries(response.data).map(([date, price]) => ({
      date,
      price,
    }));
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

//User
export const adminAuthenticate = async (loginCredentials) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/v1/auth/authenticate`,
      loginCredentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const register = async (request) => {
  try {
    const response = await axios.post(`${BASE_URL}/v1/auth/register`, request);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const googleLogin = async (request) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/v1/auth/userAuthenticate/google?token=${request}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const userAuthenticate = async (request) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/v1/auth/userAuthenticate`,
      request
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createPasswordResetToken = async (email) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/v1/auth/resetPassword?email=${encodeURIComponent(email)}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const resetPassword = async (email, newPassword, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/v1/auth/reset-password`, {
      email: email,
      newPassword: newPassword,
      token: token,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserDetails = async (id) => {
  try {
    const user = cookies.get("user");
    const token = user ? user : null;

    const response = await axios.get(`${BASE_URL}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUserDetails = async (id, userDetails) => {
  try {
    const user = cookies.get("user");
    const token = user ? user : null;
    const response = await axios.put(
      `${BASE_URL}/user/update/${id}`,
      JSON.stringify(userDetails),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//AIRPLANE SEAT

export const getNotAvailableSeats = async (airplaneId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/airplaneSeats/notAvailable/${airplaneId}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAirplaneSeatsListById = async (airplaneId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/airplaneSeats/${airplaneId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateAvailability = async (
  airplaneId,
  seatRow,
  seatLetter,
  availability,
  token
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${airplaneId}/${seatRow}/${seatLetter}`,
      {},
      {
        params: { availability },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//SEATS

export const getBookedSeats = async (flightId) => {
  try {
    const response = await axios.get(`${BASE_URL}/seats/flight/${flightId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllSeats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/seats/all`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//PRICE

export const calculatePrice = async (flightDetails, passengerDetails) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/price/calculate`,
      {
        flightDetails: flightDetails,
        passengerDetails: passengerDetails,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const calculateExtraPrice = async (price, baggageId, fligthId) => {
  try {
    const response = await axios.get(`${BASE_URL}/price/calculate/extra`, {
      params: {
        price: price,
        baggageId: baggageId,
        flightId: fligthId,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const calculateExtraPriceChange = async (price, baggageId, fligthId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/price/calculate/extra/change`,
      {
        params: {
          price: price,
          baggageId: baggageId,
          flightId: fligthId,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// TRANSPORT

export const getAllTransports = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/transports/all`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTransportById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/transports/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createTransport = async (transport) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/transports/create`,
      JSON.stringify(transport),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateTransport = async (id, price) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/transports/edit?id=${id}&price=${price}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteTransport = async (id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/transports/delete?id=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//TRANSACTION
export const createTransaction = async (transaction) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/transactions/create`,
      JSON.stringify(transaction),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTransactionById = async (transactionId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/transactions/${transactionId}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//Bookings
export const createBooking = async (bookingRequestBody) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/bookings/create`,
      JSON.stringify(bookingRequestBody),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllBookings = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/bookings/all`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllBookingByUserId = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/bookings/all/user/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//EMERGENCY

export const createEmergencyContact = async (emergencyContact) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/emergency/create`,
      JSON.stringify(emergencyContact),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getEmergencyContactById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/emergency/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//PASSENGER
export const getPassengerByReferenceBookingId = async (
  referenceBookingId,
  LastName
) => {
  try {
    const response = await axios.get(`${BASE_URL}/passengers/search-booking`, {
      params: {
        referenceBookingId: referenceBookingId,
        LastName: LastName,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const checkin = async (referenceBookingId, LastName) => {
  try {
    const response = await axios.get(`${BASE_URL}/passengers/checkIn`, {
      params: {
        referenceBookingId: referenceBookingId,
        LastName: LastName,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllPassengers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/passengers`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createPassenger = async (passengerRequestBody, bookingId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/passengers/create`,
      JSON.stringify(passengerRequestBody),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

//EMAIL
export const sendEmail = async (bookingId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/email/send?bookingId=${bookingId}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
