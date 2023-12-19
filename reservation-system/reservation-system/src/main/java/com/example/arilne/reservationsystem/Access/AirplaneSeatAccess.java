package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.AirplaneSeat;
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
public class AirplaneSeatAccess {

    private static final String CREATE_SEAT = "CALL fill_seats(?, ?, ?)";
    private static final String GET_NOT_AVAILABLE = "SELECT * FROM tbl_airplane_seat WHERE availability = 1 and airplane_id = ?";
    private static final String GET_AIRPLANE_BY_ID = "SELECT * FROM tbl_airplane_seat WHERE airplane_id = ?";
    private static final String UPDATE_AIRPLANE_SEAT_AVAILABILITY = "UPDATE tbl_airplane_seat SET availability = ? WHERE airplane_id = ? AND seat_row = ? AND seat_letter = ?";

    private static final String ECONOMY = "Economy";
    private static final String BUSINESS = "Business";
    private static int rowsAffected = 0;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int createSeat(String airplaneId, int airplaneType) {
        try {
            if (airplaneId != null && String.valueOf(airplaneType) != null && !airplaneId.isEmpty()
                    && !String.valueOf(airplaneType).isEmpty()) {

                rowsAffected += jdbcTemplate.update(CREATE_SEAT, airplaneType, ECONOMY, airplaneId);
                rowsAffected += jdbcTemplate.update(CREATE_SEAT, airplaneType, BUSINESS, airplaneId);
            }
        } catch (Exception e) {
            return rowsAffected;
        }
        return rowsAffected;
    }

    public List<AirplaneSeat> getAirplaneSeatsListById(String airplaneId) {
        try {
            return jdbcTemplate.query(GET_AIRPLANE_BY_ID, new Object[]{airplaneId}, new AirplaneSeatRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }

    public AirplaneSeat getAirplaneSeatById(String airplaneId, int seatRow, String seatLetter) {
        try {
            String query = GET_AIRPLANE_BY_ID + " LIMIT 1";
            return jdbcTemplate.queryForObject(query, new Object[]{airplaneId}, new AirplaneSeatRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int editAvailability(String airplaneId, int seatRow, String seatLetter, int availability) {

        try {
            rowsAffected = jdbcTemplate.update(UPDATE_AIRPLANE_SEAT_AVAILABILITY, availability, airplaneId, seatRow, seatLetter);
            return rowsAffected;
        } catch (Exception e) {
            return rowsAffected;
        }
    }

    public List<AirplaneSeat> getNotAvailableSeats(String airplaneId) {
        try {
            return jdbcTemplate.query(GET_NOT_AVAILABLE, new Object[]{airplaneId}, new AirplaneSeatRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }

    private static class AirplaneSeatRowMapper implements RowMapper<AirplaneSeat> {
        public AirplaneSeat mapRow(ResultSet rs, int rowNum) throws SQLException {
            AirplaneSeat airplaneSeat = new AirplaneSeat();
            airplaneSeat.setAirplaneId(rs.getString("airplane_id"));
            airplaneSeat.setSeatRow(rs.getInt("seat_row"));
            airplaneSeat.setSeatLetter(rs.getString("seat_letter"));
            airplaneSeat.setAvailability(rs.getInt("availability"));
            return airplaneSeat;
        }
    }
}
