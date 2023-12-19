package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.Model.Booking;
import com.example.arilne.reservationsystem.RequestBody.BookingRequestBody;
import com.example.arilne.reservationsystem.Service.BookingServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingServiceInterface bookingService;

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequestBody bookingRequestBody) {
        try {
            Map<String, String> bookingIds = bookingService.createBooking(bookingRequestBody);
            if (bookingIds != null) {
                Map<String, Object> successResponse = new HashMap<>();
                successResponse.put("data", bookingIds);
                successResponse.put("message", "Booking successfully created.");
                return ResponseEntity.status(HttpStatus.CREATED).body(successResponse);
            }
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Booking creation failed due to internal error.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request");
    }


    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable("id") String id) {
        return bookingService.getBookingById(id);
    }

    @GetMapping("/all")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/all/user/{id}")
    public List<Booking> getAllBookingsByUserId(@PathVariable("id") String UserId) {
        return bookingService.getAllBookingsByUserId(UserId);
    }

}

