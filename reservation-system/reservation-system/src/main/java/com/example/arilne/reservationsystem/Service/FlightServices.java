package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.*;
import com.example.arilne.reservationsystem.Model.Airplane;
import com.example.arilne.reservationsystem.Model.Airport;
import com.example.arilne.reservationsystem.Model.Booking;
import com.example.arilne.reservationsystem.Model.Flight;
import com.example.arilne.reservationsystem.RequestBody.FlightRequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

import static java.lang.Math.*;

@Service
public class FlightServices implements FlightServiceInterface {

    private static final String ECONOMY = "Economy";
    private static final String BUSINESS = "Business";

    @Autowired
    private SmsService smsService;

    @Autowired
    private EmailService emailService;
    @Autowired
    private PassengerAccess passengerAccess;
    @Autowired
    private BookingAccess bookingAccess;
    @Autowired
    private FlightAccess flightAccess;
    @Autowired
    private AirplaneAccess airplaneAccess;
    @Autowired
    private AirportAccess airportAccess;

    private static double distanceInMetersBetween(Airport depatureAirport, Airport arrivalAirport) {

        double rad_per_deg = PI / 180.0;
        double rkm = 6371.0;
        double rm = rkm * 1000.0;

        double dlat_rad = (arrivalAirport.getLatitude() - depatureAirport.getLatitude()) * rad_per_deg; // Delta, converted to rad
        double dlon_rad = (arrivalAirport.getLongitude() - depatureAirport.getLongitude()) * rad_per_deg;

        double lat1_rad = depatureAirport.getLatitude() * rad_per_deg;
        double lat2_rad = arrivalAirport.getLatitude() * rad_per_deg;

        double sinDlat = sin(dlat_rad / 2);
        double sinDlon = sin(dlon_rad / 2);

        double a = sinDlat * sinDlat + cos(lat1_rad) * cos(lat2_rad) * sinDlon * sinDlon;
        double c = 2.0 * atan2(sqrt(a), sqrt(1 - a));
        return rm * c;
    }

    private static double distanceInKmBetween(Airport depatureAirport, Airport arrivalAirport) {
        return distanceInMetersBetween(depatureAirport, arrivalAirport) / 1000.0;
    }

    @Override
    public boolean createFlights(FlightRequestBody flightRequestBody) {

        validateFlightRequestBody(flightRequestBody);

        Flight newFlight = new Flight();

        newFlight.setId(IDGenerator.generateUUID());
        newFlight.setAirline_id(flightRequestBody.getAirline_id());
        newFlight.setAirplane_id(flightRequestBody.getAirplane_id());
        newFlight.setDeparture_airport(flightRequestBody.getDeparture_airport());
        newFlight.setArrival_airport(flightRequestBody.getArrival_airport());
        newFlight.setFlight_status(0);
        newFlight.setEconomy_price(flightRequestBody.getEconomy_price());
        newFlight.setBusiness_price(flightRequestBody.getBusiness_price());
        newFlight.setIs_full(0);

        String departureAirportCountry = airportAccess.getAirportCountryByCode(flightRequestBody.getDeparture_airport());
        String arrivalAirportCountry = airportAccess.getAirportCountryByCode(flightRequestBody.getArrival_airport());

        if (departureAirportCountry.equals("MY") && arrivalAirportCountry.equals("MY")) {
            newFlight.setFlight_type(0);
        } else {
            newFlight.setFlight_type(1);
        }

        Date departureDateTime = getDateTime(flightRequestBody.getDeparture_date(), flightRequestBody.getDeparture_time());

        if (departureDateTime != null) {
            Airport departureAirport = airportAccess.getAirportDetails(newFlight.getDeparture_airport());
            Airport arrivalAirport = airportAccess.getAirportDetails(newFlight.getArrival_airport());
            Airplane airplane = airplaneAccess.getAirplaneById(newFlight.getAirplane_id());

            double flightDistance = distanceInKmBetween(departureAirport, arrivalAirport);
            double airplaneSpeed = airplane.getSpeed();

            double duration = flightDistance / (double) airplaneSpeed;

            newFlight.setDeparture_time(departureDateTime);

            duration += 1;

            Date arrivalTime = calculateArrivalTime(newFlight.getDeparture_time(), duration);
            newFlight.setArrival_time(arrivalTime);


            int hours = (int) duration;
            int minutes = (int) ((duration - hours) * 60);
            LocalTime localTime = java.time.LocalTime.of(hours, minutes);
            Time sqlTime = java.sql.Time.valueOf(localTime);

            newFlight.setDuration_time(sqlTime);

            if (airplane.getType() == 0) {
                newFlight.setEconomy_seats(135);
                newFlight.setBusiness_seats(8);
            } else {
                newFlight.setEconomy_seats(260);
                newFlight.setBusiness_seats(30);
            }
        }

        if (checkSimilarFlights(newFlight)) {
            throw new IllegalArgumentException("Similar flight already exists");
        }

        int rowsAffected = flightAccess.createFlight(newFlight);

        if (rowsAffected > 0) {
            Flight returnFlight = createReturnFlight(newFlight);
            int rowsAffectedReturn = flightAccess.createFlight(returnFlight);

            if (rowsAffectedReturn > 0) {
                return true;
            } else {
                throw new IllegalArgumentException("Return flight is not created");
            }
        }

        return false;

    }

