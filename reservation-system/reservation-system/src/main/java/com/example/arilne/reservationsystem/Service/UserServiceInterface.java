package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Model.UserDetails;
import com.example.arilne.reservationsystem.Model.UserDetailsRequestBody;

public interface UserServiceInterface {


    public UserDetails getUserDetails(String userId);

    public boolean updateUser(String userid, UserDetailsRequestBody updatedUserDetails);
}
