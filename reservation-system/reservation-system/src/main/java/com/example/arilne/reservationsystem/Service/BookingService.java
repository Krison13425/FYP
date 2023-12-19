package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.BookingAccess;
import com.example.arilne.reservationsystem.Access.BundleAccess;
import com.example.arilne.reservationsystem.Access.CountryAccess;
import com.example.arilne.reservationsystem.Access.FlightAccess;
import com.example.arilne.reservationsystem.Model.Booking;
import com.example.arilne.reservationsystem.Model.Bundle;
import com.example.arilne.reservationsystem.Model.Flight;
import com.example.arilne.reservationsystem.RequestBody.BookingRequestBody;
import com.example.arilne.reservationsystem.RequestBody.FlightDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BookingService implements BookingServiceInterface {

    @Autowired
    FlightAccess flightAccess;
    @Autowired
    BundleAccess bundleAccess;
    @Autowired
    BookingAccess bookingAccess;
    @Autowired
    CountryAccess countryAccess;


    public String generateUniqueReferenceId() {
        String referenceId;
        do {
            referenceId = IDGenerator.generateBookingID();
        } while (bookingAccess.isReferenceIdExists(referenceId));
        return referenceId;
    }

    @Override
    public Map<String, String> createBooking(BookingRequestBody bookingRequestBody) {

        Flight exsitingdepflight = flightAccess.getFlightById(bookingRequestBody.getDepartureFlight().getFlightId());
        if (exsitingdepflight == null) {
            throw new IllegalArgumentException("No Depart Such Flight");
        }

        Bundle esixtingdepBundle = bundleAccess.getBundleById(bookingRequestBody.getDepartureFlight().getBundleId());

        if (esixtingdepBundle == null) {
            throw new IllegalArgumentException("No Such Depart Bundle");
        }


        if (bookingRequestBody.getReturnFlight() != null) {
            Flight exsitingretflight = flightAccess.getFlightById(bookingRequestBody.getReturnFlight().getFlightId());

            if (exsitingretflight == null) {
                throw new IllegalArgumentException("No Return Such Flight");
            }

            Bundle esixtingRetBundle = bundleAccess.getBundleById(bookingRequestBody.getReturnFlight().getBundleId());

            if (esixtingRetBundle == null) {
                throw new IllegalArgumentException("No Such Return Bundle");
            }
        }


        Booking newBooking = new Booking();

        newBooking.setId(IDGenerator.generateUUID());
        newBooking.setReferenceId(generateUniqueReferenceId());

        newBooking.setDepartureFlightId(bookingRequestBody.getDepartureFlight().getFlightId());
        newBooking.setDepartureBundleId(bookingRequestBody.getDepartureFlight().getBundleId());
        newBooking.setTitle(bookingRequestBody.getTitle());
        newBooking.setLastName(bookingRequestBody.getLastName());
        newBooking.setFirstName(bookingRequestBody.getFirstName());


        if (bookingRequestBody.getDepartureFlight().getFlightClass() == "Economy") {
            newBooking.setDepartureFlightClass(0);

        } else {
            newBooking.setDepartureFlightClass(1);
        }


        if (bookingRequestBody.getTransportId() != null && bookingRequestBody.getAddress() != null) {
            newBooking.setTransportId(bookingRequestBody.getTransportId());
            newBooking.setAddress(bookingRequestBody.getAddress());
        } else {
            newBooking.setTransportId(null);
            newBooking.setAddress(null);
        }


        if (bookingRequestBody.getReturnFlight() != null) {
            newBooking.setReturnFlightId(bookingRequestBody.getReturnFlight().getFlightId());
            newBooking.setReturnBundleId(bookingRequestBody.getReturnFlight().getBundleId());

            if (bookingRequestBody.getReturnFlight().getFlightClass() == "Economy") {
                newBooking.setReturnFlightClass(0);
            } else {
                newBooking.setReturnFlightClass(1);
            }

            if (bookingRequestBody.getReturnTransport() != 0) {
                newBooking.setIsReturnTransport(1);
            } else {
                newBooking.setIsReturnTransport(0);
            }
        } else {
            newBooking.setReturnFlightId(null);
            newBooking.setReturnBundleId(null);
            newBooking.setReturnFlightClass(0);
            newBooking.setIsReturnTransport(0);
        }
        newBooking.setEmail(bookingRequestBody.getEmail());


        String phoneCode = null;
        if (bookingRequestBody.getPhoneCode() != null) {
            phoneCode = String.valueOf(countryAccess.getPhoneCountryByCode(bookingRequestBody.getPhoneCode()));
        }
        newBooking.setPhoneCode(phoneCode);
        newBooking.setPhoneNumber(bookingRequestBody.getPhoneNumber());
        newBooking.setTransactionId(bookingRequestBody.getTransactionId());

        if (bookingRequestBody.getUserId() != null) {
            newBooking.setUserId(bookingRequestBody.getUserId());
        } else {
            newBooking.setUserId(IDGenerator.generateUUID());
        }

        int rowsAffected = bookingAccess.createBooking(newBooking);

        if (rowsAffected > 0) {
            Map<String, String> result = new HashMap<>();
            result.put("bookingId", newBooking.getId());
            result.put("referenceId", newBooking.getReferenceId());
            return result;
        }

        return null;
    }


    @Override
    public Booking getBookingById(String id) {
        return bookingAccess.getBookingById(id);
    }


    @Override
    public List<Booking> getAllBookings() {
        return bookingAccess.getAllBookings();
    }

    @Override
    public List<Booking> getAllBookingsByUserId(String UserId) {
        return bookingAccess.getAllBookingsBuUserId(UserId);
    }

    private void validateFlightDetails(FlightDetails flightDetails, String flightType) {

        if (StringUtils.isEmpty(flightDetails.getFlightId())) {
            throw new IllegalArgumentException(flightType + " ID must not be blank");
        }
        if (StringUtils.isEmpty(flightDetails.getFlightClass())) {
            throw new IllegalArgumentException(flightType + " Class must not be blank");
        }
        if (StringUtils.isEmpty(flightDetails.getBundleId())) {
            throw new IllegalArgumentException(flightType + " Bundle ID must not be blank");
        }
    }
}
