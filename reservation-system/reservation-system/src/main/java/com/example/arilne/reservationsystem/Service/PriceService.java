package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.BaggageAccess;
import com.example.arilne.reservationsystem.Access.BundleAccess;
import com.example.arilne.reservationsystem.Access.FlightAccess;
import com.example.arilne.reservationsystem.Model.Baggage;
import com.example.arilne.reservationsystem.Model.Bundle;
import com.example.arilne.reservationsystem.Model.Flight;
import com.example.arilne.reservationsystem.RequestBody.FlightDetails;
import com.example.arilne.reservationsystem.RequestBody.PassengerDetails;
import com.example.arilne.reservationsystem.RequestBody.PriceRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PriceService implements PriceInterfaceService {

    @Autowired
    FlightAccess flightAccess;
    @Autowired
    BundleAccess bundleAccess;

    @Autowired
    BaggageAccess baggageAccess;


    @Override
    public BigDecimal calculateTotalPrice(PriceRequest priceRequest) {
        BigDecimal totalPrice = BigDecimal.ZERO;

        if (priceRequest == null || priceRequest.getFlightDetails() == null) {
            return BigDecimal.ZERO;
        }

        for (FlightDetails flightDetail : priceRequest.getFlightDetails()) {

            if (flightDetail == null) {
                continue;
            }

            Flight flight = flightAccess.getFlightById(flightDetail.getFlightId());

            Bundle bundle = bundleAccess.getBundleById(flightDetail.getBundleId());

            BigDecimal flightPrice = BigDecimal.ZERO;
            BigDecimal bundlePrice = BigDecimal.ZERO;

            if ("Economy".equalsIgnoreCase(flightDetail.getFlightClass())) {
                flightPrice = BigDecimal.valueOf(flight.getEconomy_price());

                if (flight.getFlight_type() == 0) {
                    bundlePrice = BigDecimal.valueOf(bundle.getDomesticPrice());
                } else {
                    bundlePrice = BigDecimal.valueOf(bundle.getInternationalPrice());
                }
            } else {
                flightPrice = BigDecimal.valueOf(flight.getBusiness_price());

                if (flight.getFlight_type() == 0) {
                    bundlePrice = BigDecimal.valueOf(bundle.getDomesticPrice());
                } else {
                    bundlePrice = BigDecimal.valueOf(bundle.getInternationalPrice());
                }
            }

            for (PassengerDetails passengerDetail : priceRequest.getPassengerDetails()) {
                BigDecimal discountRate = BigDecimal.ZERO;
                BigDecimal finalPrice = flightPrice;

                if ("Child".equalsIgnoreCase(passengerDetail.getPassengerType())) {
                    discountRate = new BigDecimal("0.2");
                    finalPrice = finalPrice.add(bundlePrice);
                } else if ("Baby".equalsIgnoreCase(passengerDetail.getPassengerType())) {
                    discountRate = new BigDecimal("0.9");
                } else {
                    finalPrice = finalPrice.add(bundlePrice);
                }

                BigDecimal passengerCount = new BigDecimal(passengerDetail.getPassengerCount());

                BigDecimal discountedPrice = finalPrice.multiply(BigDecimal.ONE.subtract(discountRate));
                totalPrice = totalPrice.add(discountedPrice.multiply(passengerCount));
            }
        }

        return totalPrice;
    }

    @Override
    public BigDecimal calculateExtraPrice(BigDecimal basePrice, String baggageId, String flightId) {
        BigDecimal extraPrice = BigDecimal.ZERO;

        if (basePrice != null) {
            Baggage baggage = baggageAccess.getBaggageById(baggageId);
            Flight flight = flightAccess.getFlightById(flightId);

            if (baggage != null && flight != null) {
                if (flight.getFlight_type() == 0) {
                    extraPrice = BigDecimal.valueOf(baggage.getDomesticPrice());
                } else {
                    extraPrice = BigDecimal.valueOf(baggage.getInternationalPrice());
                }
            }
        }

        return basePrice.add(extraPrice);
    }

    @Override
    public BigDecimal calculateExtraPriceChange(BigDecimal basePrice, String baggageId, String flightId) {
        BigDecimal extraPrice = BigDecimal.ZERO;

        if (basePrice != null) {
            Baggage baggage = baggageAccess.getBaggageById(baggageId);
            Flight flight = flightAccess.getFlightById(flightId);

            if (baggage != null && flight != null) {
                if (flight.getFlight_type() == 0) {
                    extraPrice = BigDecimal.valueOf(baggage.getDomesticPrice());
                } else {
                    extraPrice = BigDecimal.valueOf(baggage.getInternationalPrice());
                }
            }

            basePrice = basePrice.subtract(extraPrice);
        }

        return basePrice;
    }


}
