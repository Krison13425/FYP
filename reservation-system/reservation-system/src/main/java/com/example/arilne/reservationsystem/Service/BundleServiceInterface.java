package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Model.Bundle;
import com.example.arilne.reservationsystem.RequestBody.BundleRequestBody;

import java.util.List;

public interface BundleServiceInterface {

    boolean createBundle(BundleRequestBody bundle);

    List<Bundle> getAllBundles();

    List<Bundle> getBundleByClass(String flightClass);

    Bundle getBundleById(String id);

    boolean updateBundle(BundleRequestBody bundle);

    boolean deleteBundle(String id);

}