    public boolean checkSimilarFlights(Flight flight) {
        List<Flight> existingFlights = flightAccess.getAllFlights();

        for (Flight existingFlight : existingFlights) {
            if (existingFlight.getAirline_id().equals(flight.getAirline_id()) &&
                    existingFlight.getAirplane_id().equals(flight.getAirplane_id()) &&
                    existingFlight.getDeparture_airport().equals(flight.getDeparture_airport()) &&
                    existingFlight.getArrival_airport().equals(flight.getArrival_airport())) {

                if (flight.getDeparture_time().after(existingFlight.getDeparture_time()) &&
                        flight.getDeparture_time().before(existingFlight.getArrival_time())) {
                    return true;
                }

                if (flight.getArrival_time().after(existingFlight.getDeparture_time()) &&
                        flight.getArrival_time().before(existingFlight.getArrival_time())) {
                    return true;
                }
            }
        }

        return false;
    }

    @Override
    public boolean updateFlights(String flightId, String flightStatus, Time departureTime) {

        Flight originFlight = flightAccess.getFlightById(flightId);

        if (originFlight == null) {
            throw new IllegalArgumentException("No such Flight.");
        }

        if (flightStatus == null || flightStatus.isEmpty()) {
            throw new IllegalArgumentException("Flight status is missing.");
        }

        if (Integer.parseInt(flightStatus) != 4) {

            int rowsAffected = flightAccess.updateFlight(originFlight, flightStatus, null, null);

            if (rowsAffected > 0) {
                return true;
            }
        } else {

            Date originDepartDateTime = originFlight.getDeparture_time();

            Date originDepartDate = extractDate(originDepartDateTime);

            Date newDepartDateTime = getDateTime(originDepartDate, departureTime);

            Airport departureAirport = airportAccess.getAirportDetails(originFlight.getDeparture_airport());
            Airport arrivalAirport = airportAccess.getAirportDetails(originFlight.getArrival_airport());
            Airplane airplane = airplaneAccess.getAirplaneById(originFlight.getAirplane_id());

            double flightDistance = distanceInKmBetween(departureAirport, arrivalAirport);
            double airplaneSpeed = airplane.getSpeed();

            double duration = flightDistance / (double) airplaneSpeed;

            duration += 1;

            Date newArrivalTime = calculateArrivalTime(newDepartDateTime, duration);

            if (originDepartDateTime != newDepartDateTime && newDepartDateTime.after(originDepartDateTime)) {
                int rowsAffected = flightAccess.updateFlight(originFlight, flightStatus, newDepartDateTime, newArrivalTime);

                if (rowsAffected > 0) {

                    List<Booking> departBookings = bookingAccess.getBookingsByDepartureFlightId(flightId);
                    List<Booking> returnBookings = bookingAccess.getBookingsByReturnFlightId(flightId);

                    List<Booking> allBookings = new ArrayList<>();
                    allBookings.addAll(departBookings);
                    allBookings.addAll(returnBookings);

                    Set<Booking> bookingsSet = new HashSet<>(allBookings);
                    allBookings.clear();
                    allBookings.addAll(bookingsSet);

                    Flight newFlight = flightAccess.getFlightById(originFlight.getId());

                    for (Booking booking : allBookings) {
                        String phoneNumber = "+" + booking.getPhoneCode() + booking.getPhoneNumber();
                        String bookingId = booking.getId();
                        String message = "Dear " + booking.getTitle() + ". " + booking.getFirstName() + booking.getLastName() + " Your flight has been delayed to " + newFlight.getDelayed_departure_time();

                        smsService.sendSms(phoneNumber, message);

                        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
                        String strDate = formatter.format(newFlight.getDelayed_departure_time());

                        try {
                            emailService.sendDelayedFlightEmail(booking, strDate);
                        } catch (Exception e) {

                            System.err.println("Error while sending email: " + e.getMessage());
                        }


                    }
                    return true;
                }
            }
            throw new IllegalArgumentException("New flight departure time is not after the original time or equal to the original time.");
        }


        return false;
    }

