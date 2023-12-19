package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.CountryAccess;
import com.example.arilne.reservationsystem.Model.Country;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CountryService implements CountryServiceInterface {
    @Autowired
    CountryAccess countryAccess;

    @Override
    public Map<String, String> getOnCountries() {
        return countryAccess.getOnCountries();
    }

    @Override
    public List<Country> getALlCountries() {
        return countryAccess.getAllCountries();
    }

    @Override
    public boolean updateCountriesStatus(List<Country> countries) {

        List<Country> originCountry = countryAccess.getAllCountries();

        List<Country> changedCountries = countries.stream()
                .filter(country -> {
                    int index = originCountry.indexOf(country);
                    if (index != -1) {
                        return country.getOn_off() != originCountry.get(index).getOn_off();
                    }
                    return false;
                })
                .collect(Collectors.toList());

        if (!changedCountries.isEmpty()) {
            int rowsAffected = countryAccess.updateCountry(changedCountries);

            if (rowsAffected > 0) {
                return true;
            }
        } else {
            throw new IllegalArgumentException("No country need updated");
        }

        return false;
    }
}