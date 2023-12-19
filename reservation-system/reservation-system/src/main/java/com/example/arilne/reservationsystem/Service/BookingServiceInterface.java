package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Model.Booking;
import com.example.arilne.reservationsystem.RequestBody.BookingRequestBody;

import java.util.List;
import java.util.Map;

public interface BookingServiceInterface {

    Map<String, String> createBooking(BookingRequestBody bookingRequestBody);

    Booking getBookingById(String id);

    List<Booking> getAllBookingsByUserId(String UserId);

    List<Booking> getAllBookings();

}
