package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.UserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class UserDetailsAccess {

    private static final String GET_USER_DETAILS = "SELECT * FROM tbl_user_details WHERE user_id = ?";
    private static final String UPDATE_USER_DETAILS = "INSERT INTO tbl_user_details (id, user_id, first_name, last_name, dob) VALUES (?, ?, ?, ?, ?)";
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public UserDetails getUserDetails(String userId) {

        try {
            return jdbcTemplate.queryForObject(GET_USER_DETAILS, new Object[]{userId}, new UserDetailsAccess.UserDetailsRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public boolean create(UserDetails userDetails) {
        try {

            Object[] params = new Object[]{
                    userDetails.getId(),
                    userDetails.getUserId(),
                    userDetails.getUserFirstName(),
                    userDetails.getUserLastName(),
                    userDetails.getUserDOB()
            };

            jdbcTemplate.update(UPDATE_USER_DETAILS, params);
            return true;

        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }


    private static class UserDetailsRowMapper implements RowMapper<UserDetails> {
        public UserDetails mapRow(ResultSet rs, int rowNum) throws SQLException {
            UserDetails userDetails = new UserDetails();
            userDetails.setUserId(rs.getString("id"));
            userDetails.setUserFirstName(rs.getString("first_name"));
            userDetails.setUserLastName(rs.getString("last_name"));
            userDetails.setUserDOB(rs.getDate("dob"));
            return userDetails;
        }
    }


}
