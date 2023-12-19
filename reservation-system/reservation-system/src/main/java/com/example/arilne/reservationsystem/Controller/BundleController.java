package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.Model.Bundle;
import com.example.arilne.reservationsystem.RequestBody.BundleRequestBody;
import com.example.arilne.reservationsystem.Service.BundleServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bundle")
@CrossOrigin
public class BundleController {

    @Autowired
    BundleServiceInterface bundleService;

    @GetMapping("/all")
    public List<Bundle> getAllBundles() {
        return bundleService.getAllBundles();
    }

    @PostMapping("/create")
    public ResponseEntity<String> createBundle(@RequestBody BundleRequestBody bundleRequestBody) {

        try {
            boolean isCreated = bundleService.createBundle(bundleRequestBody);

            if (isCreated) {
                return new ResponseEntity<>("Bundle created successfully.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Unable to create bundle.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/edit")
    public ResponseEntity<String> editBundle(@RequestBody BundleRequestBody bundleRequestBody) {

        try {
            boolean isEdited = bundleService.updateBundle(bundleRequestBody);

            if (isEdited) {
                return new ResponseEntity<>("Bundle edited successfully.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Unable to edit bundle.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bundle> getBundleById(@PathVariable String id) {
        Bundle bundle = bundleService.getBundleById(id);
        if (bundle != null) {
            return ResponseEntity.ok(bundle);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/class")
    public List<Bundle> getBundleByClass(
            @RequestParam(required = false) String flightClass) {
        if (flightClass != null && !flightClass.isBlank()) {
            return bundleService.getBundleByClass(flightClass);
        } else {
            return null;
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAirportByCode(@PathVariable String id) {
        try {
            boolean isDeleted = bundleService.deleteBundle(id);

            if (isDeleted) {
                return new ResponseEntity<>("Bundle deleted successfully.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Unable to delete bundle.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
