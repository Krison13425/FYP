package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.Baggage;
import com.example.arilne.reservationsystem.RequestBody.BaggageRequestBody;
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
public class BaggageAccess {
    private static final String INSERT_BAGGAGE = "INSERT INTO tbl_baggage (id, name, kg, domestic_price, international_price) VALUES (?, ?, ?, ?, ?)";
    private static final String SELECT_ALL_BAGGAGE = "SELECT * FROM tbl_baggage ORDER BY domestic_price";
    private static final String SELECT_BAGGAGE_BY_ID = "SELECT * FROM tbl_baggage WHERE id = ?";
    private static final String UPDATE_BAGGAGE = "UPDATE tbl_baggage SET ";
    private static final String DELETE_BAGGAGE_BY_ID = "DELETE FROM tbl_baggage WHERE id = ?";
    private static final String SEARCH_BAGGAGE_BY_NAME = "SELECT * FROM tbl_baggage WHERE name = ?";
    private static int rowsAffected = 0;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Baggage getBaggageByName(String name) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_BAGGAGE_BY_NAME, new Object[]{name}, new BaggageRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int createBaggage(Baggage baggage) {

        if (baggage != null) {

            try {
                rowsAffected = jdbcTemplate.update(
                        INSERT_BAGGAGE,
                        baggage.getId(),
                        baggage.getName(),
                        baggage.getKg(),
                        baggage.getDomesticPrice(),
                        baggage.getInternationalPrice());
                return rowsAffected;
            } catch (EmptyResultDataAccessException e) {
                return rowsAffected;
            }
        }
        return rowsAffected;
    }

    public List<Baggage> getAllBaggage() {
        try {
            return jdbcTemplate.query(SELECT_ALL_BAGGAGE, new BaggageRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }

    public Baggage getBaggageById(String id) {
        try {
            return jdbcTemplate.queryForObject(SELECT_BAGGAGE_BY_ID, new Object[]{id}, new BaggageRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int updateBaggage(Baggage originBaggage, BaggageRequestBody baggageRequestBody) {
        try {
            StringBuilder queryBuilder = new StringBuilder(UPDATE_BAGGAGE);
            List<Object> params = new ArrayList<>();

            if (originBaggage.getDomesticPrice() != baggageRequestBody.getDomesticPrice()) {
                queryBuilder.append("domestic_price = ?, ");
                params.add(baggageRequestBody.getDomesticPrice());
            }

            if (originBaggage.getInternationalPrice() != baggageRequestBody.getInternationalPrice()) {
                queryBuilder.append("international_price = ?, ");
                params.add(baggageRequestBody.getInternationalPrice());
            }

            int i = queryBuilder.lastIndexOf(",");
            if (i != -1) {
                queryBuilder.deleteCharAt(i);
            }

            queryBuilder.append(" WHERE id = ?;");
            params.add(originBaggage.getId());

            rowsAffected = jdbcTemplate.update(queryBuilder.toString(), params.toArray());
            return rowsAffected;
        } catch (EmptyResultDataAccessException e) {
            return rowsAffected;
        }
    }


    public int deleteBaggage(String id) {
        try {
            rowsAffected = jdbcTemplate.update(DELETE_BAGGAGE_BY_ID, id);
            return rowsAffected;
        } catch (EmptyResultDataAccessException e) {
            return rowsAffected;
        }
    }

    private static class BaggageRowMapper implements RowMapper<Baggage> {
        public Baggage mapRow(ResultSet rs, int rowNum) throws SQLException {
            Baggage baggage = new Baggage();
            baggage.setId(rs.getString("id"));
            baggage.setName(rs.getString("name"));
            baggage.setKg(rs.getInt("kg"));
            baggage.setDomesticPrice(rs.getDouble("domestic_price"));
            baggage.setInternationalPrice(rs.getDouble("international_price"));
            return baggage;
        }
    }
}

