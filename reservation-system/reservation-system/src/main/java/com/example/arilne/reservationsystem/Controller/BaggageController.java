package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.Model.Baggage;
import com.example.arilne.reservationsystem.RequestBody.BaggageRequestBody;
import com.example.arilne.reservationsystem.Service.BaggageServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/baggage")
@CrossOrigin
public class BaggageController {

    @Autowired
    BaggageServiceInterface baggageService;

    @GetMapping("/all")
    public List<Baggage> getAllBundles() {
        return baggageService.getAllBaggages();
    }

    @PostMapping("/create")
    public ResponseEntity<String> createBaggage(@RequestBody BaggageRequestBody baggageRequestBody) {

        try {
            boolean isCreated = baggageService.createBaggage(baggageRequestBody);

            if (isCreated) {
                return new ResponseEntity<>("Baggage created successfully.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Unable to create baggage.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/edit")
    public ResponseEntity<String> editBaggage(@RequestBody BaggageRequestBody baggageRequestBody) {

        try {
            boolean isEdited = baggageService.updateBaggage(baggageRequestBody);

            if (isEdited) {
                return new ResponseEntity<>("Baggage edited successfully.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Unable to edit baggage.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Baggage> getBaggageById(@PathVariable String id) {
        Baggage baggage = baggageService.getBaggageById(id);
        if (baggage != null) {
            return ResponseEntity.ok(baggage);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteBaggageById(@PathVariable String id) {
        try {
            boolean isDeleted = baggageService.deleteBaggage(id);

            if (isDeleted) {
                return new ResponseEntity<>("Baggage deleted successfully.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Unable to delete baggage.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
