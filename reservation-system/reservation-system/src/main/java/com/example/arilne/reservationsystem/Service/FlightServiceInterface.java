package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Model.Flight;
import com.example.arilne.reservationsystem.RequestBody.FlightRequestBody;

import java.sql.Time;
import java.util.Date;
import java.util.List;
import java.util.Map;

public interface FlightServiceInterface {
    boolean createFlights(FlightRequestBody flightRequestBody);

    boolean updateFlights(String id, String flightStatus, Time departureTime);

    boolean updateFlightsPrice(String id, double economyPrice, double businessPrice);

    boolean deleteFlights(String id);

    List<Flight> getAllFlights();

    Flight getFlightById(String id);

    List<Flight> getFilteredFlights(String departureAirport, String arrivalAirport, Date departureDateStart, Date departureDateEnd, Date arrivalDateStart, Date arrivalDateEnd, String flightType, String flightStatus);

    List<Flight> getTodayFlight(String flightStatus);

    int getFlightCountByStatus(String status, int isToday, int isDelayed);

    Map<String, Integer> getFlightCountGroupedByMonth(int isDelayed);

    List<Flight> getUserFilteredFlight(String departureAirport, String arrivalAirport, Date departureDate, String status, String flightClass);

    Map<String, String> getFlightDatePriceList(String departureAirport, String arrivalAirport, Date departureDateStart, Date departureDateEnd, String flightClass);
}
