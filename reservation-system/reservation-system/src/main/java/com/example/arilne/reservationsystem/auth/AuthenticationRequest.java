package com.example.arilne.reservationsystem.auth;

public class AuthenticationRequest {
    String username;
    String password;
    String auth0Token;


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAuth0Token() {
        return auth0Token;
    }

    public void setAuth0Token(String auth0Token) {
        this.auth0Token = auth0Token;
    }
}
