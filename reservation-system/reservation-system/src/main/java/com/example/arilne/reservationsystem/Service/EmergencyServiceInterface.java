package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Model.Emergency;
import com.example.arilne.reservationsystem.RequestBody.EmergencyRequestBody;

public interface EmergencyServiceInterface {
    String createEmergencyContact(EmergencyRequestBody emergencyContact);

    Emergency getEmergencyContactById(String id);
}
