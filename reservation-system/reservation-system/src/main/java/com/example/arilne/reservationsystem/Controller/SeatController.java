package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.Model.Seat;
import com.example.arilne.reservationsystem.Service.SeatServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin
public class SeatController {

    @Autowired
    SeatServiceInterface seatService;

    @GetMapping("/flight/{flightId}")
    public List<String> getSeatListByFlight(@PathVariable String flightId) {
        return seatService.getSeatListByFlight(flightId);
    }


    @GetMapping("/all")
    public List<Seat> getSeatListByFlight() {
        return seatService.getAllSeat();
    }
}
