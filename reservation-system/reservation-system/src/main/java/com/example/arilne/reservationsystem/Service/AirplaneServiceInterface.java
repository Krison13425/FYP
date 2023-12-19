package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Model.Airplane;
import com.example.arilne.reservationsystem.RequestBody.AirplaneRequestBody;

import java.util.List;
import java.util.Map;

public interface AirplaneServiceInterface {
    public List<Airplane> getAllAirplanes();

    public boolean createAirplane(AirplaneRequestBody airplaneRequestBody);

    public Airplane getAirplaneById(String id);

    public boolean editAirplane(Airplane airplane);

    public boolean deleteAirplane(String Id);

    public List<Airplane> getfilteredAirplaneList(String status, String location);

    public Map<String, String> getAirplaneByCountryCode(String countryCode);
}
