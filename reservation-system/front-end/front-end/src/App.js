import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CreateAirport from "./component/admin/Aiport/CreateAirport";
import EditAirport from "./component/admin/Aiport/EditAirport";
import CreateBaggage from "./component/admin/Baggage/CreateBaggage";
import EditBaggage from "./component/admin/Baggage/EditBaggage";
import CreateBundle from "./component/admin/Bundle/CreateBundle";
import EditBundle from "./component/admin/Bundle/EditBundle";
import ManageCountry from "./component/admin/Country/ManageCountry";
import DashBoard from "./component/admin/DashBoard";
import CreateFlight from "./component/admin/Flight/CreateFlight";
import EditFlight from "./component/admin/Flight/EditFlight";
import UpdateFlightStatus from "./component/admin/Flight/UpdateFlightStatus";
import CreateMeal from "./component/admin/Meal/CreateMeal";
import EditMeal from "./component/admin/Meal/EditMeal";
import CreatePlane from "./component/admin/Plane/CreatePlane";
import UpdatePlane from "./component/admin/Plane/UpdatePlane";
import AdminProtectedRoutes from "./component/admin/Protected";
import CreateTransport from "./component/admin/Transport/CreateTransport";
import EditTransport from "./component/admin/Transport/EditTranport";
import AdminLogin from "./component/admin/login";
import AddOns from "./component/user/AddOns/AddOns";
import SelectBundle from "./component/user/AddOns/SelectBundle";
import ConfirmBooking from "./component/user/Booking/ConfirmBooking";
import ViewBookings from "./component/user/Bookings/ViewBookings";
import Checkout from "./component/user/CheckOut/CheckOut";
import PaymentSuccess from "./component/user/CheckOut/PaymentSucess";
import MainPage from "./component/user/MainPage/MainPage";
import SelectDepartureFlight from "./component/user/SelectFlight/SelectDepartureFlight";
import SelectReturnFlight from "./component/user/SelectFlight/SelectReturnFlight";
import InsertUserInformation from "./component/user/UserInformation/InsertUserInformation";
import { SearchProvider } from "./component/user/global/SearchContext";
import UserRegister from "./component/user/user/UerRegister";
import UserLogin from "./component/user/user/UserLogin";
import UserProfile from "./component/user/user/Userprofile";
import UserProtectedRoutes from "./component/user/userprotected";
import { ColorModeContext, themeSettings, useMode } from "./theme";
import ForgetPassword from "./component/user/user/ForgetPassword";
import ResetPassword from "./component/user/user/ResetPassword";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LoadScript } from "@react-google-maps/api";

function App() {
  const [theme, colorMode] = useMode();
  const libraries = ["places"];
  const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
        <SearchProvider>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <CssBaseline />

              <LoadScript
                googleMapsApiKey={GOOGLE_MAP_API_KEY}
                libraries={libraries}
              >
                <Router>
                  <Routes>
                    <Route path="/admin" element={<AdminLogin />} />

                    <Route element={<AdminProtectedRoutes />}>
                      <Route
                        path="/admin/dashboard"
                        element={<DashBoard />}
                        exact
                      />
                      <Route
                        path="/admin/createFlight"
                        element={<CreateFlight />}
                      />
                      <Route
                        path="/admin/updateFlight"
                        element={<EditFlight />}
                      />
                      <Route
                        path="/admin/updateFlightStatus"
                        element={<UpdateFlightStatus />}
                      />
                      <Route
                        path="/admin/createPlane"
                        element={<CreatePlane />}
                      />
                      <Route
                        path="/admin/updatePlane"
                        element={<UpdatePlane />}
                      />
                      <Route
                        path="/admin/updateCountry"
                        element={<ManageCountry />}
                      />
                      <Route
                        path="/admin/createAirport"
                        element={<CreateAirport />}
                      />
                      <Route
                        path="/admin/updateAirport"
                        element={<EditAirport />}
                      />
                      <Route
                        path="/admin/createBundle"
                        element={<CreateBundle />}
                      />
                      <Route
                        path="/admin/updateBundle"
                        element={<EditBundle />}
                      />
                      <Route
                        path="/admin/createBaggage"
                        element={<CreateBaggage />}
                      />
                      <Route
                        path="/admin/updateBaggage"
                        element={<EditBaggage />}
                      />
                      <Route
                        path="/admin/createMeal"
                        element={<CreateMeal />}
                      />
                      <Route path="/admin/updateMeal" element={<EditMeal />} />
                      <Route
                        path="/admin/craeteTransport"
                        element={<CreateTransport />}
                      />
                      <Route
                        path="/admin/updateTransport"
                        element={<EditTransport />}
                      />
                    </Route>

                    <Route path="/" element={<MainPage />} />
                    <Route
                      path="/SelectDepartureFlight"
                      element={<SelectDepartureFlight />}
                    />
                    <Route
                      path="/SelectReturnFlight"
                      element={<SelectReturnFlight />}
                    />
                    <Route path="/SelectBundle" element={<SelectBundle />} />
                    <Route path="/AddOns" element={<AddOns />} />
                    <Route
                      path="/InsertPassengerInfomation"
                      element={<InsertUserInformation />}
                    />

                    <Route
                      path="/ConfirmBooking"
                      element={<ConfirmBooking />}
                    />

                    <Route path="/CheckOut" element={<Checkout />} />
                    <Route path="/PaymentSucess" element={<PaymentSuccess />} />
                    <Route path="/ViewBookings" element={<ViewBookings />} />

                    <Route path="/UserLogin" element={<UserLogin />} />
                    <Route path="/UserRegister" element={<UserRegister />} />

                    <Route
                      path="/ForgetPassword"
                      element={<ForgetPassword />}
                    />

                    <Route path="/ResetPassword" element={<ResetPassword />} />

                    <Route element={<UserProtectedRoutes />}>
                      <Route path="/user/profile" element={<UserProfile />} />
                    </Route>
                  </Routes>
                </Router>
              </LoadScript>
            </ThemeProvider>
          </ColorModeContext.Provider>
        </SearchProvider>
      </PayPalScriptProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
