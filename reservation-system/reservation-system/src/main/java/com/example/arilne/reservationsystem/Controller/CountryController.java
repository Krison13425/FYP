package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.Model.Country;
import com.example.arilne.reservationsystem.Service.CountryServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/countries")
@CrossOrigin
public class CountryController {

    @Autowired
    CountryServiceInterface countryService;

    @GetMapping("/on")
    public Map<String, String> getOnCountries() {
        return countryService.getOnCountries();
    }

    @GetMapping("/all")
    public List<Country> getAllCountries() {
        return countryService.getALlCountries();
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateCountriesStatus(@RequestBody List<Country> countries) {

        try {
            boolean isEdited = countryService.updateCountriesStatus(countries);

            if (isEdited) {
                return new ResponseEntity<>("Country Status updated successfully.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Unable to update Country Status.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}