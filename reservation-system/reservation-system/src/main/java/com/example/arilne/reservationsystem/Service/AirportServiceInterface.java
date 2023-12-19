package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Model.Airport;

import java.util.List;
import java.util.Map;

public interface AirportServiceInterface {

    public Map<String, String> getAllAirportCode();

    public Map<String, String> getAllAirportName();

    public List<Airport> getAllAirportList();

    public boolean createAirport(Airport airport);

    public List<Airport> getfilteredAirportList(String location);

    public Airport getAiportByCode(String location);

    public boolean editAirport(Airport airport);

    public boolean deleteAirport(String code);

    public boolean validateAirport(String departureAirport, String arrivalAirport);

    public String getAirportCountryCode(String departureAirport, String arrivalAirport);

}
