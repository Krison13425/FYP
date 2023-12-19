package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class BookingAccess {

    private static final String SEARCH_BOOKING_BY_ID = "SELECT * FROM tbl_booking WHERE id = ?";
    private static final String INSERT_BOOKING = "INSERT INTO tbl_booking (id, reference_id, transaction_id, departure_flight_id, departure_flight_class, departure_bundle_id, return_flight_id, return_flight_class, return_bundle_id, email, phone_code, phone_number, user_id, title, first_name, last_name, transportId, is_return_transport, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    private static final String SEARCH_ALL_BOOKINGS_BY_USER_ID = "SELECT * FROM tbl_booking where user_id = ?";
    private static final String SEARCH_ALL_BOOKINGS = "SELECT * FROM tbl_booking";
    private static final String SEARCH_BOOKING_BY_REFERENCE_ID = "SELECT * FROM tbl_booking WHERE reference_id = ?";
    private static final String SEARCH_BOOKING_BY_RETURN_FLIGHT_ID = "SELECT * FROM tbl_booking WHERE return_flight_id = ?";
    private static final String SEARCH_BOOKING_BY_DEPART_FLIGHT_ID = "SELECT * FROM tbl_booking WHERE departure_flight_id = ?";

    private static int rowsAffected = 0;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Booking getBookingById(String id) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_BOOKING_BY_ID, new Object[]{id}, new BookingRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public boolean isReferenceIdExists(String referenceId) {
        try {
            Booking booking = jdbcTemplate.queryForObject(SEARCH_BOOKING_BY_REFERENCE_ID, new Object[]{referenceId}, new BookingRowMapper());
            return booking != null;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }


    public Booking getBookingByIdReferenceId(String referenceId) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_BOOKING_BY_REFERENCE_ID, new Object[]{referenceId}, new BookingRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public List<Booking> getAllBookings() {
        try {
            return jdbcTemplate.query(SEARCH_ALL_BOOKINGS, new BookingRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }

    public List<Booking> getBookingsByDepartureFlightId(String departureFlightId) {
        try {
            return jdbcTemplate.query(SEARCH_BOOKING_BY_DEPART_FLIGHT_ID, new Object[]{departureFlightId}, new BookingRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }

    public List<Booking> getBookingsByReturnFlightId(String returnFlightId) {
        try {
            return jdbcTemplate.query(SEARCH_BOOKING_BY_RETURN_FLIGHT_ID, new Object[]{returnFlightId}, new BookingRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }


    public List<Booking> getAllBookingsBuUserId(String userId) {
        try {
            return jdbcTemplate.query(SEARCH_ALL_BOOKINGS_BY_USER_ID, new Object[]{userId}, new BookingRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }

    public int createBooking(Booking booking) {
        if (booking != null) {
            try {
                rowsAffected = jdbcTemplate.update(
                        INSERT_BOOKING,
                        booking.getId(),
                        booking.getReferenceId(),
                        booking.getTransactionId(),
                        booking.getDepartureFlightId(),
                        booking.getDepartureFlightClass(),
                        booking.getDepartureBundleId(),
                        booking.getReturnFlightId(),
                        booking.getReturnFlightClass(),
                        booking.getReturnBundleId(),
                        booking.getEmail(),
                        booking.getPhoneCode(),
                        booking.getPhoneNumber(),
                        booking.getUserId(),
                        booking.getTitle(),
                        booking.getFirstName(),
                        booking.getLastName(),
                        booking.getTransportId(),
                        booking.getIsReturnTransport(),
                        booking.getAddress()
                );
                return rowsAffected;
            } catch (EmptyResultDataAccessException e) {
                System.out.println(e.getMessage());
                return rowsAffected;
            }
        } else {
            return rowsAffected;
        }
    }


    private static class BookingRowMapper implements RowMapper<Booking> {
        public Booking mapRow(ResultSet rs, int rowNum) throws SQLException {
            Booking booking = new Booking();
            booking.setId(rs.getString("id"));
            booking.setReferenceId(rs.getString("reference_id"));
            booking.setTransactionId(rs.getString("transaction_id"));
            booking.setDepartureFlightId(rs.getString("departure_flight_id"));
            booking.setDepartureFlightClass(rs.getInt("departure_flight_class"));
            booking.setDepartureBundleId(rs.getString("departure_bundle_id"));
            booking.setReturnFlightId(rs.getString("return_flight_id"));
            booking.setReturnFlightClass(rs.getInt("return_flight_class"));
            booking.setReturnBundleId(rs.getString("return_bundle_id"));
            booking.setEmail(rs.getString("email"));
            booking.setPhoneCode(rs.getString("phone_code"));
            booking.setPhoneNumber(rs.getString("phone_number"));
            booking.setUserId(rs.getString("user_id"));
            booking.setTitle(rs.getString("title"));
            booking.setFirstName(rs.getString("first_name"));
            booking.setLastName(rs.getString("last_name"));
            booking.setTransportId(rs.getString("transportId"));
            booking.setIsReturnTransport(rs.getInt("is_return_transport"));
            booking.setAddress(rs.getString("address"));
            booking.setCreatedDate(rs.getDate("created_time_date"));
            return booking;
        }
    }
}
