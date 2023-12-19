package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Model.Transport;
import com.example.arilne.reservationsystem.RequestBody.TransportRequestBody;

import java.util.List;

public interface TransportServiceInterface {
    Transport getTransportById(String id);

    List<Transport> getAllTransports();

    boolean addTransport(TransportRequestBody transport);

    boolean updateTransport(String id, double price);

    boolean delete(String id);

}
