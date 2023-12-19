package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.Seat;
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
public class SeatAccess {

    private static final String SEARCH_ALL_SEATS_BY_FLIGHTS = "SELECT * FROM tbl_seat WHERE seat_status = 0 and flight_id = ?";

    private static final String SEARCH_ALL_SEATS = "SELECT * FROM tbl_seat WHERE seat_status = 0";
    private static final String SEARCH_SEAT_BY_ID = "SELECT * FROM tbl_seat WHERE id = ?";
    private static final String CREATE_SEATS = "INSERT INTO tbl_seat (id, flight_id, seat_row, seat_letter, seat_status) VALUES (?, ?, ?, ?, ?)";
    private static final String UPDATE_SEATS_STATUS = "UPDATE tbl_seat SET seat_status = ? WHERE id = ?";

    private static int rowsAffected = 0;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Seat> getAllSeatsByFlight(String flightId) {
        try {
            return jdbcTemplate.query(SEARCH_ALL_SEATS_BY_FLIGHTS, new SeatRowMapper(), flightId);
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }


    public List<Seat> getAllSeats() {
        try {
            return jdbcTemplate.query(SEARCH_ALL_SEATS, new SeatRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }

    public Seat getSeatById(String seatId) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_SEAT_BY_ID, new SeatRowMapper(), seatId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int Create(Seat seat) {

        if (seat != null) {
            try {
                rowsAffected = jdbcTemplate.update(CREATE_SEATS, seat.getId(), seat.getFlightId(), seat.getSeatRow(), seat.getSeatLetter(), seat.getSeatStatus());
                return rowsAffected;
            } catch (EmptyResultDataAccessException e) {
                return rowsAffected;
            }
        }
        return rowsAffected;
    }

    public int updateSeatStatus(String seatId, int seatStatus) {

        if (seatId != null && String.valueOf(seatStatus) != null) {

            try {
                rowsAffected = jdbcTemplate.update(UPDATE_SEATS_STATUS, seatStatus, seatId);
                return rowsAffected;
            } catch (EmptyResultDataAccessException e) {
                e.printStackTrace();
                return rowsAffected;
            }
        }
        return rowsAffected;
    }


    private static class SeatRowMapper implements RowMapper<Seat> {
        public Seat mapRow(ResultSet rs, int rowNum) throws SQLException {
            Seat seat = new Seat();
            seat.setId(rs.getString("id"));
            seat.setFlightId(rs.getString("flight_id"));
            seat.setSeatRow(rs.getInt("seat_row"));
            seat.setSeatLetter(rs.getString("seat_letter"));
            seat.setSeatStatus(rs.getInt("seat_status"));
            return seat;
        }
    }
}
