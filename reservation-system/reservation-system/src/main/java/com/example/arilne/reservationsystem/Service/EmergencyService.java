package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.CountryAccess;
import com.example.arilne.reservationsystem.Access.EmergencyAccess;
import com.example.arilne.reservationsystem.Model.Emergency;
import com.example.arilne.reservationsystem.RequestBody.EmergencyRequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmergencyService implements EmergencyServiceInterface {
    @Autowired
    EmergencyAccess emergencyAccess;

    @Autowired
    CountryAccess countryAccess;

    @Override
    public String createEmergencyContact(EmergencyRequestBody emergencyContact) {

        if (emergencyContact.getEmergencyName() == null || emergencyContact.getEmergencyName().isEmpty()) {
            throw new IllegalArgumentException("Emergency name is required.");
        }
        if (emergencyContact.getEmergencyPhoneCode() == null || emergencyContact.getEmergencyPhoneCode().isEmpty()) {
            throw new IllegalArgumentException("Emergency phone code is required.");
        }
        if (emergencyContact.getEmergencyPhoneNumber() == null || emergencyContact.getEmergencyPhoneNumber().isEmpty()) {
            throw new IllegalArgumentException("Emergency phone number is required.");
        }
        Emergency newEmergency = new Emergency();

        newEmergency.setId(IDGenerator.generateUUID());
        newEmergency.setEmergencyName(emergencyContact.getEmergencyName());

        String phoneCode = null;
        if (emergencyContact.getEmergencyPhoneCode() != null) {
            phoneCode = String.valueOf(countryAccess.getPhoneCountryByCode(emergencyContact.getEmergencyPhoneCode()));
        }

        newEmergency.setEmergencyPhoneCode(phoneCode);
        newEmergency.setEmergencyPhoneNumber(emergencyContact.getEmergencyPhoneNumber());


        int rowsAffected = emergencyAccess.insert(newEmergency);

        if (rowsAffected > 0) {
            return newEmergency.getId();
        }

        return null;
    }

    @Override
    public Emergency getEmergencyContactById(String id) {
        return emergencyAccess.findById(id);
    }
}
