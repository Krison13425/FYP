package com.example.arilne.reservationsystem.Controller;


import com.example.arilne.reservationsystem.Model.UserDetails;
import com.example.arilne.reservationsystem.Model.UserDetailsRequestBody;
import com.example.arilne.reservationsystem.Service.UserServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserServiceInterface userService;


    @GetMapping("/{id}")
    public ResponseEntity<UserDetails> getUserDetails(@PathVariable("id") String id) {

        UserDetails userDetails = userService.getUserDetails(id);

        if (userDetails != null) {
            return ResponseEntity.ok(userDetails);
        } else {
            return ResponseEntity.ok(userDetails);
        }
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateUser(@PathVariable("id") String id, @RequestBody UserDetailsRequestBody userDetailsRequestBody) {

        boolean userDetailsUpdated = userService.updateUser(id, userDetailsRequestBody);

        if (userDetailsUpdated) {
            return ResponseEntity.ok("User Details updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update user details");
        }
    }


    public boolean isNullOrEmpty(String data) {

        return data == null || data.trim().isEmpty();
    }
}
