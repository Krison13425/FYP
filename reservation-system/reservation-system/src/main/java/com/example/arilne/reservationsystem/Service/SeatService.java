package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.SeatAccess;
import com.example.arilne.reservationsystem.Model.Seat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SeatService implements SeatServiceInterface {

    @Autowired
    private SeatAccess seatAccess;

    public Seat getSeatById(String seatId) {
        return seatAccess.getSeatById(seatId);
    }

    @Override
    public List<String> getSeatListByFlight(String flightId) {
        List<Seat> seats = seatAccess.getAllSeatsByFlight(flightId);
        List<String> seatList = new ArrayList<>();

        for (Seat seat : seats) {
            int seatRow = seat.getSeatRow();
            String seatLetter = seat.getSeatLetter();
            String seatInfo = seatRow + seatLetter;
            seatList.add(seatInfo);
        }

        return seatList;
    }

    @Override
    public List<Seat> getAllSeat() {
        return seatAccess.getAllSeats();
    }


    public String createSeat(String flightId, int seatRow, String seatLetter) {

        Seat newSeat = new Seat();

        if (flightId == null || flightId.isEmpty()) {
            return null;
        }

        if (seatRow <= 0) {
            return null;
        }

        if (seatLetter == null || seatLetter.isEmpty()) {
            return null;
        }

        newSeat.setId(IDGenerator.generateUUID());
        newSeat.setFlightId(flightId);
        newSeat.setSeatStatus(0);
        newSeat.setSeatRow(seatRow);
        newSeat.setSeatLetter(seatLetter);

        int rowsAffected = seatAccess.Create(newSeat);

        if (rowsAffected > 0) {
            return newSeat.getId();
        }

        return null;
    }

    public boolean updateSeatStatus(String seatId, int seatStatus) {
        Seat seat = seatAccess.getSeatById(seatId);

        if (seat != null) {
            if (seat.getSeatStatus() != seatStatus) {
                int rowsAffected = seatAccess.updateSeatStatus(seatId, seatStatus);

                if (rowsAffected > 0) {
                    return true;
                }
            }
        }

        return false;
    }


}
