package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.Service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    EmailService emailService;

    @GetMapping("/send")
    public ResponseEntity<String> sendEmailWithAttachment(@RequestParam String bookingId) {
        try {
            emailService.sendEmailWithAttachment(bookingId);
            return ResponseEntity.ok("Sent message successfully....");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + ex.getMessage());
        }
    }
}
