package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.Model.Emergency;
import com.example.arilne.reservationsystem.RequestBody.EmergencyRequestBody;
import com.example.arilne.reservationsystem.Service.EmergencyServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emergency")
public class EmergencyController {
    @Autowired
    EmergencyServiceInterface emergencyService;

    @PostMapping("/create")
    public ResponseEntity<String> createEmergencyContact(@RequestBody EmergencyRequestBody emergencyContact) {
        try {
            String emergencyId = emergencyService.createEmergencyContact(emergencyContact);
            return new ResponseEntity<>(emergencyId, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping("/{id}")
    public Emergency getEmergencyContactById(@PathVariable String id) {
        return emergencyService.getEmergencyContactById(id);
    }
}
