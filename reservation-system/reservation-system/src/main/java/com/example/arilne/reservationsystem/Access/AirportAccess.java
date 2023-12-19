package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.Airport;
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
public class AirportAccess {

    private static final String SEARCH_AIRPORT_BY_ID = "SELECT * FROM tbl_airport WHERE code = ?";
    private static final String SEARCH_AIRPORT_COUNTRY_BY_ID = "SELECT country_code FROM tbl_airport WHERE code = ?";
    private static final String SEARCH_AIRPORT_BY_COUNTRY_CODE = "SELECT * FROM tbl_airport WHERE country_code = ?";
    private static final String SEARCH_ALL_AIRPORTS = "SELECT * FROM tbl_airport";
    private static final String SEARCH_ALL_AIRPORTS_CODE_MUNICIPAL = "SELECT code, municipal FROM tbl_airport";
    private static final String SEARCH_ALL_AIRPORTS_CODE_NAME = "SELECT code, name FROM tbl_airport";
    private static final String INSERT_AIRPORTS = "INSERT INTO tbl_airport (code, country_code, municipal, name, latitude, longitude, address, phone, terminal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    private static final String UPDATE_AIRPORT = "UPDATE tbl_airport SET ";
    private static final String DELETE_AIRPORT_BY_CODE = "DELETE FROM tbl_airport WHERE code = ?";

    private static int rowsAffected = 0;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Airport getAirportDetails(String code) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_AIRPORT_BY_ID, new Object[]{code}, new AirportRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public String getAirportCountryByCode(String code) {
        try {
            return jdbcTemplate.queryForObject(
                    SEARCH_AIRPORT_COUNTRY_BY_ID,
                    new Object[]{code},
                    String.class
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }


    public List<Airport> getAirportByLocation(String country_code) {
        try {
            return jdbcTemplate.query(SEARCH_AIRPORT_BY_COUNTRY_CODE, new Object[]{country_code}, new AirportRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public Map<String, String> getAllAirportCode() {
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(SEARCH_ALL_AIRPORTS_CODE_MUNICIPAL);
            Map<String, String> airportMap = new HashMap<>();

            for (Map<String, Object> row : rows) {
                String airportCode = (String) row.get("code");
                String airportName = (String) row.get("municipal");

                airportMap.put(airportCode, airportName);
            }

            return airportMap;
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public Map<String, String> getAllAirportName() {
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(SEARCH_ALL_AIRPORTS_CODE_NAME);
            Map<String, String> airportMap = new HashMap<>();

            for (Map<String, Object> row : rows) {
                String airportCode = (String) row.get("code");
                String airportName = (String) row.get("name");

                airportMap.put(airportCode, airportName);
            }

            return airportMap;
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int updateAirport(Airport originAirport, Airport updateAirport) {
        try {
            StringBuilder queryBuilder = new StringBuilder(UPDATE_AIRPORT);
            List<Object> params = new ArrayList<>();

            if (!originAirport.getName().equals(updateAirport.getName())) {
                queryBuilder.append("name = ?, ");
                params.add(updateAirport.getName());
            }

            if (!originAirport.getMunicipal().equals(updateAirport.getMunicipal())) {
                queryBuilder.append("municipal = ?, ");
                params.add(updateAirport.getMunicipal());
            }

            if (originAirport.getAddress().equals(updateAirport.getAddress())) {
                queryBuilder.append("address = ?, ");
                params.add(updateAirport.getAddress());
            }

            if (originAirport.getPhone().equals(updateAirport.getPhone())) {
                queryBuilder.append("phone = ?, ");
                params.add(updateAirport.getPhone());
            }

            int i = queryBuilder.lastIndexOf(",");
            if (i != -1) {
                queryBuilder.deleteCharAt(i);
            }

            queryBuilder.append(" WHERE code = ?;");
            params.add(originAirport.getCode());

            rowsAffected = jdbcTemplate.update(queryBuilder.toString(), params.toArray());
            return rowsAffected;
        } catch (EmptyResultDataAccessException e) {

            return rowsAffected;

        }
    }

    public List<Airport> getAllAirport() {
        try {
            return jdbcTemplate.query(SEARCH_ALL_AIRPORTS, new AirportAccess.AirportRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int createAirport(Airport airport) {

        if (airport != null) {
            try {
                rowsAffected = jdbcTemplate.update(INSERT_AIRPORTS, airport.getCode(), airport.getCountry_code(), airport.getMunicipal(), airport.getName(), airport.getLatitude(), airport.getLongitude(), airport.getAddress(), airport.getPhone(), airport.getTerminal());
                return rowsAffected;
            } catch (EmptyResultDataAccessException e) {
                return rowsAffected;
            }
        } else {
            return rowsAffected;
        }
    }

    public int deleteAirplane(String code) {
        try {
            rowsAffected = jdbcTemplate.update(DELETE_AIRPORT_BY_CODE, code);
            return rowsAffected;
        } catch (EmptyResultDataAccessException e) {
            return rowsAffected;
        }
    }


    private static class AirportRowMapper implements RowMapper<Airport> {
        @Override
        public Airport mapRow(ResultSet rs, int rowNum) throws SQLException {
            Airport airport = new Airport();
            airport.setCode(rs.getString("code"));
            airport.setCountry_code(rs.getString("country_code"));
            airport.setMunicipal(rs.getString("municipal"));
            airport.setName(rs.getString("name"));
            airport.setLatitude(rs.getDouble("latitude"));
            airport.setLongitude(rs.getDouble("longitude"));
            airport.setAddress(rs.getString("address"));
            airport.setPhone(rs.getString("phone"));
            airport.setTerminal(rs.getString("terminal"));
            return airport;
        }
    }

}
