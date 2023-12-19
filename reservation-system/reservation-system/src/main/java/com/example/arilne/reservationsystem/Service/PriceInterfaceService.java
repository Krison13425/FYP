package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.RequestBody.PriceRequest;

import java.math.BigDecimal;

public interface PriceInterfaceService {

    BigDecimal calculateTotalPrice(PriceRequest priceRequest);

    BigDecimal calculateExtraPrice(BigDecimal totalPrice, String baggageId, String flightId);

    BigDecimal calculateExtraPriceChange(BigDecimal totalPrice, String baggageId, String fightId);

}


