package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.RequestBody.PriceRequest;
import com.example.arilne.reservationsystem.Service.PriceInterfaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/price")
@CrossOrigin
public class PriceController {
    @Autowired
    PriceInterfaceService priceService;


    @PostMapping("/calculate")
    public ResponseEntity<BigDecimal> calculatePrice(@RequestBody PriceRequest priceRequest) {
        BigDecimal totalPrice = priceService.calculateTotalPrice(priceRequest);
        return ResponseEntity.ok(totalPrice);
    }

    @GetMapping("/calculate/extra")
    public ResponseEntity<BigDecimal> calculateExtraPrice
            (@RequestParam(required = false) BigDecimal price,
             @RequestParam(required = false) String baggageId,
             @RequestParam(required = false) String flightId
            ) {
        BigDecimal totalPrice;

        if (price != null && baggageId != null && flightId != null) {
            totalPrice = priceService.calculateExtraPrice(price, baggageId, flightId);
            return ResponseEntity.ok(totalPrice);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/calculate/extra/change")
    public ResponseEntity<BigDecimal> calculateExtraPriceChange
            (@RequestParam(required = false) BigDecimal price,
             @RequestParam(required = false) String baggageId,
             @RequestParam(required = false) String flightId
            ) {
        BigDecimal totalPrice;

        if (price != null && baggageId != null && flightId != null) {
            totalPrice = priceService.calculateExtraPriceChange(price, baggageId, flightId);
            return ResponseEntity.ok(totalPrice);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

}