package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.Model.Airport;
import com.example.arilne.reservationsystem.Service.AirportServiceInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/airports")
@CrossOrigin
public class AirportController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AirportController.class);
    @Autowired
    AirportServiceInterface airportService;

    @GetMapping("/code_municipal")
    public ResponseEntity<Map<String, String>> getAllAirportsCode() {

        Map<String, String> airports = airportService.getAllAirportCode();

        if (airports != null && !airports.isEmpty()) {
            return ResponseEntity.ok(airports);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/user/code_name")
    public ResponseEntity<Map<String, String>> getAllAirportsName() {

        Map<String, String> airports = airportService.getAllAirportName();

        if (airports != null && !airports.isEmpty()) {
            return ResponseEntity.ok(airports);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/all")
    public List<Airport> getAllAiportList() {
        return airportService.getAllAirportList();
    }

    @GetMapping("/filter")
    public List<Airport> getFilteredAirport(
            @RequestParam(required = false) String location) {
        if (location != null && !location.isBlank()) {
            return airportService.getfilteredAirportList(location);
        } else {
            return airportService.getAllAirportList();
        }
    }

    @GetMapping("/{code}")
    public ResponseEntity<Airport> getAirportByCode(@PathVariable String code) {
        LOGGER.info("getAirportByCode called with code: {}", code);
        Airport airport = airportService.getAiportByCode(code);
        if (airport != null) {
            return ResponseEntity.ok(airport);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<String> createAirport(@RequestBody Airport airportRequest) {

        System.out.println(airportRequest);
        try {
            boolean isCreated = airportService.createAirport(airportRequest);

            if (isCreated) {
                return new ResponseEntity<>("Airport created successfully.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Unable to create airport.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    @PutMapping("/edit")
    public ResponseEntity<String> editAirport(@RequestBody Airport airportRequest) {

        try {
            boolean isEdited = airportService.editAirport(airportRequest);

            if (isEdited) {
                return new ResponseEntity<>("Airport edited successfully.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Unable to edit airport.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{code}")
    public ResponseEntity<String> deleteAirportByCode(@PathVariable String code) {
        try {
            boolean isDeleted = airportService.deleteAirport(code);

            if (isDeleted) {
                return new ResponseEntity<>("Airport deleted successfully.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Unable to delete airport.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


}
