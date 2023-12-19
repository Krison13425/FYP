package com.example.arilne.reservationsystem.Model;

public class AirplaneSeat {
    private String airplaneId;
    private int seatRow;
    private String seatLetter;
    private int availability;

    public String getAirplaneId() {
        return airplaneId;
    }

    public void setAirplaneId(String airplaneId) {
        this.airplaneId = airplaneId;
    }

    public int getSeatRow() {
        return seatRow;
    }

    public void setSeatRow(int seatRow) {
        this.seatRow = seatRow;
    }

    public String getSeatLetter() {
        return seatLetter;
    }

    public void setSeatLetter(String seatLetter) {
        this.seatLetter = seatLetter;
    }

    public int getAvailability() {
        return availability;
    }

    public void setAvailability(int availability) {
        this.availability = availability;
    }

    @Override
    public String toString() {
        return "AirplaneSeat{" +
                "airplaneId='" + airplaneId + '\'' +
                ", seatRow=" + seatRow +
                ", seatLetter='" + seatLetter + '\'' +
                ", availability=" + availability +
                '}';
    }
}
