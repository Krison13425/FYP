package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.Model.AirplaneSeat;
import com.example.arilne.reservationsystem.Service.AirplaneSeatServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airplaneSeats")
@CrossOrigin
public class AirplaneSeatController {

    @Autowired
    AirplaneSeatServiceInterface airplaneSeatService;

    @GetMapping("/notAvailable/{airplaneId}")
    public ResponseEntity<List<String>> getNotAvailableSeats(@PathVariable String airplaneId) {
        return ResponseEntity.ok(airplaneSeatService.getNotAvailableSeats(airplaneId));
    }

    @GetMapping("/{airplaneId}")
    public ResponseEntity<List<AirplaneSeat>> getAirplaneSeatsListById(@PathVariable String airplaneId) {
        return ResponseEntity.ok(airplaneSeatService.getAirplaneSeatsListById(airplaneId));
    }

    @PutMapping("/{airplaneId}/{seatRow}/{seatLetter}")
    public ResponseEntity<Boolean> updateAvailability(
            @PathVariable String airplaneId,
            @PathVariable int seatRow,
            @PathVariable String seatLetter,
            @RequestParam int availability) {
        boolean isUpdated = airplaneSeatService.updateAvailability(airplaneId, seatRow, seatLetter, availability);
        if (isUpdated) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

}