    @Override
    public boolean updateFlightsPrice(String flightId, double economyPrice, double businessPrice) {

        Flight flight = flightAccess.getFlightById(flightId);

        if (flight != null) {
            if (flight.getEconomy_price() == economyPrice && flight.getBusiness_price() == businessPrice) {
                return false;
            } else {
                int rowsAffected = flightAccess.updateFlightPrice(flightId, economyPrice, businessPrice);
                if (rowsAffected > 0) {
                    return true;
                }
            }
        }

        return false;
    }

    @Override
    public boolean deleteFlights(String id) {

        Flight existingFlight = flightAccess.getFlightById(id);

        if (existingFlight == null) {
            throw new IllegalArgumentException("No Such Airport");
        }

        int rowsAffected = flightAccess.deleteAirplane(id);

        if (rowsAffected > 0) {
            return true;
        }

        return false;
    }

    @Override
    public List<Flight> getAllFlights() {
        return flightAccess.getAllFlights();
    }

    @Override
    public Flight getFlightById(String id) {
        return flightAccess.getFlightById(id);
    }

    @Override
    public List<Flight> getFilteredFlights(String departureAirport, String arrivalAirport, Date departureDateStart, Date departureDateEnd, Date arrivalDateStart, Date arrivalDateEnd, String flightType, String flightStatus) {

        if (departureAirport != null && !departureAirport.isEmpty()) {
            Airport existingDepartureAirport = airportAccess.getAirportDetails(departureAirport);
            if (existingDepartureAirport == null) {
                throw new IllegalArgumentException("No such Departure Airport");
            }
        }

        if (arrivalAirport != null && !arrivalAirport.isEmpty()) {
            Airport existingArrivalAirport = airportAccess.getAirportDetails(arrivalAirport);
            if (existingArrivalAirport == null) {
                throw new IllegalArgumentException("No such Arrival Airport");
            }
        }

        return flightAccess.getFilteredFlightList(departureAirport, arrivalAirport, departureDateStart, departureDateEnd, arrivalDateStart, arrivalDateEnd, flightType, flightStatus, null);
    }

    @Override
    public List<Flight> getTodayFlight(String status) {

        if (status != null && !status.isEmpty()) {
            List<Flight> todayFlights = flightAccess.getTodayFlightsByStatus(Integer.valueOf(status));
            return todayFlights;
        }

        return null;
    }

    @Override
    public int getFlightCountByStatus(String status, int isToday, int isDelayed) {
        Date startDate = null, endDate = null;
        if (isToday == 1) {
            Date currentDate = new Date();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(currentDate);
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            startDate = calendar.getTime();
            calendar.add(Calendar.DAY_OF_MONTH, 1);
            calendar.add(Calendar.SECOND, -1);
            endDate = calendar.getTime();
        }

        return flightAccess.getCountByStatus(status, startDate, endDate);
    }

    public Map<String, Integer> getFlightCountGroupedByMonth(int isDelayed) {
        return flightAccess.getCountByStatusGroupedByMonth(isDelayed);
    }

    @Override
    public List<Flight> getUserFilteredFlight(String departureAirport, String arrivalAirport, Date departureDate, String status, String flightClass) {

        if (departureAirport != null && !departureAirport.isEmpty()) {
            Airport existingDepartureAirport = airportAccess.getAirportDetails(departureAirport);
            if (existingDepartureAirport == null) {
                throw new IllegalArgumentException("No such Departure Airport");
            }
        }
        if (arrivalAirport != null && !arrivalAirport.isEmpty()) {
            Airport existingArrivalAirport = airportAccess.getAirportDetails(arrivalAirport);
            if (existingArrivalAirport == null) {
                throw new IllegalArgumentException("No such Arrival Airport");
            }
        }

        List<Flight> FlightList = flightAccess.getUserFilteredFlightList(departureAirport, arrivalAirport, departureDate, status);
        List<Flight> AvailableFlights = new ArrayList<>();

        Date currentTime = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentTime);
        calendar.add(Calendar.HOUR_OF_DAY, 2);
        Date twoHoursLater = calendar.getTime();

