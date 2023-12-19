package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.AirplaneAccess;
import com.example.arilne.reservationsystem.Access.CountryAccess;
import com.example.arilne.reservationsystem.Model.Airplane;
import com.example.arilne.reservationsystem.Model.Country;
import com.example.arilne.reservationsystem.RequestBody.AirplaneRequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AirplaneService implements AirplaneServiceInterface {

    @Autowired
    AirplaneAccess airplaneAccess;
    @Autowired
    CountryAccess countryAccess;


    @Override
    public List<Airplane> getAllAirplanes() {
        return airplaneAccess.getAllAirplanes();
    }

    @Override
    public boolean createAirplane(AirplaneRequestBody airplaneRequestBody) {

        validateAirplaneRequestBody(airplaneRequestBody);

        Airplane existingAirplane = airplaneAccess.findByName(airplaneRequestBody.getName());
        if (existingAirplane != null) {
            throw new IllegalArgumentException("Airplane with the same name already exists");
        }

        Airplane newAirplane = new Airplane();

        newAirplane.setId(IDGenerator.generateUUID());
        newAirplane.setStatus(0);
        newAirplane.setName(airplaneRequestBody.getName());
        newAirplane.setType(airplaneRequestBody.getType());
        newAirplane.setSpeed(airplaneRequestBody.getSpeed());
        newAirplane.setLocation(airplaneRequestBody.getLocation());

        int rowsAffected = airplaneAccess.createAirplane(newAirplane);

        if (rowsAffected > 0) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Airplane getAirplaneById(String Id) {
        Airplane airplane = airplaneAccess.getAirplaneById(Id);
        if (airplane == null) {
            return null;
        }
        return airplane;
    }


    @Override
    public boolean editAirplane(Airplane airplane) {

        Airplane originplane = airplaneAccess.getAirplaneById(airplane.getId());

        if (originplane == null) {
            throw new IllegalArgumentException("No Such Airplane");

        }

        if (originplane.getStatus() != airplane.getStatus()) {

            int rowsAffected = airplaneAccess.updateAirplane(airplane);

            if (rowsAffected > 0) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    @Override
    public boolean deleteAirplane(String Id) {

        Airplane airplane = airplaneAccess.getAirplaneById(Id);
        if (airplane == null) {
            throw new IllegalArgumentException("No Such Airplane");
        }

        int rowsAffected = airplaneAccess.deleteAirplane(Id);

        if (rowsAffected > 0) {
            return true;
        } else {
            return false;
        }

    }

    @Override
    public List<Airplane> getfilteredAirplaneList(String status, String location) {
        return airplaneAccess.getFilteredAirplaneList(status, location);
    }

    @Override
    public Map<String, String> getAirplaneByCountryCode(String location) {
        return airplaneAccess.getAirplaneByLocation(location);
    }


    public void validateAirplaneRequestBody(AirplaneRequestBody airplaneRequestBody) {
        if (airplaneRequestBody == null) {
            throw new IllegalArgumentException("Airplane data is missing");
        }

        if (airplaneRequestBody.getName() == null || airplaneRequestBody.getName().isEmpty()) {
            throw new IllegalArgumentException("Airplane name is missing");
        }

        if (String.valueOf(airplaneRequestBody.getType()).isEmpty() || String.valueOf(airplaneRequestBody.getType()) == null) {
            throw new IllegalArgumentException("Airplane type is missing");
        }

        if (!((airplaneRequestBody.getType() == 0 && airplaneRequestBody.getSpeed() == 840)
                || (airplaneRequestBody.getType() == 1 && airplaneRequestBody.getSpeed() == 860))) {
            throw new IllegalArgumentException("Airplane type & speed value is incorrect");
        }

        if (airplaneRequestBody.getLocation() == null || airplaneRequestBody.getLocation().isEmpty()) {
            throw new IllegalArgumentException("Airplane location is missing");
        }

        Country existingCountry = countryAccess.findOnCountryByCode(airplaneRequestBody.getLocation());
        if (existingCountry == null) {
            throw new IllegalArgumentException("Airplane location is incorrect");
        }
    }

}
