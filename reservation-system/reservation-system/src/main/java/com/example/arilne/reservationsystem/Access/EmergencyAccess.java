package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.Emergency;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class EmergencyAccess {
    private final static String INSERT_QUERY = "INSERT INTO tbl_emergency (id, emergency_name, emergency_phoneCode, emergency_phone_number) VALUES (?, ?, ?, ?)";
    private final static String SELECT_BY_ID_QUERY = "SELECT * FROM tbl_emergency WHERE id = ?";

    @Autowired
    JdbcTemplate jdbcTemplate;

    public int insert(Emergency emergencyContact) {
        return jdbcTemplate.update(INSERT_QUERY, emergencyContact.getId(), emergencyContact.getEmergencyName(), emergencyContact.getEmergencyPhoneCode(), emergencyContact.getEmergencyPhoneNumber());
    }

    public Emergency findById(String id) {
        return jdbcTemplate.queryForObject(SELECT_BY_ID_QUERY, new Object[]{id}, new EmergencyContactRowMapper());
    }

    class EmergencyContactRowMapper implements RowMapper<Emergency> {
        @Override
        public Emergency mapRow(ResultSet rs, int rowNum) throws SQLException {
            Emergency emergencyContact = new Emergency();
            emergencyContact.setId(rs.getString("id"));
            emergencyContact.setEmergencyName(rs.getString("emergency_name"));
            emergencyContact.setEmergencyPhoneCode(rs.getString("emergency_phoneCode"));
            emergencyContact.setEmergencyPhoneNumber(rs.getString("emergency_phone_number"));
            return emergencyContact;
        }
    }
}
