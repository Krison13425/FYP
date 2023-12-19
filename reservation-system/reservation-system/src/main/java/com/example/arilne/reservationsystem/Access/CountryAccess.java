package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.Country;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class CountryAccess {

    private static final String SEARCH_ALL_COUNTRY = "SELECT * FROM tbl_country ORDER BY on_off DESC";
    private static final String SEARCH_ON_COUNTRY = "SELECT code, name FROM tbl_country WHERE on_off = 1";
    private static final String SEARCH_ON_COUNTRY_BY_NAME = "SELECT * FROM tbl_country WHERE on_off = 1 and code = ? ";
    private static final String SEARCH_PHONE_COUNTRY_BY_CODE = "SELECT phone FROM tbl_country WHERE code = ? ";
    private static final String UPDATE_COUNTRY = "UPDATE tbl_country SET on_off = ? WHERE code = ?";
    private static int rowsAffected = 0;
    @Autowired
    private JdbcTemplate jdbcTemplate;


    public List<Country> getAllCountries() {

        return jdbcTemplate.query(SEARCH_ALL_COUNTRY, new CountryRowMapper());
    }

    public Map<String, String> getOnCountries() {

        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(SEARCH_ON_COUNTRY);
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

    public Country findOnCountryByCode(String countryCode) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_ON_COUNTRY_BY_NAME, new Object[]{countryCode}, new CountryRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public Integer getPhoneCountryByCode(String code) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_PHONE_COUNTRY_BY_CODE, new Object[]{code}, Integer.class);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int updateCountry(List<Country> countries) {

        if (countries != null && !countries.isEmpty()) {
            try {
                for (Country country : countries) {
                    rowsAffected += jdbcTemplate.update(UPDATE_COUNTRY, country.getOn_off(), country.getCode());
                    return rowsAffected;
                }
            } catch (EmptyResultDataAccessException e) {
                return rowsAffected;
            }
        }
        return rowsAffected;

    }


    private static class CountryRowMapper implements RowMapper<Country> {
        @Override
        public Country mapRow(ResultSet rs, int rowNum) throws SQLException {
            Country country = new Country();
            country.setCode(rs.getString("code"));
            country.setName(rs.getString("name"));
            country.setOn_off(rs.getInt("on_off"));
            country.setPhone(rs.getInt("phone"));
            return country;
        }
    }


}
