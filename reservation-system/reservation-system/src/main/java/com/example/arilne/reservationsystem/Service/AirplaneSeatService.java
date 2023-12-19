package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.AirplaneAccess;
import com.example.arilne.reservationsystem.Access.AirplaneSeatAccess;
import com.example.arilne.reservationsystem.Model.AirplaneSeat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AirplaneSeatService implements AirplaneSeatServiceInterface {
    @Autowired
    AirplaneSeatAccess airplaneSeatAccess;
    @Autowired
    AirplaneAccess airplaneAccess;

    @Override
    public List<String> getNotAvailableSeats(String airplaneId) {
        List<AirplaneSeat> notAvailableSeats = airplaneSeatAccess.getNotAvailableSeats(airplaneId);
        List<String> result = new ArrayList<>();
        for (AirplaneSeat seat : notAvailableSeats) {
            result.add(seat.getSeatRow() + seat.getSeatLetter());
        }
        return result;
    }

    @Override
    public List<AirplaneSeat> getAirplaneSeatsListById(String airplaneId) {
        return airplaneSeatAccess.getAirplaneSeatsListById(airplaneId);
    }

    @Override
    public boolean updateAvailability(String airplaneId, int seatRow, String seatLetter, int availability) {
        if (airplaneId == null || airplaneId.isEmpty() || airplaneAccess.getAirplaneById(airplaneId) == null) {
            throw new IllegalArgumentException("No such Airplane");
        }

        AirplaneSeat originAirplaneSeat = airplaneSeatAccess.getAirplaneSeatById(airplaneId, seatRow, seatLetter);
        if (originAirplaneSeat != null && originAirplaneSeat.getAvailability() != availability) {
            return airplaneSeatAccess.editAvailability(airplaneId, seatRow, seatLetter, availability) > 0;
        }
        return false;
    }

}
