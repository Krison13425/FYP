package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.TransactionAccess;
import com.example.arilne.reservationsystem.Model.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService implements TransactionServiceInterface {

    @Autowired
    TransactionAccess transactionAccess;

    public static void validateTransactionRequestBody(TransactionRequestBody transactionRequestBody) {
        if (transactionRequestBody == null) {
            throw new IllegalArgumentException("Transaction data is missing");
        }

        if (transactionRequestBody.getRootAmount() <= 0) {
            throw new IllegalArgumentException("Invalid root transaction amount");
        }

        if (transactionRequestBody.getTransactionId() == null || transactionRequestBody.getTransactionId().isEmpty()) {
            throw new IllegalArgumentException("Transaction ID is missing");
        }

    }


    @Override
    public String createTransaction(TransactionRequestBody transactionRequestBody) {

        validateTransactionRequestBody(transactionRequestBody);


        Transaction newTransaction = new Transaction();

        newTransaction.setId(IDGenerator.generateUUID());
        newTransaction.setTransactionId(transactionRequestBody.getTransactionId());
        newTransaction.setTotalAmount(transactionRequestBody.getRootAmount());
        newTransaction.setPoints(Integer.valueOf((int) transactionRequestBody.getRootAmount()));


        int rowsAffected = transactionAccess.createTransaction(newTransaction);

        if (rowsAffected > 0) {
            return newTransaction.getId();
        }

        return null;
    }

    @Override
    public List<Transaction> getAllTransactions() {
        return transactionAccess.getAllTransactions();
    }

    @Override
    public Transaction getTransactionById(String id) {
        return transactionAccess.getTransactionById(id);
    }


}
