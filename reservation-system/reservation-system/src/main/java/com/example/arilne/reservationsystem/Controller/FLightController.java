package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.Model.Flight;
import com.example.arilne.reservationsystem.RequestBody.FlightRequestBody;
import com.example.arilne.reservationsystem.Service.FlightServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flight")
@CrossOrigin
public class FLightController {

    @Autowired
    FlightServiceInterface flightService;

    @GetMapping("/all")
    public List<Flight> getAllFlights() {
        return flightService.getAllFlights();
    }

    @PostMapping("/create")
    public ResponseEntity<String> createFlight(@RequestBody FlightRequestBody flightRequestBody) {

        try {
            boolean isCreated = flightService.createFlights(flightRequestBody);

            if (isCreated) {
                return new ResponseEntity<>("Flight created successfully.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Unable to create flight.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/edit")
    public ResponseEntity<String> editFlight(
            @RequestParam(required = false) String id,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String departureTime) {

        Time time = null;

        if (departureTime != null && !departureTime.isEmpty()) {
            try {
                SimpleDateFormat format = new SimpleDateFormat("HH:mm");
                Date date = format.parse(departureTime);
                time = new Time(date.getTime());
                System.out.println(time);
            } catch (ParseException e) {
                return new ResponseEntity<>("Invalid time format", HttpStatus.BAD_REQUEST);
            }
        }

        try {

            boolean isUpdated = flightService.updateFlights(id, status, time);

            if (isUpdated) {
                return new ResponseEntity<>("Flight status updated successfully.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Unable to update flight status.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable String id) {
        Flight flight = flightService.getFlightById(id);
        if (flight != null) {
            return ResponseEntity.ok(flight);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/filter")
    public List<Flight> getFilteredFlight(
            @RequestParam(required = false) String departureAirport,
            @RequestParam(required = false) String arrivalAirport,
            @RequestParam(required = false) Date departureDateStart,
            @RequestParam(required = false) Date departureDateEnd,
            @RequestParam(required = false) Date arrivalDateStart,
            @RequestParam(required = false) Date arrivalDateEnd,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status) {

        if (departureAirport != null || arrivalAirport != null || departureDateStart != null || departureDateEnd != null || arrivalDateStart != null || departureDateEnd != null || type != null || status != null) {
            return flightService.getFilteredFlights(departureAirport, arrivalAirport, departureDateStart, departureDateEnd, arrivalDateStart, arrivalDateEnd, type, status);
        } else {
            return flightService.getAllFlights();
        }
    }

    @GetMapping("/today")
    public List<Flight> getTodayFlight(@RequestParam(required = false) String status) {

        if (status != null) {
            return flightService.getTodayFlight(status);
        } else {
            return flightService.getAllFlights();
        }
    }

    @PutMapping("/{flightId}/price")
    public ResponseEntity<String> updateFlightPrice(
            @PathVariable String flightId,
            @RequestParam("economyPrice") double economyPrice,
            @RequestParam("businessPrice") double businessPrice) {

        boolean isEdtied = flightService.updateFlightsPrice(flightId, economyPrice, businessPrice);
        if (isEdtied) {
            return new ResponseEntity<>("Flight price updated successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Unable to update flight price.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteBaggageById(@PathVariable String id) {
        try {
            boolean isDeleted = flightService.deleteFlights(id);

            if (isDeleted) {
                return new ResponseEntity<>("Flight deleted successfully.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Unable to delete flight.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getFlightCountByStatus(@RequestParam String status, @RequestParam int isToday, @RequestParam int isDelayed) {
        int count = flightService.getFlightCountByStatus(status, isToday, isDelayed);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/monthly")
    public ResponseEntity<Map<String, Integer>> getFlightCountGroupedByMonth(@RequestParam int isDelayed) {
        Map<String, Integer> count = flightService.getFlightCountGroupedByMonth(isDelayed);
        return ResponseEntity.ok(count);
    }


    @GetMapping("/user/filter")
    public List<Flight> getUserFilteredFlight(
            @RequestParam(required = false) String departureAirport,
            @RequestParam(required = false) String arrivalAirport,
            @RequestParam(required = false) Date departureDate,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String flightClass) {

        if (departureAirport != null || status != null || departureDate != null || flightClass != null) {
            return flightService.getUserFilteredFlight(departureAirport, arrivalAirport, departureDate, status, flightClass);
        } else {
            return null;
        }
    }

    @GetMapping("/user/date_price_list")
    public Map<String, String> getFlightDatePriceList(
            @RequestParam(required = false) String departureAirport,
            @RequestParam(required = false) String arrivalAirport,
            @RequestParam(required = false) Date departureDateStart,
            @RequestParam(required = false) Date departureDateEnd,
            @RequestParam(required = false) String flightClass) {

        if (departureAirport != null || arrivalAirport != null || departureDateStart != null || departureDateEnd != null || flightClass != null) {
            return flightService.getFlightDatePriceList(departureAirport, arrivalAirport, departureDateStart, departureDateEnd, flightClass);
        } else {
            return null;
        }
    }
}
