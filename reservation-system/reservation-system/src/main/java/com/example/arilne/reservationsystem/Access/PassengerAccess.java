package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.Passenger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class PassengerAccess {

    final static String INSERT_QUERY = "INSERT INTO tbl_passenger (id, bookingId, bookingReferenceId, flightId, emergency_id, firstName, lastName, birthDate, selectedTitle, nationality, baggage, mealId, seatId, status, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    private final static String SELECT_ALL_QUERY = "SELECT * FROM tbl_passenger";
    private final static String SELECT_BY_ID_QUERY = "SELECT * FROM tbl_passenger WHERE id = ?";
    private final static String SELECT_BY_BOOKING_ID = "SELECT * FROM tbl_passenger WHERE bookingId = ?";
    private final static String SELECT_BY_BOOKING_REFERENCE_ID = "SELECT * FROM tbl_passenger WHERE bookingReferenceId = ?";
    private final static String SELECT_BY_FLIGHT_ID_AND_BOOKING_ID = "SELECT * FROM tbl_passenger WHERE flightId = ? AND bookingId = ?";
    private final static String UPDATE_QUERY = "UPDATE tbl_passenger SET bookingId = ?, bookingReferenceId = ?, flightId = ?, emergency_id = ?, firstName = ?, lastName = ?, birthDate = ?, selectedTitle = ?, nationality = ?, baggage = ?, mealId = ?, seatId = ?, status = ?, type = ? WHERE id = ?";

    @Autowired
    JdbcTemplate jdbcTemplate;

    public List<Passenger> findAll() {
        return jdbcTemplate.query(SELECT_ALL_QUERY, new PassengerRowMapper());
    }

    public Passenger findById(String id) {
        return jdbcTemplate.queryForObject(SELECT_BY_ID_QUERY, new Object[]{id}, new PassengerRowMapper());
    }

    public List<Passenger> findByReferenceId(String id) {
        return jdbcTemplate.query(SELECT_BY_BOOKING_REFERENCE_ID, new Object[]{id}, new PassengerRowMapper());
    }

    public List<Passenger> findByBookingId(String id) {
        return jdbcTemplate.query(SELECT_BY_BOOKING_ID, new Object[]{id}, new PassengerRowMapper());
    }

    public List<Passenger> findByFlightIdAndBookingId(String flightId, String bookingId) {
        return jdbcTemplate.query(SELECT_BY_FLIGHT_ID_AND_BOOKING_ID, new Object[]{flightId, bookingId}, new PassengerRowMapper());
    }

    public int insert(Passenger passenger) {
        return jdbcTemplate.update(INSERT_QUERY,
                new Object[]{passenger.getId(), passenger.getBookingId(), passenger.getBookingReferenceId(), passenger.getFlightId(), passenger.getEmergencyId(), passenger.getFirstName(), passenger.getLastName(), passenger.getBirthDate(), passenger.getSelectedTitle(), passenger.getNationality(), passenger.getBaggage(), passenger.getMealId(), passenger.getSeatId(), passenger.getStatus(), passenger.getType()});
    }

    public int update(Passenger passenger) {
        return jdbcTemplate.update(UPDATE_QUERY,
                new Object[]{passenger.getBookingId(), passenger.getBookingReferenceId(), passenger.getFlightId(), passenger.getEmergencyId(), passenger.getFirstName(), passenger.getLastName(), passenger.getBirthDate(), passenger.getSelectedTitle(), passenger.getNationality(), passenger.getBaggage(), passenger.getMealId(), passenger.getSeatId(), passenger.getStatus(), passenger.getId(), passenger.getType()});
    }

    class PassengerRowMapper implements RowMapper<Passenger> {
        @Override
        public Passenger mapRow(ResultSet rs, int rowNum) throws SQLException {
            Passenger passenger = new Passenger();
            passenger.setId(rs.getString("id"));
            passenger.setBookingId(rs.getString("bookingId"));
            passenger.setBookingReferenceId(rs.getString("bookingReferenceId"));
            passenger.setFlightId(rs.getString("flightId"));
            passenger.setEmergencyId(rs.getString("emergency_id"));
            passenger.setFirstName(rs.getString("firstName"));
            passenger.setLastName(rs.getString("lastName"));
            passenger.setBirthDate(rs.getDate("birthDate"));
            passenger.setSelectedTitle(rs.getString("selectedTitle"));
            passenger.setNationality(rs.getString("nationality"));
            passenger.setBaggage(rs.getInt("baggage"));
            passenger.setMealId(rs.getString("mealId"));
            passenger.setSeatId(rs.getString("seatId"));
            passenger.setStatus(rs.getInt("status"));
            passenger.setType(rs.getInt("type"));

            return passenger;
        }
    }
}
