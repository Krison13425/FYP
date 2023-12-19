package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.Transport;
import com.example.arilne.reservationsystem.RequestBody.TransportRequestBody;
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
public class TransportationAccess {

    private static final String SEARCH_EXISTING_TRANSPORTATION = "SELECT COUNT(*) FROM tbl_transport WHERE name = ? AND type = ? AND capacity = ? AND price = ? AND luggage = ?";
    private static final String SEARCH_TRANSPORT_BY_ID = "SELECT * FROM tbl_transport WHERE id = ?";
    private static final String INSERT_TRANSPORT = "INSERT INTO tbl_transport (id, name, type, capacity, price, luggage) VALUES (?, ?, ?, ?, ?, ?)";
    private static final String SEARCH_ALL_TRANSPORT = "SELECT * FROM tbl_transport ORDER BY name";
    private static final String UPDATE_TRANSPORT = "UPDATE tbl_transport SET price = ? WHERE id = ?";
    private static final String UPDATE_STATUS = "UPDATE tbl_transport SET status = ? WHERE id = ?";
    private static final String DELETE_TRANSPORT = "DELETE FROM tbl_transport WHERE id = ?";

    private static int rowsAffected = 0;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public boolean checkExistingTransport(TransportRequestBody transport) {
        int count = jdbcTemplate.queryForObject(
                SEARCH_EXISTING_TRANSPORTATION,
                new Object[]{transport.getName(), transport.getType(), transport.getCapacity(), transport.getPrice()},
                Integer.class
        );
        return count > 0;
    }


    public Transport getTransportById(String id) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_TRANSPORT_BY_ID, new Object[]{id}, new TransportRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public List<Transport> getAllTransports() {
        try {
            return jdbcTemplate.query(SEARCH_ALL_TRANSPORT, new TransportRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }

    public int createTransport(Transport transport) {
        if (transport != null) {
            try {
                rowsAffected = jdbcTemplate.update(INSERT_TRANSPORT, transport.getId(), transport.getName(), transport.getType(), transport.getCapacity(), transport.getPrice(), transport.getLuggage());
                return rowsAffected;
            } catch (EmptyResultDataAccessException e) {
                return rowsAffected;
            }
        } else {
            return rowsAffected;
        }
    }

    public int updateTransport(String id, double price) {
        try {
            rowsAffected = jdbcTemplate.update(UPDATE_TRANSPORT, price, id);
            return rowsAffected;
        } catch (EmptyResultDataAccessException e) {
            return rowsAffected;
        }

    }

    public int delete(String id) {
        try {
            rowsAffected = jdbcTemplate.update(DELETE_TRANSPORT, id);
            return rowsAffected;
        } catch (EmptyResultDataAccessException e) {
            return rowsAffected;
        }

    }


    private static class TransportRowMapper implements RowMapper<Transport> {
        public Transport mapRow(ResultSet rs, int rowNum) throws SQLException {
            Transport transport = new Transport();
            transport.setId(rs.getString("id"));
            transport.setName(rs.getString("name"));
            transport.setType(rs.getInt("type"));
            transport.setCapacity(rs.getInt("capacity"));
            transport.setPrice(rs.getDouble("price"));
            transport.setLuggage(rs.getInt("luggage"));
            return transport;
        }
    }
}
