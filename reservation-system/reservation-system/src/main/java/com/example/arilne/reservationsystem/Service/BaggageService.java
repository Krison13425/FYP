package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.BaggageAccess;
import com.example.arilne.reservationsystem.Model.Baggage;
import com.example.arilne.reservationsystem.RequestBody.BaggageRequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BaggageService implements BaggageServiceInterface {

    @Autowired
    BaggageAccess baggageAccess;

    @Override
    public boolean createBaggage(BaggageRequestBody baggageRequestBody) {

        validateBaggageRequestBody(baggageRequestBody);

        Baggage existingBaggage = baggageAccess.getBaggageByName(baggageRequestBody.getName());
        if (existingBaggage != null) {
            throw new IllegalArgumentException("Baggage with the same name already exists");
        }

        Baggage newBaggage = new Baggage();

        newBaggage.setId(IDGenerator.generateUUID());
        newBaggage.setName(baggageRequestBody.getName());
        newBaggage.setKg(baggageRequestBody.getKg());
        newBaggage.setDomesticPrice(baggageRequestBody.getDomesticPrice());
        newBaggage.setInternationalPrice(baggageRequestBody.getInternationalPrice());


        int rowsAffected = baggageAccess.createBaggage(newBaggage);

        if (rowsAffected > 0) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<Baggage> getAllBaggages() {
        return baggageAccess.getAllBaggage();
    }

    @Override
    public Baggage getBaggageById(String id) {
        return baggageAccess.getBaggageById(id);
    }

    @Override
    public boolean updateBaggage(BaggageRequestBody baggageRequestBody) {

        validateBaggageRequestBody(baggageRequestBody);

        Baggage origineBaggage = baggageAccess.getBaggageByName(baggageRequestBody.getName());
        if (origineBaggage == null) {
            throw new IllegalArgumentException("No Such Baggage");
        }
        
        int rowsAffected = baggageAccess.updateBaggage(origineBaggage, baggageRequestBody);

        if (rowsAffected > 0) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public boolean deleteBaggage(String id) {
        Baggage existingBaggage = baggageAccess.getBaggageById(id);
        if (existingBaggage == null) {
            throw new IllegalArgumentException("No Such Baggage");
        }

        int rowsAffected = baggageAccess.deleteBaggage(id);

        if (rowsAffected > 0) {
            return true;
        } else {
            return false;
        }
    }

    public void validateBaggageRequestBody(BaggageRequestBody baggageRequestBody) {

        if (baggageRequestBody == null) {
            throw new IllegalArgumentException("Baggage data is missing");
        }

        if (baggageRequestBody.getName() == null || baggageRequestBody.getName().isEmpty()) {
            throw new IllegalArgumentException("Baggage name is missing");
        }

        if (String.valueOf(baggageRequestBody.getKg()) == null || String.valueOf(baggageRequestBody.getKg()).isEmpty()) {
            throw new IllegalArgumentException("Baggage KG is missing");
        }

        if (String.valueOf(baggageRequestBody.getDomesticPrice()) == null || String.valueOf(baggageRequestBody.getDomesticPrice()).isEmpty()) {
            throw new IllegalArgumentException("Baggage Domestic Price is missing");
        }

        if (String.valueOf(baggageRequestBody.getInternationalPrice()) == null || String.valueOf(baggageRequestBody.getInternationalPrice()).isEmpty()) {
            throw new IllegalArgumentException("Baggage International Price is missing");
        }
    }
}
