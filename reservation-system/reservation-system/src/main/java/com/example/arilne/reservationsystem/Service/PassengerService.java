package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.*;
import com.example.arilne.reservationsystem.Model.*;
import com.example.arilne.reservationsystem.RequestBody.PassengerRequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PassengerService implements PassengerServiceInterface {

    @Autowired
    PassengerAccess passengerAccess;
    @Autowired
    BookingAccess bookingAccess;

    @Autowired
    FlightAccess flightAccess;
    @Autowired
    BundleAccess bundleAccess;
    @Autowired
    BaggageAccess baggageAccess;
    @Autowired
    SeatService seatService;

    @Override
    public List<Passenger> getPassengersByReferenceBookingId(String ReferenceBookingId, String LastName) {
        List<Passenger> passengers = passengerAccess.findByReferenceId(ReferenceBookingId);

        boolean matchExists = passengers.stream()
                .anyMatch(passenger -> passenger.getLastName().equals(LastName));

        if (matchExists) {
            return passengers;
        }

        return new ArrayList<>();
    }

    @Override
    public Passenger getPassengersCheckIn(String ReferenceBookingId, String LastName) {
        List<Passenger> passengers = passengerAccess.findByReferenceId(ReferenceBookingId);

        boolean isAnyPassengerNonAdult = passengers.stream()
                .anyMatch(passenger -> passenger.getType() != 0);

        if (isAnyPassengerNonAdult) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Online check-in is only available for adult passengers."
            );
        }

        Optional<Passenger> matchingPassenger = passengers.stream()
                .filter(passenger -> passenger.getLastName().equals(LastName))
                .findFirst();

        if (!matchingPassenger.isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "No matching passenger found."
            );
        }

        Flight flight = flightAccess.getFlightById(matchingPassenger.get().getFlightId());
        Date departureDate = flight.getDeparture_time();

        LocalDateTime departureTime = departureDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        if (departureTime.isAfter(LocalDateTime.now()) && departureTime.isBefore(LocalDateTime.now().plusDays(1))) {
            return matchingPassenger.get();
        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Online check-in is only available within 24 hours of departure."
            );
        }
    }


    @Override
    public List<Passenger> getAllPassengers() {
        return passengerAccess.findAll();
    }


    @Override
    public boolean createPassenger(List<PassengerRequestBody> passenger) {

        try {


            for (PassengerRequestBody passengerRequestBody : passenger) {
                Booking booking = bookingAccess.getBookingById(passengerRequestBody.getBookingId());

                if (booking.getDepartureFlightId() != null) {
                    Passenger departurePassenger = createPassengerFromRequestBody(passengerRequestBody, "departure");
                    if (departurePassenger.getType() != 2) {
                        String departureBundleId = bookingAccess.getBookingById(passengerRequestBody.getBookingId()).getDepartureBundleId();
                        int departureBaggageWeight = calculateBaggageWeight(departureBundleId, passengerRequestBody.getDepartureBaggageId());
                        departurePassenger.setBaggage(departureBaggageWeight);

                        String departureSeatId = seatService.createSeat(
                                booking.getDepartureFlightId(),
                                passengerRequestBody.getDepartureSeat().getModifiedRowIndex(),
                                passengerRequestBody.getDepartureSeat().getSeatAlphabet()
                        );
                        departurePassenger.setSeatId(departureSeatId);
                    } else {
                        departurePassenger.setBaggage(0);
                        departurePassenger.setSeatId(null);
                    }
                    departurePassenger.setFlightId(booking.getDepartureFlightId());
                    passengerAccess.insert(departurePassenger);
                }


                if (booking.getReturnFlightId() != null) {
                    Passenger returnPassenger = createPassengerFromRequestBody(passengerRequestBody, "return");
                    if (returnPassenger.getType() != 2) {
                        String returnBundleId = bookingAccess.getBookingById(passengerRequestBody.getBookingId()).getReturnBundleId();
                        int returnBaggageWeight = calculateBaggageWeight(returnBundleId, passengerRequestBody.getReturnBaggageId());
                        returnPassenger.setBaggage(returnBaggageWeight);

                        String returnSeatId = seatService.createSeat(
                                booking.getReturnFlightId(),
                                passengerRequestBody.getReturnSeat().getModifiedRowIndex(),
                                passengerRequestBody.getReturnSeat().getSeatAlphabet()
                        );
                        returnPassenger.setSeatId(returnSeatId);
                    } else {
                        returnPassenger.setBaggage(0);
                        returnPassenger.setSeatId(null);
                    }
                    returnPassenger.setFlightId(booking.getReturnFlightId());
                    passengerAccess.insert(returnPassenger);
                }

            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private int calculateBaggageWeight(String bundleId, String baggageId) {
        Bundle bundle = bundleAccess.getBundleById(bundleId);
        int kg = 0;
        if (bundle.getCheckinBaggage20() == 1) {
            kg = 20;
        } else if (bundle.getCheckinBaggage30() == 1) {
            kg = 30;
        } else if (bundle.getCheckinBaggage40() == 1) {
            kg = 40;
        }
        Baggage baggage = baggageAccess.getBaggageById(baggageId);
        kg += baggage.getKg();
        return kg;
    }

    private Passenger createPassengerFromRequestBody(PassengerRequestBody requestBody, String journeyType) {
        Passenger passenger = new Passenger();

        passenger.setId(IDGenerator.generateUUID());
        passenger.setBookingId(requestBody.getBookingId());
        passenger.setBookingReferenceId(requestBody.getBookingReferenceId());
        passenger.setFirstName(requestBody.getFirstName());
        passenger.setLastName(requestBody.getLastName());
        passenger.setBirthDate(requestBody.getBirthDate());
        passenger.setEmergencyId(requestBody.getEmergencyId());
        passenger.setNationality(requestBody.getNationality());
        passenger.setSelectedTitle(requestBody.getSelectedTitle());
        if (requestBody.getPassengerKey().startsWith("Adult")) {
            passenger.setType(0);
        } else if (requestBody.getPassengerKey().startsWith("Child")) {
            passenger.setType(1);
        } else {
            passenger.setType(2);
        }

        if (journeyType.equals("departure")) {
            passenger.setMealId(requestBody.getDepartureMealId());
        } else if (journeyType.equals("return")) {
            passenger.setMealId(requestBody.getReturnMealId());
        }

        return passenger;
    }

}
