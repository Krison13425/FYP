package com.example.arilne.reservationsystem.auth;

import com.example.arilne.reservationsystem.Model.User;
import com.example.arilne.reservationsystem.RequestBody.PasswordResetRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.view.RedirectView;

import java.security.GeneralSecurityException;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin
public class AuthenticationController {

    @Autowired
    private AuthenticationService service;

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        service.authenticate(request);
        return ResponseEntity.ok(service.authenticate(request));
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthenticationRequest request) {
        try {
            User registeredUser = service.registerUser(request);
            return ResponseEntity.ok(registeredUser);
        } catch (ResponseStatusException ex) {
            HttpStatus status = (HttpStatus) ex.getStatusCode();
            String errorMessage = ex.getReason();

            return ResponseEntity.status(status).body(errorMessage);
        }
    }


    @PostMapping("/userAuthenticate")
    public ResponseEntity<AuthenticationResponse> userAuthenticate(@RequestBody AuthenticationRequest request) {
        try {
            AuthenticationResponse response = service.userAuthenticate(request);
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException ex) {

            HttpStatus status = (HttpStatus) ex.getStatusCode();
            String errorMessage = ex.getReason();


            AuthenticationResponse errorResponse = new AuthenticationResponse();
            errorResponse.setMessage(errorMessage);

            return ResponseEntity.status(status).body(errorResponse);
        }
    }

    @GetMapping("/verify-email")
    public RedirectView verifyEmail(@RequestParam String token) {
        boolean isEmailVerified = service.verifyToken(token);

        if (isEmailVerified) {
            return new RedirectView("http://localhost:3000/UserLogin");
        } else {
            return new RedirectView("http://localhost:3000/VerificationFailed");
        }
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<String> createPasswordResetToken(@RequestParam String email) {
        service.createPasswordResetToken(email);
        return new ResponseEntity<>("Reset token has been sent to your email", HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequest request) {
        service.resetPassword(request.getEmail(), request.getNewPassword(), request.getToken());
        return new ResponseEntity<>("Password has been reset", HttpStatus.OK);
    }


    @PostMapping("/userAuthenticate/google")
    public ResponseEntity<?> authenticateWithGoogle(@RequestParam String token) {
        try {
            if (token == null || token.isEmpty()) {
                return ResponseEntity.badRequest().body("Token must not be null or empty.");
            }
            AuthenticationResponse response = service.authenticateWithGoogle(token);
            return ResponseEntity.ok(response);
        } catch (GeneralSecurityException e) {
            return ResponseEntity.badRequest().body("Invalid Google token.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }

}
