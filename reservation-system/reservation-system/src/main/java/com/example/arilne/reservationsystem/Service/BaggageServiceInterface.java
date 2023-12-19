package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Model.Baggage;
import com.example.arilne.reservationsystem.RequestBody.BaggageRequestBody;

import java.util.List;

public interface BaggageServiceInterface {

    boolean createBaggage(BaggageRequestBody baggageRequestBody);

    List<Baggage> getAllBaggages();

    Baggage getBaggageById(String id);

    boolean updateBaggage(BaggageRequestBody baggageRequestBody);

    boolean deleteBaggage(String id);
}
