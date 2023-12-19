package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.Model.Airplane;
import com.example.arilne.reservationsystem.RequestBody.AirplaneRequestBody;
import com.example.arilne.reservationsystem.Service.AirplaneServiceInterface;
import com.example.arilne.reservationsystem.Service.AirportServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/airplane")
@CrossOrigin
public class AirplaneController {
    @Autowired
    AirplaneServiceInterface airplaneService;

    @Autowired
    AirportServiceInterface airportService;

    @GetMapping("/all")
    public List<Airplane> getAllAirplanes() {
        return airplaneService.getAllAirplanes();
    }

    @PostMapping("/create")
    public ResponseEntity<String> createPlane(@RequestBody AirplaneRequestBody airplaneRequestBody) {

        try {
            boolean isCreated = airplaneService.createAirplane(airplaneRequestBody);

            if (isCreated) {
                return new ResponseEntity<>("Plane created successfully.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Unable to create plane.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Airplane> getAirplaneById(@PathVariable String id) {
        Airplane airplane = airplaneService.getAirplaneById(id);
        if (airplane != null) {
            return ResponseEntity.ok(airplane);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/edit")
    public ResponseEntity<String> createPlane(@RequestBody Airplane airplane) {

        try {
            boolean isEdited = airplaneService.editAirplane(airplane);

            if (isEdited) {
                return new ResponseEntity<>("Plane edited successfully.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Unable to edit plane.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAirplaneById(@PathVariable String id) {
        try {
            boolean isDeleted = airplaneService.deleteAirplane(id);

            if (isDeleted) {
                return new ResponseEntity<>("Plane deleted successfully.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Unable to delete plane.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/filter")
    public List<Airplane> getFilteredAirplanes(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String location) {
        if ((status != null && !status.isBlank()) || (location != null && !location.isBlank())) {
            return airplaneService.getfilteredAirplaneList(status, location);
        } else {
            return airplaneService.getAllAirplanes();
        }
    }

    @GetMapping("/airport")
    public ResponseEntity<Map<String, String>> getAirplanesByAirport(
            @RequestParam(required = false) String departureAirport,
            @RequestParam(required = false) String arrivalAirport) {

        Map<String, String> response = new HashMap<>();
        if ((departureAirport == null || departureAirport.isBlank()) && (arrivalAirport == null || arrivalAirport.isBlank())) {
            response.put("message", "Either departureAirport or arrivalAirport must be provided.");
            return ResponseEntity.badRequest().body(response);
        }

        boolean isAirportExisted = airportService.validateAirport(departureAirport, arrivalAirport);
        if (!isAirportExisted) {
            response.put("message", "One of the airports does not exist.");
            return ResponseEntity.badRequest().body(response);
        }

        String country_code = airportService.getAirportCountryCode(departureAirport, arrivalAirport);
        Map<String, String> airplanes = airplaneService.getAirplaneByCountryCode(country_code);

        if (airplanes.isEmpty()) {
            response.put("message", "No airplanes found for the specified airports.");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
        }

        return ResponseEntity.ok(airplanes);
    }


}
