package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Model.Transaction;

import java.util.List;

public interface TransactionServiceInterface {
    String createTransaction(TransactionRequestBody transactionRequestBody);

    List<Transaction> getAllTransactions();

    Transaction getTransactionById(String id);

}
