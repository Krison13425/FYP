package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Model.Seat;

import java.util.List;

public interface SeatServiceInterface {
    List<String> getSeatListByFlight(String flightId);

    List<Seat> getAllSeat();
}
