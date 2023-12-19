package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.Model.Transport;
import com.example.arilne.reservationsystem.RequestBody.TransportRequestBody;
import com.example.arilne.reservationsystem.Service.TransportServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transports")
@CrossOrigin
public class TransportController {
    @Autowired
    TransportServiceInterface transportService;

    @GetMapping("/{id}")
    public ResponseEntity<Transport> getTransportById(@PathVariable String id) {
        Transport transport = transportService.getTransportById(id);
        if (transport != null) {
            return new ResponseEntity<>(transport, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Transport>> getAllTransports() {
        List<Transport> transports = transportService.getAllTransports();
        return new ResponseEntity<>(transports, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<String> addTransport(@RequestBody TransportRequestBody transportRequestBody) {

        try {
            boolean isCreated = transportService.addTransport(transportRequestBody);

            if (isCreated) {
                return new ResponseEntity<>("Transport created successfully.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Unable to transport flight.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    @PutMapping("/edit")
    public ResponseEntity<String> updateTransport(@RequestParam String id, @RequestParam double price) {

        try {
            boolean isEdited = transportService.updateTransport(id, price);

            if (isEdited) {
                return new ResponseEntity<>("Transport price updated successfully.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Unable to update transport price.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/delete")
    public ResponseEntity<String> deleteTransport(@RequestParam String id) {

        try {
            boolean isEdited = transportService.delete(id);

            if (isEdited) {
                return new ResponseEntity<>("Transport price deleted successfully.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Unable to date transport.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
