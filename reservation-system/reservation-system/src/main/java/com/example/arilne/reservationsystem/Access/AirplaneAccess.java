package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.Airplane;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class AirplaneAccess {

    private static final String SEARCH_AIRPLANE_BY_LOCATION = "SELECT id, name FROM tbl_airplane WHERE status = 0 and location = ? ORDER BY name";
    private static final String SEARCH_AIRPLANE_BY_ID = "SELECT * FROM tbl_airplane WHERE id = ?";
    private static final String SEARCH_AVAILABLE_AIRPLANE_BY_ID = "SELECT * FROM tbl_airplane WHERE status = 0 and id = ?";
    private static final String INSERT_AIRPLANE = "INSERT INTO tbl_airplane (id, name, type, speed, location, status) VALUES (?, ?, ?, ?, ?, ?) ";
    private static final String SEARCH_ALL_AIRPLANE = "SELECT * FROM tbl_airplane ORDER BY location";
    private static final String SEARCH_AIRPLANE_BY_NAME = "SELECT * FROM tbl_airplane WHERE name = ?";
    private static final String UPDATE_AIRPLANE = "UPDATE tbl_airplane SET status = ? WHERE id = ?";
    private static final String DELETE_AIRPLANE_BY_ID = "DELETE FROM tbl_airplane WHERE id = ?";
    private static final String SEARCH_FILTERED_AIRPLANE = "SELECT * FROM tbl_airplane ";
    private static int rowsAffected = 0;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Map<String, String> getAirplaneByLocation(String location) {

        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(SEARCH_AIRPLANE_BY_LOCATION, new Object[]{location});
            Map<String, String> airplaneMap = new HashMap<>();

            for (Map<String, Object> row : rows) {
                String airplaneId = (String) row.get("id");
                String airplaneName = (String) row.get("name");

                airplaneMap.put(airplaneId, airplaneName);
            }

            return airplaneMap;
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }


    public Airplane getAirplaneById(String id) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_AIRPLANE_BY_ID, new Object[]{id}, new AirplaneRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }

    }

    public Airplane getAvailableAirplaneById(String id) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_AVAILABLE_AIRPLANE_BY_ID, new Object[]{id}, new AirplaneRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }

    }

    public List<Airplane> getAllAirplanes() {
        try {
            return jdbcTemplate.query(SEARCH_ALL_AIRPLANE, new AirplaneRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }

    }

    public Airplane findByName(String name) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_AIRPLANE_BY_NAME, new Object[]{name}, new AirplaneRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int createAirplane(Airplane airplane) {

        if (airplane != null) {
            try {
                rowsAffected = jdbcTemplate.update(INSERT_AIRPLANE, airplane.getId(), airplane.getName(), airplane.getType(), airplane.getSpeed(), airplane.getLocation(), airplane.getStatus());
                return rowsAffected;
            } catch (EmptyResultDataAccessException e) {
                return rowsAffected;
            }
        } else {
            return rowsAffected;
        }

    }

    public int updateAirplane(Airplane airplane) {

        if (airplane != null) {
            try {
                rowsAffected = jdbcTemplate.update(UPDATE_AIRPLANE, airplane.getStatus(), airplane.getId());
                return rowsAffected;
            } catch (EmptyResultDataAccessException e) {
                return rowsAffected;
            }
        } else {
            return rowsAffected;
        }
    }

    public int deleteAirplane(String id) {
        try {
            rowsAffected = jdbcTemplate.update(DELETE_AIRPLANE_BY_ID, id);
            return rowsAffected;
        } catch (EmptyResultDataAccessException e) {
            return rowsAffected;
        }
    }

    public List<Airplane> getFilteredAirplaneList(String status, String location) {
        StringBuilder queryBuilder = new StringBuilder(SEARCH_FILTERED_AIRPLANE);
        List<Object> params = new ArrayList<>();

        if (status != null || location != null) {
            queryBuilder.append("WHERE ");
            boolean andRequired = false;

            if (status != null && !status.isEmpty()) {
                queryBuilder.append("status = ? ");
                params.add(Integer.valueOf(status));
                andRequired = true;
            }

            if (location != null && !location.isEmpty()) {
                if (andRequired) {
                    queryBuilder.append("AND ");
                }
                queryBuilder.append("location = ? ");
                params.add(location);
            }
        }

        try {
            return jdbcTemplate.query(queryBuilder.toString(), params.toArray(), new AirplaneRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }


    private static class AirplaneRowMapper implements RowMapper<Airplane> {
        public Airplane mapRow(ResultSet rs, int rowNum) throws SQLException {

            Airplane airplane = new Airplane();
            airplane.setId(rs.getString("id"));
            airplane.setName(rs.getString("name"));
            airplane.setType(rs.getInt("type"));
            airplane.setSpeed(rs.getInt("speed"));
            airplane.setLocation(rs.getString("location"));
            airplane.setStatus(rs.getInt("status"));
            return airplane;
        }
    }
}