        if (flightClass.equals(ECONOMY)) {
            for (Flight flight : FlightList) {
                if (flight.getEconomy_seats() > flight.getBooked_economy_seats() && !flight.getDeparture_time().before(currentTime) && flight.getDeparture_time().after(twoHoursLater)) {
                    AvailableFlights.add(flight);
                }
            }
        } else {
            for (Flight flight : FlightList) {
                if (flight.getBusiness_seats() > flight.getBooked_business_seats() && !flight.getDeparture_time().before(currentTime) && flight.getDeparture_time().after(twoHoursLater)) {
                    AvailableFlights.add(flight);
                }
            }
        }
        return AvailableFlights;

    }

    @Override
    public Map<String, String> getFlightDatePriceList(String departureAirport, String arrivalAirport, Date departureDateStart, Date departureDateEnd, String flightClass) {

        List<Flight> flightList = flightAccess.findCheapestFlights(departureDateStart, departureDateEnd, departureAirport, arrivalAirport);

        Map<String, String> flightMap = new LinkedHashMap<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        List<Flight> filteredFlightList = flightList.stream()
                .collect(Collectors.groupingBy(flight -> sdf.format(flight.getDeparture_time())))
                .values().stream()
                .flatMap(flights -> flights.stream().findFirst().stream())
                .collect(Collectors.toList());

        for (Flight flight : filteredFlightList) {
            String departureDate = sdf.format(flight.getDeparture_time());

            if (flightClass.equalsIgnoreCase("economy")) {
                flightMap.put(departureDate, String.valueOf(flight.getEconomy_price()));
            } else if (flightClass.equalsIgnoreCase("business")) {
                flightMap.put(departureDate, String.valueOf(flight.getBusiness_price()));
            }
        }

        return flightMap;
    }


    private Date calculateArrivalTime(Date departureTime, double duration) {
        Calendar arrivalCalendar = Calendar.getInstance();
        arrivalCalendar.setTime(departureTime);
        arrivalCalendar.add(Calendar.HOUR_OF_DAY, (int) duration);
        arrivalCalendar.add(Calendar.MINUTE, (int) ((duration % 1) * 60));
        return arrivalCalendar.getTime();
    }

    private Date getDateTime(Date date, Time time) {
        if (date != null && time != null) {
            Calendar dateCalendar = Calendar.getInstance();
            dateCalendar.setTime(date);

            Calendar timeCalendar = Calendar.getInstance();
            timeCalendar.setTime(time);

            dateCalendar.set(Calendar.HOUR_OF_DAY, timeCalendar.get(Calendar.HOUR_OF_DAY));
            dateCalendar.set(Calendar.MINUTE, timeCalendar.get(Calendar.MINUTE));
            dateCalendar.set(Calendar.SECOND, timeCalendar.get(Calendar.SECOND));

            return dateCalendar.getTime();
        }

        return null;
    }

    private Date extractDate(Date date) {
        if (date != null) {
            Calendar calendar = Calendar.getInstance();

            calendar.setTime(date);
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);

            return calendar.getTime();
        }

        return null;
    }

    public void validateFlightRequestBody(FlightRequestBody flightRequestBody) {

        if (flightRequestBody == null) {
            throw new IllegalArgumentException("Flight data is missing");
        }

        if (flightRequestBody.getAirline_id() == null || flightRequestBody.getAirline_id().isEmpty()) {
            throw new IllegalArgumentException("Flight Airline is missing");
        }

        if (flightRequestBody.getAirplane_id() == null || flightRequestBody.getAirplane_id().isEmpty()) {
            throw new IllegalArgumentException("Flight Airplane is missing");
        }

        if (flightRequestBody.getDeparture_airport() == null || flightRequestBody.getDeparture_airport().isEmpty()) {
            throw new IllegalArgumentException("Flight Departure Airport is missing");
        }

        if (flightRequestBody.getArrival_airport() == null || flightRequestBody.getArrival_airport().isEmpty()) {
            throw new IllegalArgumentException("Flight Arrival Airport is missing");
        }

        if (flightRequestBody.getDeparture_date() == null || flightRequestBody.getDeparture_date().toString().isEmpty()) {
            throw new IllegalArgumentException("Flight Departure Date is missing");
        }

        Date date = flightRequestBody.getDeparture_date();
        LocalDate localDate = date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();

        if (localDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Departure date cannot be in the past");
        }

        if (flightRequestBody.getDeparture_time() == null || flightRequestBody.getDeparture_time().toString().isEmpty()) {
            throw new IllegalArgumentException("Flight Departure Time is missing");
        }

        if (String.valueOf(flightRequestBody.getEconomy_price()) == null || String.valueOf(flightRequestBody.getEconomy_price()).isEmpty()) {
            throw new IllegalArgumentException("Flight Economy Price is missing");
        }

        if (flightRequestBody.getEconomy_price() < 0) {
            throw new IllegalArgumentException("Flight Economy Price cannot be negative");
        }

        if (String.valueOf(flightRequestBody.getBusiness_price()) == null || String.valueOf(flightRequestBody.getBusiness_price()).isEmpty()) {
            throw new IllegalArgumentException("Flight Business Price is missing");
        }

        if (flightRequestBody.getBusiness_price() < 0) {
            throw new IllegalArgumentException("Flight Business Price cannot be negative");
        }
        if (flightRequestBody.getDeparture_airport().equals(flightRequestBody.getArrival_airport())) {
            throw new IllegalArgumentException("Departure and Arrival airports cannot be the same");
        }

        if (flightRequestBody.getEconomy_price() > flightRequestBody.getBusiness_price()) {
            throw new IllegalArgumentException("Economy price cannot be larger than Business price");
        }

        Airplane existingAirplane = airplaneAccess.getAvailableAirplaneById(flightRequestBody.getAirplane_id());
        if (existingAirplane == null) {
            throw new IllegalArgumentException("No such Airplane is available");
        }

        Airport existingDepartureAirport = airportAccess.getAirportDetails(flightRequestBody.getDeparture_airport());
        if (existingDepartureAirport == null) {
            throw new IllegalArgumentException("No such Departure Airport");
        }

        Airport existingArrivalAirport = airportAccess.getAirportDetails(flightRequestBody.getArrival_airport());
        if (existingArrivalAirport == null) {
            throw new IllegalArgumentException("No such Arrival Airport");
        }
    }

    public Flight createReturnFlight(Flight newFlight) {
        Flight newReturnFlight = new Flight();

        newReturnFlight.setId(IDGenerator.generateUUID());
        newReturnFlight.setAirline_id(newFlight.getAirline_id());
        newReturnFlight.setAirplane_id(newFlight.getAirplane_id());
        newReturnFlight.setDeparture_airport(newFlight.getArrival_airport());
        newReturnFlight.setArrival_airport(newFlight.getDeparture_airport());
        newReturnFlight.setFlight_status(0);
        newReturnFlight.setEconomy_price(newFlight.getEconomy_price());
        newReturnFlight.setBusiness_price(newFlight.getBusiness_price());
        newReturnFlight.setIs_full(0);
        newReturnFlight.setFlight_type(newFlight.getFlight_type());
        newReturnFlight.setEconomy_seats(newFlight.getEconomy_seats());
        newReturnFlight.setBusiness_seats(newFlight.getBusiness_seats());

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(newFlight.getArrival_time());
        calendar.add(Calendar.HOUR_OF_DAY, 2);
        newReturnFlight.setDeparture_time(calendar.getTime());

        if (newReturnFlight.getDeparture_time() != null) {
            Airport departureAirport = airportAccess.getAirportDetails(newFlight.getArrival_airport());
            Airport arrivalAirport = airportAccess.getAirportDetails(newFlight.getDeparture_airport());
            Airplane airplane = airplaneAccess.getAirplaneById(newFlight.getAirplane_id());

            double flightDistance = distanceInKmBetween(departureAirport, arrivalAirport);
            double airplaneSpeed = airplane.getSpeed();

            double duration = flightDistance / (double) airplaneSpeed;


            duration += 1;

            Date arrivalTime = calculateArrivalTime(newReturnFlight.getDeparture_time(), duration);
            newReturnFlight.setArrival_time(arrivalTime);


            int hours = (int) duration;
            int minutes = (int) ((duration - hours) * 60);
            LocalTime localTime = java.time.LocalTime.of(hours, minutes);
            Time sqlTime = java.sql.Time.valueOf(localTime);

            newReturnFlight.setDuration_time(sqlTime);

        }

        return newReturnFlight;
    }

}
