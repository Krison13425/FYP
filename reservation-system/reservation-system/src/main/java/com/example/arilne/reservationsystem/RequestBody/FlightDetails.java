package com.example.arilne.reservationsystem.RequestBody;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FlightDetails {

    @JsonProperty("id")
    private String flightId;
    @JsonProperty("class")
    private String flightClass;
    private String bundleId;

    public String getFlightId() {
        return flightId;
    }

    public void setFlightId(String flightId) {
        this.flightId = flightId;
    }

    public String getFlightClass() {
        return flightClass;
    }

    public void setFlightClass(String flightClass) {
        this.flightClass = flightClass;
    }

    public String getBundleId() {
        return bundleId;
    }

    public void setBundleId(String bundleId) {
        this.bundleId = bundleId;
    }
}
