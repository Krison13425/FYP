package com.example.arilne.reservationsystem.Model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

//implements UserDetails
public class User implements UserDetails {
    private String userId;
    private String userName;
    private String password;
    private int userType;
    private String userEmail;
    private int userDetailsId;
    private boolean emailVerified;
    private String verificationToken;
    private LocalDateTime verificationTokenTime;
    private String auth0UserId;

    public String getAuth0UserId() {
        return auth0UserId;
    }

    public void setAuth0UserId(String auth0UserId) {
        this.auth0UserId = auth0UserId;
    }

    public LocalDateTime getVerificationTokenTime() {
        return verificationTokenTime;
    }

    public void setVerificationTokenTime(LocalDateTime verificationTokenTime) {
        this.verificationTokenTime = verificationTokenTime;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getVerificationToken() {
        return verificationToken;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }


    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getUserType() {
        return userType;
    }

    public void setUserType(int userType) {
        this.userType = userType;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public int getUserDetailsId() {
        return userDetailsId;
    }

    public void setUserDetailsId(int userDetailsId) {
        this.userDetailsId = userDetailsId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(mapUserTypeToAuthority(userType));
    }

    private GrantedAuthority mapUserTypeToAuthority(int userType) {

        String roleName;
        if (userType == 1) {
            roleName = "ROLE_USER";
        } else if (userType == 2) {
            roleName = "ROLE_ADMIN";
        } else {
            roleName = "ROLE_DEFAULT";
        }

        return new SimpleGrantedAuthority(roleName);
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String getUsername() {
        return userName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", userName='" + userName + '\'' +
                ", password='" + password + '\'' +
                ", userType=" + userType +
                ", userEmail='" + userEmail + '\'' +
                ", userDetailsId=" + userDetailsId +
                '}';
    }
}
