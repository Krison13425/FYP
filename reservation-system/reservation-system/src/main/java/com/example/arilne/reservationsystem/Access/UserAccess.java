package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.User;
import com.example.arilne.reservationsystem.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.web.server.ResponseStatusException;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;

@Repository
public class UserAccess {

    private static final String INSERT_USER = "INSERT INTO tbl_user (id, user_name, email, password, user_type, email_verified, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?)";
    private static final String SEARCH_USER_USERNAME = "SELECT * FROM tbl_user WHERE user_name = ?";
    private static final String SEARCH_USER_USERID = "SELECT * FROM tbl_user WHERE id = ?";
    private static final String SEARCH_ALl_USER = "SELECT * FROM tbl_user";
    private static final String SEARCH_ALl_USER_ID = "SELECT id FROM tbl_user";
    private static final String SEARCH_USER_VERIFICATION_TOKEN = "SELECT * FROM tbl_user WHERE verification_token = ?";
    private static final String UPDATE_EMAIL_VERIFICATION = "UPDATE tbl_user SET email_verified = ? WHERE id = ?";
    private static final String UPDATE_PASSWORD_VERIFICATION = "UPDATE tbl_user SET verification_token = ? WHERE id = ?";
    private static final String UPDATE_PASSWORD = "UPDATE tbl_user SET password = ?, verification_token = ? WHERE id = ?";
    private static final String SEARCH_USER_RESET_TOKEN_AND_EMAIL = "SELECT * FROM tbl_user WHERE verification_token = ? AND email = ?";
    private static final Logger LOGGER = Logger.getLogger(UserService.class.getName());
    @Autowired
    JdbcTemplate jdbcTemplate;

    public User findUserByName(String username) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_USER_USERNAME, new Object[]{username}, new UserRowMapper());

        } catch (EmptyResultDataAccessException e) {
            LOGGER.severe("Error occurred while finding user: " + e.getMessage());
            return null;
        }
    }


    public User findUserById(int id) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_USER_USERID, new Object[]{id}, new UserRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }

    }


    public User findUserByResetTokenAndEmail(String resetToken, String email) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_USER_RESET_TOKEN_AND_EMAIL, new Object[]{resetToken, email}, new UserRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }


    public List<User> findAll() {

        return jdbcTemplate.query(SEARCH_ALl_USER, new UserRowMapper());
    }

    public boolean save(User user) {
        try {
            jdbcTemplate.update(INSERT_USER, user.getUserId(), user.getUserName(), user.getUserEmail(), user.getPassword(), user.getUserType(), user.isEmailVerified(), user.getVerificationToken());
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }

    public User findUserByToken(String token) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_USER_VERIFICATION_TOKEN, new Object[]{token}, new UserRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public boolean updateEmailVerificationStatus(User user) {
        try {
            jdbcTemplate.update(UPDATE_EMAIL_VERIFICATION, user.isEmailVerified(), user.getUserId());
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }

    public boolean updateChangePassword(User user) {
        try {
            jdbcTemplate.update(UPDATE_PASSWORD_VERIFICATION, user.getVerificationToken(), user.getUserId());
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }

    public void updatePassword(User user) {
        try {
            jdbcTemplate.update(UPDATE_PASSWORD, user.getPassword(), user.getVerificationToken(), user.getUserId());
        } catch (EmptyResultDataAccessException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update password."
            );
        }
    }


    public Set<String> getAllUserId() {

        Set<String> existingUserIds = new HashSet<>(jdbcTemplate.queryForList(SEARCH_ALl_USER_ID, String.class));
        return existingUserIds;
    }


    private static class UserRowMapper implements RowMapper<User> {

        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User user = new User();
            user.setUserId(rs.getString("id"));
            user.setUserName(rs.getString("user_name"));
            user.setUserEmail(rs.getString("email"));
            user.setPassword(rs.getString("password"));
            user.setUserType(rs.getInt("user_type"));
            user.setEmailVerified(rs.getBoolean("email_verified"));
            user.setVerificationToken(rs.getString("verification_token"));
            return user;
        }
    }
}
