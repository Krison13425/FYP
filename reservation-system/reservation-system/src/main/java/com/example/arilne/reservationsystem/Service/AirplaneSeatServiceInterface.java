package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Model.AirplaneSeat;

import java.util.List;

public interface AirplaneSeatServiceInterface {
    List<String> getNotAvailableSeats(String airplaneId);

    List<AirplaneSeat> getAirplaneSeatsListById(String airplaneId);

    boolean updateAvailability(String airplaneId, int seatRow, String seatLetter, int availability);

}
