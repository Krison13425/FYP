package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.TransportationAccess;
import com.example.arilne.reservationsystem.Model.Transport;
import com.example.arilne.reservationsystem.RequestBody.TransportRequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransportService implements TransportServiceInterface {
    @Autowired
    TransportationAccess transportationAccess;


    @Override
    public Transport getTransportById(String id) {
        return transportationAccess.getTransportById(id);
    }

    @Override
    public List<Transport> getAllTransports() {
        return transportationAccess.getAllTransports();
    }

    @Override
    public boolean addTransport(TransportRequestBody transport) {

        String validationMessage = validateTransportData(transport);

        if (validationMessage != null) {
            throw new IllegalArgumentException(validationMessage);
        }

        Transport newTransport = new Transport();

        newTransport.setId(IDGenerator.generateUUID());
        newTransport.setName(transport.getName());
        newTransport.setCapacity(transport.getCapacity());
        newTransport.setType(transport.getType());
        newTransport.setPrice(transport.getPrice());

        int rowsAffected = transportationAccess.createTransport(newTransport);

        if (rowsAffected > 0) {
            return true;
        }
        return false;
    }

    @Override
    public boolean updateTransport(String id, double price) {

        int rowsAffected = 0;

        Transport existingTransport = transportationAccess.getTransportById(id);

        if (existingTransport == null) {
            throw new IllegalArgumentException("No Such Transportation");
        }

        if (price < 0) {
            throw new IllegalArgumentException("Transport Can Price Cannot Be Negative");
        }

        if (existingTransport.getPrice() != price) {
            rowsAffected = transportationAccess.updateTransport(id, price);
        }

        if (rowsAffected > 0) {
            return true;
        }


        return false;
    }

    @Override
    public boolean delete(String id) {


        Transport existingTransport = transportationAccess.getTransportById(id);

        if (existingTransport == null) {
            throw new IllegalArgumentException("No Such Transportation");
        }


        int rowsAffected = transportationAccess.delete(id);


        if (rowsAffected > 0) {
            return true;
        }


        return false;

    }


    private String validateTransportData(TransportRequestBody transport) {
        if (transport == null) {
            return "Transport data is null";
        }

        if (transport.getName() == null || transport.getName().isEmpty()) {
            return "Transport name is empty";
        }

        if (String.valueOf(transport.getType()) == null || String.valueOf(transport.getType()).isEmpty()) {
            return "Transport type is empty";
        }

        if (String.valueOf(transport.getCapacity()) == null) {
            return "Transport capacity is null";
        } else if (transport.getCapacity() <= 0) {
            return "Transport capacity must be greater than 0";
        }

        if (String.valueOf(transport.getPrice()) == null) {
            return "Transport price is null";
        } else if (transport.getPrice() < 0) {
            return "Transport price cannot be negative";
        }

        if (transportationAccess.checkExistingTransport(transport)) {
            return "A transport with the same capacity, price, name, and type already exists";
        }

        return null;
    }
}
