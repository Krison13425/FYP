package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.Price;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class PriceAccess {

    private static final String INSERT_PRICE = "INSERT INTO tbl_price (id, flight_id, economy_price, business_price) VALUES (?, ?, ?, ?)";

    private static final String SEARCH_PRICE_BY_FLIGHT_ID = "SELECT * FROM tbl_price WHERE flight_id = ? ;";
    @Autowired
    private JdbcTemplate jdbcTemplate;


    public boolean createFlightPrice(Price price){
        if(price != null){
            if(price.getFlight_id() != null || price.getId() != null || price.getBusiness_price() != 0 || price.getEconomy_price() !=0 ){

            }
                try {
                    jdbcTemplate.update(INSERT_PRICE, price.getId(),price.getFlight_id(), price.getEconomy_price(), price.getBusiness_price());
                    return true;
                } catch (EmptyResultDataAccessException e) {
                    return false;
                }

            }else{
                return false;
            }
    }

    public Price getPriceByFLightId(String flightId) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_PRICE_BY_FLIGHT_ID, new Object[]{flightId}, new PriceAccess.PriceRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }


    public Price getPriceByDate() {
        try {
            return jdbcTemplate.queryForObject(SEARCH_PRICE_BY_FLIGHT_ID, new Object[]{}, new PriceAccess.PriceRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }
    private static class PriceRowMapper implements RowMapper<Price> {

        public Price mapRow(ResultSet rs, int rowNum) throws SQLException {
            Price price = new Price();
            price.setId(rs.getString("id"));
            price.setFlight_id(rs.getString("flight_id"));
            price.setEconomy_price(rs.getDouble("economy_price"));
            price.setBusiness_price(rs.getDouble("business_price"));
            return price;
        }
    }





}
