package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.Service.PdfCreator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/pdf")
public class DownloadController {

    @Autowired
    PdfCreator pdfCreator;

    @GetMapping(value = "/{bookingId}/itinerary", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getBookingItinerary(@PathVariable String bookingId) throws IOException {
        byte[] contents = pdfCreator.createPdf(bookingId);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=Itinerary.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(contents);
    }
}
