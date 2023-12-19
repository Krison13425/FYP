package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class TransactionAccess {
    private static final String SEARCH_TRANSACTION_BY_ID = "SELECT * FROM tbl_transactions WHERE id = ?";
    private static final String INSERT_TRANSACTION = "INSERT INTO tbl_transactions (id, transaction_id, total_amount, points) VALUES (?, ?, ?, ?)";
    private static final String GET_ALL_TRANSACTIONS = "SELECT * FROM transactions";
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Transaction getTransactionById(String transactionId) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_TRANSACTION_BY_ID, new Object[]{transactionId}, new TransactionRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public List<Transaction> getAllTransactions() {
        try {
            return jdbcTemplate.query(GET_ALL_TRANSACTIONS, new TransactionRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int createTransaction(Transaction transaction) {
        try {
            return jdbcTemplate.update(
                    INSERT_TRANSACTION,
                    transaction.getId(),
                    transaction.getTransactionId(),
                    transaction.getTotalAmount(),
                    transaction.getPoints()
            );
        } catch (EmptyResultDataAccessException e) {
            return 0;
        }
    }

    private static class TransactionRowMapper implements RowMapper<Transaction> {
        public Transaction mapRow(ResultSet rs, int rowNum) throws SQLException {
            Transaction transaction = new Transaction();
            transaction.setId(rs.getString("id"));
            transaction.setTransactionId(rs.getString("transaction_id"));
            transaction.setTotalAmount(rs.getDouble("total_amount"));
            transaction.setPoints(rs.getInt("points"));
            return transaction;
        }
    }
}
