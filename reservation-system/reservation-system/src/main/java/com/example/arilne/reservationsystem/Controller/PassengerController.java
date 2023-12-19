package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.Model.Passenger;
import com.example.arilne.reservationsystem.RequestBody.PassengerRequestBody;
import com.example.arilne.reservationsystem.Service.PassengerServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passengers")
public class PassengerController {

    @Autowired
    private PassengerServiceInterface passengerService;

    @GetMapping("/search-booking")
    public ResponseEntity<?> getPassengersByReferenceBookingId(@RequestParam String referenceBookingId, @RequestParam String LastName) {
        try {
            List<Passenger> passengers = passengerService.getPassengersByReferenceBookingId(referenceBookingId, LastName);

            if (passengers.isEmpty()) {
                return new ResponseEntity<>("No Booking found", HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>(passengers, HttpStatus.OK);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/checkIn")
    public ResponseEntity<?> getCheckinPassenger(@RequestParam String referenceBookingId, @RequestParam String LastName) {
        try {
            List<Passenger> passengers = passengerService.getPassengersByReferenceBookingId(referenceBookingId, LastName);

            if (passengers.isEmpty()) {
                return new ResponseEntity<>("No Booking found", HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>(passengers, HttpStatus.OK);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping
    public List<Passenger> getAllPassengers() {
        return passengerService.getAllPassengers();
    }

//    @PutMapping
//    public boolean updatePassenger(@RequestBody Passenger passenger) {
//        return passengerService.updatePassenger(passenger);
//    }

    @PostMapping("/create")
    public ResponseEntity<String> createPassenger(@RequestBody List<PassengerRequestBody> passenger) {
        try {

            Boolean isCreated = passengerService.createPassenger(passenger);
            if (isCreated) {
                return new ResponseEntity<>("Passenger created successfully", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Passenger created unsuccessfully", HttpStatus.BAD_REQUEST);

            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
