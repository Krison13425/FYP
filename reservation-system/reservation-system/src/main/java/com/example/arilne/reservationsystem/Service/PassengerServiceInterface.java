package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Model.Passenger;
import com.example.arilne.reservationsystem.RequestBody.PassengerRequestBody;

import java.util.List;

public interface PassengerServiceInterface {

    List<Passenger> getAllPassengers();

//    boolean updatePassenger(Passenger passenger);

    List<Passenger> getPassengersByReferenceBookingId(String ReferenceBookingId, String LastName);

    Passenger getPassengersCheckIn(String ReferenceBookingId, String LastName);

    boolean createPassenger(List<PassengerRequestBody> passenger);
}