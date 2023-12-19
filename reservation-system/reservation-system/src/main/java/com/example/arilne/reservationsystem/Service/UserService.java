package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.UserAccess;
import com.example.arilne.reservationsystem.Access.UserDetailsAccess;
import com.example.arilne.reservationsystem.Model.UserDetails;
import com.example.arilne.reservationsystem.Model.UserDetailsRequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserServiceInterface {
    @Autowired
    private UserAccess userAccess;
    @Autowired
    private UserDetailsAccess userDetailsAccess;

    private static String encodePassword(String password) {

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(password);
        return encodedPassword;
    }

    private static boolean matchPassword(String rawPassword, String encodedPassword) {

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    @Override
    public UserDetails getUserDetails(String userId) {
        return userDetailsAccess.getUserDetails(userId);
    }

    @Override
    public boolean updateUser(String userid, UserDetailsRequestBody updatedUserDetails) {

        if (updatedUserDetails == null) {
            return false;
        }

        UserDetails exiUserDetails = userDetailsAccess.getUserDetails(userid);

        if (exiUserDetails == null) {
            UserDetails userDetails = new UserDetails();


            userDetails.setId(IDGenerator.generateUUID());
            userDetails.setUserId(userid);
            userDetails.setUserFirstName(updatedUserDetails.getUserFirstName());
            userDetails.setUserLastName(updatedUserDetails.getUserLastName());
            userDetails.setUserDOB(updatedUserDetails.getUserDOB());


            Boolean userDetailsUpated = userDetailsAccess.create(userDetails);

            return userDetailsUpated;
        }


        return false;
    }

}
