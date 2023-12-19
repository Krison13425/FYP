import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createBooking,
  createEmergencyContact,
  createPassenger,
  createTransaction,
  sendEmail,
} from "../../api";
import checkSessionAndRedirect from "../SessionCheck";

function PaymentSuccess() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleDialogClose = () => {
    setDialogOpen(false);
    sessionStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    checkSessionAndRedirect(navigate, "passenger", "/");
    if (
      sessionStorage.getItem("passenger") &&
      sessionStorage.getItem("departureFlight")
    ) {
      let isCancelled = false;

      const id = localStorage.getItem("id");

      let userId;
      if (id !== undefined) {
        userId = id;
      } else {
        userId = null;
      }

      const fetchData = async () => {
        const paymentdata = sessionStorage.getItem("transactionId");
        const totalprice = sessionStorage.getItem("totalprice");

        const transactiondata = {
          transactionId: paymentdata,
          rootAmount: parseFloat(totalprice),
        };

        let transactionId;
        if (!isCancelled) {
          try {
            const response = await createTransaction(transactiondata);
            transactionId = response;
          } catch (error) {
            console.log(error);
          }
        }

        const contactData = JSON.parse(sessionStorage.getItem("contactInfo"));
        let passengerData = JSON.parse(sessionStorage.getItem("passenger"));

        let firstName;
        let title;
        let lastName;
        if ("Adult1" in passengerData) {
          title = passengerData["Adult1"]?.selectedTitle;
          firstName = passengerData["Adult1"]?.firstName;
          lastName = passengerData["Adult1"]?.lastName;
        }

        let transport = JSON.parse(sessionStorage.getItem("transport"));

        let bookingdata = {
          departureFlight: JSON.parse(
            sessionStorage.getItem("departureFlight")
          ),
          returnFlight: JSON.parse(sessionStorage.getItem("returnFlight")),
          transactionId: transactionId,
          email: contactData?.confirmEmail,
          phoneCode: contactData?.phoneCode,
          phoneNumber: contactData?.phoneNumber,
          title: title,
          firstName: firstName,
          lastName: lastName,
          userId: userId,
        };

        if (transport !== null) {
          bookingdata.transportId = transport.transportId;
          bookingdata.address = transport.no + ", " + transport.address;
        }

        if (transport?.isTransportReturnChecked !== null) {
          bookingdata.returnTransport = 1;
        } else {
          bookingdata.returnTransport = 0;
        }

        const emergency = JSON.parse(sessionStorage.getItem("emergencyInfo"));

        const emergencydata = {
          emergencyName: emergency.emergencyName,
          emergencyPhoneCode: emergency.emergencyPhoneCode,
          emergencyPhoneNumber: emergency.emergencyPhoneNumber,
        };

        let emergencyId;
        if (!isCancelled) {
          try {
            const response = await createEmergencyContact(emergencydata);
            emergencyId = response;
          } catch (error) {
            console.log(error);
          }
        }

        let bookingid;
        let bookingreferenceid;
        if (!isCancelled) {
          try {
            const response = await createBooking(bookingdata);
            bookingid = response?.data?.bookingId;
            bookingreferenceid = response?.data?.referenceId;
          } catch (error) {
            console.error(error);
          }
        }

        if (
          !isCancelled &&
          emergencyId !== null &&
          bookingid !== null &&
          bookingreferenceid !== null
        ) {
          let passengerData = JSON.parse(sessionStorage.getItem("passenger"));

          let passengerKeys = Object.keys(passengerData);

          console.log(passengerKeys);
          let newList = [];

          passengerKeys.forEach((key) => {
            newList.push({
              ...passengerData[key],
              bookingId: bookingid,
              emergencyId: emergencyId,
              bookingReferenceId: bookingreferenceid,
              passengerKey: key,
            });
          });

          try {
            const response = await createPassenger(newList);
            console.log(response);
            console.log(response.status);
            if (response.status === 200 || response.status === 201) {
              try {
                const emailResponse = await sendEmail(bookingid);
                console.log(emailResponse);
                setDialogOpen(true);
              } catch (error) {
                console.error(error);
              }
            } else {
              console.error("Error in passenger creation response:", response);
            }
          } catch (error) {
            console.error(error);
          }
        }
      };
      fetchData();
      setOpen(true);

      return () => {
        isCancelled = true;
      };
    }
  }, []);

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <Typography variant="h3">
          Please wait, payment is processing...
        </Typography>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: "40px",
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h1">Payment Successful!</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h3">
              {" "}
              Your payment has been processed successfully and your booking is
              confirmed.
            </Typography>
            <Typography variant="h3">
              {" "}
              An email confirmation has been sent to your email.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleDialogClose}
            color="primary"
            variant="contained"
            size="large"
            sx={{ borderRadius: "30px", fontSize: "1rem" }}
          >
            Go to main page
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PaymentSuccess;
