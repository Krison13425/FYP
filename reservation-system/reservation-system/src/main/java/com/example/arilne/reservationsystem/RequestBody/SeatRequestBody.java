package com.example.arilne.reservationsystem.RequestBody;

public class SeatRequestBody {
    private int modifiedRowIndex;
    private String seatAlphabet;

    public int getModifiedRowIndex() {
        return modifiedRowIndex;
    }

    public void setModifiedRowIndex(int modifiedRowIndex) {
        this.modifiedRowIndex = modifiedRowIndex;
    }

    public String getSeatAlphabet() {
        return seatAlphabet;
    }

    public void setSeatAlphabet(String seatAlphabet) {
        this.seatAlphabet = seatAlphabet;
    }
}