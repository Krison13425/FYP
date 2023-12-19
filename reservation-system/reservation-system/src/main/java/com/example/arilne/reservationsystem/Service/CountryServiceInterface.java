package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Model.Country;

import java.util.List;
import java.util.Map;

public interface CountryServiceInterface {

    public Map<String, String> getOnCountries();

    public List<Country> getALlCountries();

    public boolean updateCountriesStatus(List<Country> countries);
}
