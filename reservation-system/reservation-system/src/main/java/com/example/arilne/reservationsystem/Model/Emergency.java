package com.example.arilne.reservationsystem.Model;

public class Emergency {
    private String id;
    private String emergencyName;
    private String emergencyPhoneCode;
    private String emergencyPhoneNumber;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmergencyName() {
        return emergencyName;
    }

    public void setEmergencyName(String emergencyName) {
        this.emergencyName = emergencyName;
    }

    public String getEmergencyPhoneCode() {
        return emergencyPhoneCode;
    }

    public void setEmergencyPhoneCode(String emergencyPhoneCode) {
        this.emergencyPhoneCode = emergencyPhoneCode;
    }

    public String getEmergencyPhoneNumber() {
        return emergencyPhoneNumber;
    }

    public void setEmergencyPhoneNumber(String emergencyPhoneNumber) {
        this.emergencyPhoneNumber = emergencyPhoneNumber;
    }
}
