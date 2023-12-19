package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.AirportAccess;
import com.example.arilne.reservationsystem.Access.CountryAccess;
import com.example.arilne.reservationsystem.Model.Airport;
import com.example.arilne.reservationsystem.Model.Country;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class AirportService implements AirportServiceInterface {

    private static final String create = "CREATE";
    private static final String edit = "EDIT";
    @Autowired
    AirportAccess airportAccess;
    @Autowired
    CountryAccess countryAccess;

    @Override
    public Map<String, String> getAllAirportCode() {
        Map<String, String> airportCodeMap = airportAccess.getAllAirportCode();

        Map<String, String> sortedAirportCodeMap = new TreeMap<>(airportCodeMap);

        return sortedAirportCodeMap;
    }

    @Override
    public Map<String, String> getAllAirportName() {
        Map<String, String> airportNameMap = airportAccess.getAllAirportName();

        return airportNameMap;
    }

    @Override
    public List<Airport> getAllAirportList() {
        return airportAccess.getAllAirport();
    }

    @Override
    public boolean createAirport(Airport airport) {

        validateAirport(airport, create);

        int rowsAffected = airportAccess.createAirport(airport);

        if (rowsAffected > 0) {
            return true;
        }

        return false;
    }

    @Override
    public List<Airport> getfilteredAirportList(String location) {
        return airportAccess.getAirportByLocation(location);
    }

    @Override
    public Airport getAiportByCode(String code) {
        Airport airport = airportAccess.getAirportDetails(code);

        if (airport == null) {
            return null;
        }

        return airport;
    }

    @Override
    public boolean editAirport(Airport updatedAirport) {

        validateAirport(updatedAirport, edit);

        Airport originAirport = airportAccess.getAirportDetails(updatedAirport.getCode());
        if (originAirport == null) {
            throw new IllegalArgumentException("No Such Airport");
        }

        int rowsAffected = airportAccess.updateAirport(originAirport, updatedAirport);

        if (rowsAffected > 0) {
            return true;
        }

        return false;
    }

    @Override
    public boolean deleteAirport(String code) {

        Airport existingAirport = airportAccess.getAirportDetails(code);

        if (existingAirport == null) {
            throw new IllegalArgumentException("No Such Airport");
        }

        int rowsAffected = airportAccess.deleteAirplane(code);

        if (rowsAffected > 0) {
            return true;
        }

        return false;
    }

    @Override
    public boolean validateAirport(String departureAirport, String arrivalAirport) {

        if (departureAirport == null || arrivalAirport == null) {
            throw new IllegalArgumentException("Airport data is missing");
        }

        Airport existingDepartureAirport = airportAccess.getAirportDetails(departureAirport);
        Airport existingArrivalAirport = airportAccess.getAirportDetails(arrivalAirport);

        if (existingDepartureAirport == null || existingArrivalAirport == null) {
            return false;
        }

        return true;
    }

    @Override
    public String getAirportCountryCode(String departureAirportCode, String arrivalAirportCode) {

        Airport departureAirport = airportAccess.getAirportDetails(departureAirportCode);
        Airport arrivalAirport = airportAccess.getAirportDetails(arrivalAirportCode);

        if (departureAirport.getCountry_code().equals("MY") && arrivalAirport.getCountry_code().equals("MY")) {
            return arrivalAirport.getCountry_code();
        } else {
            if (!departureAirport.getCountry_code().equals("MY")) {
                return departureAirport.getCountry_code();
            }
            if (!arrivalAirport.getCountry_code().equals("MY")) {
                return arrivalAirport.getCountry_code();
            }
        }

        return null;
    }


    public void validateAirport(Airport airport, String type) {

        if (airport == null) {
            throw new IllegalArgumentException("Airport data is missing");
        }

        if (airport.getCode() == null || airport.getCode().isEmpty()) {
            throw new IllegalArgumentException("Airport IATA Code is missing");
        }

        if (airport.getName() == null || airport.getName().isEmpty()) {
            throw new IllegalArgumentException("Airport name is missing");
        }

        if (airport.getMunicipal() == null || airport.getMunicipal().isEmpty()) {
            throw new IllegalArgumentException("Airport municipal is missing");
        }

        if (airport.getCountry_code() == null || airport.getCountry_code().isEmpty()) {
            throw new IllegalArgumentException("Airport country is missing");
        }

        if (airport.getAddress() == null || airport.getAddress().isEmpty()) {
            throw new IllegalArgumentException("Airport address is missing");
        }

        if (airport.getPhone() == null || airport.getPhone().isEmpty()) {
            throw new IllegalArgumentException("Airport phone is missing");
        }

        if (Double.isNaN(airport.getLatitude()) || airport.getLatitude() < -90 || airport.getLatitude() > 90) {
            throw new IllegalArgumentException("Invalid latitude. It must be a number between -90 and 90.");
        }

        if (Double.isNaN(airport.getLongitude()) || airport.getLongitude() < -180 || airport.getLongitude() > 180) {
            throw new IllegalArgumentException("Invalid longitude. It must be a number between -180 and 180.");
        }

        if (!airport.getPhone().matches("^\\+?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$") || airport.getPhone().length() < 7 || airport.getPhone().length() > 20) {
            throw new IllegalArgumentException("Invalid phone number. It should only contain digits, hyphens, spaces, parentheses, and plus sign, and be between 7 and 20 characters long.");
        }

        String formattedAirportName = airport.getName();
        if (airport.getCountry_code().equals("MY")) {
            if (!formattedAirportName.toLowerCase().contains("airport")) {
                formattedAirportName += " Airport";
            }
        } else {
            if (!formattedAirportName.toLowerCase().contains("international")) {
                formattedAirportName += " International";
            }
            if (!formattedAirportName.toLowerCase().contains("airport")) {
                formattedAirportName += " Airport";
            }
        }

        if (type.toLowerCase().equals(create)) {
            Airport existingAirport = airportAccess.getAirportDetails(airport.getCode());
            if (existingAirport != null) {
                throw new IllegalArgumentException("Airport Code is already exits");
            }
        }

        Country existingCountry = countryAccess.findOnCountryByCode(airport.getCountry_code());
        if (existingCountry == null) {
            throw new IllegalArgumentException("Airport Country is invalid");
        }

        if (!airport.getCode().matches("^[A-Z]{3}$")) {
            throw new IllegalArgumentException("Airport IATA Code is invalid");
        }
    }

}
