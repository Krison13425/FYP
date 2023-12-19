package com.example.arilne.reservationsystem.RequestBody;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BookingRequestBody {
    @JsonProperty("departureFlight")
    private FlightDetails departureFlight;

    @JsonProperty("returnFlight")
    private FlightDetails returnFlight;
    private String email;
    private String phoneCode;
    private String phoneNumber;
    private String transactionId;
    private String userId;
    private String firstName;
    private String lastName;
    private String title;
    private String address;
    private String transportId;
    private int returnTransport;

    public int getReturnTransport() {
        return returnTransport;
    }

    public void setReturnTransport(int returnTransport) {
        this.returnTransport = returnTransport;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTransportId() {
        return transportId;
    }

    public void setTransportId(String transportId) {
        this.transportId = transportId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneCode() {
        return phoneCode;
    }

    public void setPhoneCode(String phoneCode) {
        this.phoneCode = phoneCode;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public FlightDetails getDepartureFlight() {
        return departureFlight;
    }

    public void setDepartureFlight(FlightDetails departureFlight) {
        this.departureFlight = departureFlight;
    }

    public FlightDetails getReturnFlight() {
        if (this.returnFlight == null) {

            return null;
        }
        return returnFlight;
    }

    public void setReturnFlight(FlightDetails returnFlight) {
        this.returnFlight = returnFlight;
    }


}
