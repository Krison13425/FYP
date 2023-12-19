package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.Model.Transaction;
import com.example.arilne.reservationsystem.Service.TransactionRequestBody;
import com.example.arilne.reservationsystem.Service.TransactionServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    @Autowired
    TransactionServiceInterface transactionService;


    @GetMapping
    public ResponseEntity<List<Transaction>> findAll() {
        return new ResponseEntity<>(transactionService.getAllTransactions(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> findById(@PathVariable String id) {
        return new ResponseEntity<>(transactionService.getTransactionById(id), HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<String> save(@RequestBody TransactionRequestBody transaction) {
        try {
            String id = transactionService.createTransaction(transaction);
            return new ResponseEntity<>(id, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
