package com.example.arilne.reservationsystem.auth;

import com.example.arilne.reservationsystem.Access.UserAccess;
import com.example.arilne.reservationsystem.Model.User;
import com.example.arilne.reservationsystem.Service.EmailService;
import com.example.arilne.reservationsystem.Service.IDGenerator;
import com.example.arilne.reservationsystem.config.JwtService;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthenticationService {

    private static final String CLIENT_ID = "738533525256-jorjtsdk4jnjp7dla79a1umkn4svma97.apps.googleusercontent.com";
    private final String GOOGLE_USER_INFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/tokeninfo";
    @Autowired
    UserAccess userAccess;
    @Autowired
    EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid username or password"
            );
        }

        User user = userAccess.findUserByName(request.getUsername());
        var jwtToken = jwtService.generateToken(user);

        AuthenticationResponse response = new AuthenticationResponse();
        response.setToken(jwtToken);
        response.setRole(user.getUserType());
        response.setId(user.getUserId());
        return response;
    }

    public AuthenticationResponse userAuthenticate(AuthenticationRequest request) {
        User user = userAccess.findUserByName(request.getUsername());

        if (user != null && !user.isEmailVerified()) {
            AuthenticationResponse response = new AuthenticationResponse();
            response.setMessage("Email not verified");
            return response;
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid username or password"
            );
        }

        var jwtToken = jwtService.generateToken(user);

        AuthenticationResponse response = new AuthenticationResponse();
        response.setToken(jwtToken);
        response.setRole(user.getUserType());
        response.setId(user.getUserId());
        response.setEmail(user.getUserEmail());
        response.setLoginType(0);
        return response;
    }

    public AuthenticationResponse authenticateWithGoogle(String googleToken) throws Exception {
        String email = getEmailFromAccessToken(googleToken);

        User user = userAccess.findUserByName(email);

        if (user == null) {
            user = new User();
            user.setUserId(IDGenerator.generateUUID());
            user.setUserEmail(email);
            user.setUserName(email);
            user.setEmailVerified(true);
            user.setPassword(null);
            user.setUserType(0);

            userAccess.save(user);
        }

        var jwtToken = jwtService.generateToken(user);

        AuthenticationResponse response = new AuthenticationResponse();
        response.setToken(jwtToken);
        response.setRole(user.getUserType());
        response.setId(user.getUserId());
        response.setEmail(user.getUserEmail());
        response.setLoginType(1);
        return response;
    }

    private String getEmailFromAccessToken(String accessToken) throws IOException {

        URL url = new URL(GOOGLE_USER_INFO_ENDPOINT + "?access_token=" + accessToken);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");

        int responseCode = conn.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) { // success
            try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                JsonParser parser = new JsonParser();
                JsonObject jsonObject = parser.parse(in).getAsJsonObject();
                return jsonObject.get("email").getAsString();
            } catch (Exception e) {
                throw new IOException("Failed to parse JSON response.", e);
            }
        } else {
            throw new IOException("Failed to get user email from Google with provided access token.");
        }
    }


    public User registerUser(AuthenticationRequest request) {
        User existingUser = userAccess.findUserByName(request.getUsername());

        if (existingUser != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "User with this email already exists."
            );
        }

        User newUser = new User();
        newUser.setUserId(IDGenerator.generateUUID());
        newUser.setUserName(request.getUsername());
        newUser.setUserEmail(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setUserType(0);
        newUser.setEmailVerified(false);
        newUser.setVerificationToken(IDGenerator.generateUUID());


        boolean success = userAccess.save(newUser);
        if (!success) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save new user."
            );
        }

        try {
            emailService.sendVerificationEmail(newUser);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Failed to send verification email."
            );
        }

        return newUser;

    }

    public boolean verifyToken(String token) {
        User user = userAccess.findUserByToken(token);
        if (user != null) {
            user.setEmailVerified(true);
            boolean success = userAccess.updateEmailVerificationStatus(user);
            if (!success) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update email verification status."
                );
            }
            return true;
        } else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Invalid token."
            );
        }
    }


    public void createPasswordResetToken(String email) {
        User user = userAccess.findUserByName(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        if (user.getPassword() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid User");
        }

        String resetToken = UUID.randomUUID().toString();
        user.setVerificationToken(resetToken);
        user.setVerificationTokenTime(LocalDateTime.now());

        userAccess.updateChangePassword(user);
        try {
            emailService.sendPasswordResetEmail(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error sending password reset email");
        }
    }

    public void resetPassword(String email, String newPassword, String token) {
        User user = userAccess.findUserByResetTokenAndEmail(token, email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token or email");
        }


        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        user.setVerificationToken(null);
        userAccess.updatePassword(user);
    }


}
