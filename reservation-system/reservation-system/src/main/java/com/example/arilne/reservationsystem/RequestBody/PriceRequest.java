package com.example.arilne.reservationsystem.RequestBody;


import java.util.List;

public class PriceRequest {

    private List<FlightDetails> flightDetails;
    private List<PassengerDetails> passengerDetails;

    public List<FlightDetails> getFlightDetails() {
        return flightDetails;
    }

    public void setFlightDetails(List<FlightDetails> flightDetails) {
        this.flightDetails = flightDetails;
    }

    public List<PassengerDetails> getPassengerDetails() {
        return passengerDetails;
    }

    public void setPassengerDetails(List<PassengerDetails> passengerDetails) {
        this.passengerDetails = passengerDetails;
    }
}