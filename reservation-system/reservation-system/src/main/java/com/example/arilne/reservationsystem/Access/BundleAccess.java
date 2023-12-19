package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.Bundle;
import com.example.arilne.reservationsystem.RequestBody.BundleRequestBody;
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
public class BundleAccess {

    private static final String SEARCH_BUNDLE_BY_NAME = "SELECT * FROM tbl_bundle WHERE name = ?";
    private static final String SEARCH_BUNDLE_BY_ID = "SELECT * FROM tbl_bundle WHERE id = ?";
    private static final String SEARCH_BUNDLE_BY_FLIGHT_CLASS = "SELECT * FROM tbl_bundle WHERE name LIKE ? ORDER BY domestic_price";
    private static final String INSERT_BUNDLE = "INSERT INTO tbl_bundle (id, name, cabin_baggage, free_meal, checkin_baggage_20, checkin_baggage_30, checkin_baggage_40, prio_check_in, prio_boarding, lounge_access, domestic_price, international_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    private static final String SEARCH_ALL_BUNDLES = "SELECT * FROM tbl_bundle";
    private static final String UPDATE_BUNDLE = "UPDATE tbl_bundle SET ";
    private static final String DELETE_BUNDLE_BY_ID = "DELETE FROM tbl_bundle WHERE id = ?";
    private static int rowsAffected = 0;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Bundle getBundleByName(String name) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_BUNDLE_BY_NAME, new Object[]{name}, new BundleRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public Bundle getBundleById(String Id) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_BUNDLE_BY_ID, new Object[]{Id}, new BundleRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int createBundle(Bundle bundle) {

        if (bundle != null) {
            try {
                rowsAffected = jdbcTemplate.update(
                        INSERT_BUNDLE,
                        bundle.getId(),
                        bundle.getName(),
                        bundle.getCabinBaggage(),
                        bundle.getFreeMeal(),
                        bundle.getCheckinBaggage20(),
                        bundle.getCheckinBaggage30(),
                        bundle.getCheckinBaggage40(),
                        bundle.getPrioCheckIn(),
                        bundle.getPrioBoarding(),
                        bundle.getLoungeAccess(),
                        bundle.getDomesticPrice(),
                        bundle.getInternationalPrice()
                );

                return rowsAffected;
            } catch (EmptyResultDataAccessException e) {
                return rowsAffected;
            }
        }
        return rowsAffected;
    }

    public List<Bundle> getAllBundles() {
        try {
            return jdbcTemplate.query(SEARCH_ALL_BUNDLES, new BundleRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int updateBundle(Bundle originBundle, BundleRequestBody bundleRequestBody) {
        try {
            StringBuilder queryBuilder = new StringBuilder(UPDATE_BUNDLE);
            List<Object> params = new ArrayList<>();

            if (originBundle.getPrioCheckIn() != bundleRequestBody.getPrioCheckIn()) {
                queryBuilder.append("prio_check_in = ?, ");
                params.add(bundleRequestBody.getPrioCheckIn());
            }

            if (originBundle.getDomesticPrice() != bundleRequestBody.getDomesticPrice()) {
                queryBuilder.append("domestic_price = ?, ");
                params.add(bundleRequestBody.getDomesticPrice());
            }

            if (originBundle.getInternationalPrice() != bundleRequestBody.getInternationalPrice()) {
                queryBuilder.append("international_price = ?, ");
                params.add(bundleRequestBody.getInternationalPrice());
            }

            int i = queryBuilder.lastIndexOf(",");
            if (i != -1) {
                queryBuilder.deleteCharAt(i);
            }

            queryBuilder.append(" WHERE id = ?");
            params.add(originBundle.getId());

            rowsAffected = jdbcTemplate.update(queryBuilder.toString(), params.toArray());
            return rowsAffected;
        } catch (EmptyResultDataAccessException e) {
            return rowsAffected;
        }
    }

    public List<Bundle> getBundlesByFlightClass(String flightCLass) {

        String searchTerm = "%" + flightCLass + "%";
        return jdbcTemplate.query(SEARCH_BUNDLE_BY_FLIGHT_CLASS, new Object[]{searchTerm}, new BundleRowMapper());
    }

    public int deleteBundle(String id) {
        try {
            rowsAffected = jdbcTemplate.update(DELETE_BUNDLE_BY_ID, id);
            return rowsAffected;
        } catch (EmptyResultDataAccessException e) {
            return rowsAffected;
        }
    }


    private static class BundleRowMapper implements RowMapper<Bundle> {
        public Bundle mapRow(ResultSet rs, int rowNum) throws SQLException {
            Bundle bundle = new Bundle();
            bundle.setId(rs.getString("id"));
            bundle.setName(rs.getString("name"));
            bundle.setCabinBaggage(rs.getInt("cabin_baggage"));
            bundle.setFreeMeal(rs.getInt("free_meal"));
            bundle.setCheckinBaggage20(rs.getInt("checkin_baggage_20"));
            bundle.setCheckinBaggage30(rs.getInt("checkin_baggage_30"));
            bundle.setCheckinBaggage40(rs.getInt("checkin_baggage_40"));
            bundle.setPrioCheckIn(rs.getInt("prio_check_in"));
            bundle.setDomesticPrice(rs.getDouble("domestic_price"));
            bundle.setInternationalPrice(rs.getDouble("international_price"));
            bundle.setPrioBoarding(rs.getInt("prio_boarding"));
            bundle.setLoungeAccess(rs.getInt("lounge_access"));
            return bundle;
        }
    }
}
