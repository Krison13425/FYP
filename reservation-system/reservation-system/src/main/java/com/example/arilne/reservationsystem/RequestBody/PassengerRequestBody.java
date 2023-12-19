package com.example.arilne.reservationsystem.RequestBody;

import java.util.Date;

public class PassengerRequestBody {

    private String passengerKey;
    private String firstName;
    private String lastName;
    private Date birthDate;
    private String selectedTitle;
    private String nationality;
    private String departureBaggageId;
    private String returnBaggageId;
    private String departureMealId;
    private String returnMealId;
    private SeatRequestBody departureSeat;
    private SeatRequestBody returnSeat;
    private String emergencyId;
    private String bookingReferenceId;
    private String bookingId;

    public String getBookingReferenceId() {
        return bookingReferenceId;
    }

    public void setBookingReferenceId(String bookingReferenceId) {
        this.bookingReferenceId = bookingReferenceId;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public String getPassengerKey() {
        return passengerKey;
    }

    public void setPassengerKey(String passengerKey) {
        this.passengerKey = passengerKey;
    }

    public String getEmergencyId() {
        return emergencyId;
    }

    public void setEmergencyId(String emergencyId) {
        this.emergencyId = emergencyId;
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

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public String getSelectedTitle() {
        return selectedTitle;
    }

    public void setSelectedTitle(String selectedTitle) {
        this.selectedTitle = selectedTitle;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getDepartureBaggageId() {
        return departureBaggageId;
    }

    public void setDepartureBaggageId(String departureBaggageId) {
        this.departureBaggageId = departureBaggageId;
    }

    public String getReturnBaggageId() {
        return returnBaggageId;
    }

    public void setReturnBaggageId(String returnBaggageId) {
        this.returnBaggageId = returnBaggageId;
    }

    public String getDepartureMealId() {
        return departureMealId;
    }

    public void setDepartureMealId(String departureMealId) {
        this.departureMealId = departureMealId;
    }

    public String getReturnMealId() {
        return returnMealId;
    }

    public void setReturnMealId(String returnMealId) {
        this.returnMealId = returnMealId;
    }

    public SeatRequestBody getDepartureSeat() {
        return departureSeat;
    }

    public void setDepartureSeat(SeatRequestBody departureSeat) {
        this.departureSeat = departureSeat;
    }

    public SeatRequestBody getReturnSeat() {
        return returnSeat;
    }

    public void setReturnSeat(SeatRequestBody returnSeat) {
        this.returnSeat = returnSeat;
    }
}