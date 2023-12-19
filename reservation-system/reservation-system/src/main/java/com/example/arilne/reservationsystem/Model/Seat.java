package com.example.arilne.reservationsystem.Model;

public class Seat {
    private String id;
    private String flightId;
    private int seatRow;
    private String seatLetter;
    private int seatStatus;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFlightId() {
        return flightId;
    }

    public void setFlightId(String flightId) {
        this.flightId = flightId;
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

    public int getSeatStatus() {
        return seatStatus;
    }

    public void setSeatStatus(int seatStatus) {
        this.seatStatus = seatStatus;
    }

    @Override
    public String toString() {
        return "Seat{" +
                "id='" + id + '\'' +
                ", flightId='" + flightId + '\'' +
                ", seatRow=" + seatRow +
                ", seatLetter='" + seatLetter + '\'' +
                ", seatStatus=" + seatStatus +
                '}';
    }
}

