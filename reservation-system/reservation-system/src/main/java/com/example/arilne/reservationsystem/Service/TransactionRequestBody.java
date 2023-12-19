package com.example.arilne.reservationsystem.Service;

public class TransactionRequestBody {
    private double rootAmount;
    private String transactionId;

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public double getRootAmount() {
        return rootAmount;
    }

    public void setRootAmount(double rootAmount) {
        this.rootAmount = rootAmount;
    }

}
