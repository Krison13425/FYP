package com.example.arilne.reservationsystem.Model;

import java.util.Date;

public class Booking {

    private String id;
    private String referenceId;
    private String transactionId;
    private String departureFlightId;
    private String departureBundleId;
    private int departureFlightClass;
    private String returnFlightId;
    private int returnFlightClass;
    private String returnBundleId;
    private String transportId;
    private String address;
    private String email;
    private String phoneCode;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private String title;
    private String userId;
    private Date createdDate;
    private int isReturnTransport;

    public int getIsReturnTransport() {
        return isReturnTransport;
    }

    public void setIsReturnTransport(int isReturnTransport) {
        this.isReturnTransport = isReturnTransport;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public int getDepartureFlightClass() {
        return departureFlightClass;
    }

    public void setDepartureFlightClass(int departureFlightClass) {
        this.departureFlightClass = departureFlightClass;
    }

    public int getReturnFlightClass() {
        return returnFlightClass;
    }

    public void setReturnFlightClass(int returnFlightClass) {
        this.returnFlightClass = returnFlightClass;
    }

    public String getTransportId() {
        return transportId;
    }

    public void setTransportId(String transportId) {
        this.transportId = transportId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getDepartureFlightId() {
        return departureFlightId;
    }

    public void setDepartureFlightId(String departureFlightId) {
        this.departureFlightId = departureFlightId;
    }

    public String getDepartureBundleId() {
        return departureBundleId;
    }

    public void setDepartureBundleId(String departureBundleId) {
        this.departureBundleId = departureBundleId;
    }

    public String getReturnFlightId() {
        return returnFlightId;
    }

    public void setReturnFlightId(String returnFlightId) {
        this.returnFlightId = returnFlightId;
    }

    public String getReturnBundleId() {
        return returnBundleId;
    }

    public void setReturnBundleId(String returnBundleId) {
        this.returnBundleId = returnBundleId;
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
}
