package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.BundleAccess;
import com.example.arilne.reservationsystem.Model.Bundle;
import com.example.arilne.reservationsystem.RequestBody.BundleRequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BundleService implements BundleServiceInterface {

    @Autowired
    BundleAccess bundleAccess;

    @Override
    public boolean createBundle(BundleRequestBody bundleRequestBody) {


        validateBundleRequestBody(bundleRequestBody);

        Bundle existingBundle = bundleAccess.getBundleByName(bundleRequestBody.getName());
        if (existingBundle != null) {
            throw new IllegalArgumentException("Bundle with the same name already exists");
        }
        Bundle newBundle = new Bundle();

        newBundle.setId(IDGenerator.generateUUID());
        newBundle.setCabinBaggage(1);
        newBundle.setFreeMeal(1);

        if (bundleRequestBody.getCheckinBaggage() == 20) {
            newBundle.setCheckinBaggage20(1);
            newBundle.setCheckinBaggage30(0);
            newBundle.setCheckinBaggage40(0);
        } else if (bundleRequestBody.getCheckinBaggage() == 30) {
            newBundle.setCheckinBaggage20(0);
            newBundle.setCheckinBaggage30(1);
            newBundle.setCheckinBaggage40(0);
        } else if (bundleRequestBody.getCheckinBaggage() == 40) {
            newBundle.setCheckinBaggage20(0);
            newBundle.setCheckinBaggage30(0);
            newBundle.setCheckinBaggage40(1);
        }

        newBundle.setPrioCheckIn(bundleRequestBody.getPrioCheckIn());
        newBundle.setDomesticPrice(bundleRequestBody.getDomesticPrice());
        newBundle.setInternationalPrice(bundleRequestBody.getInternationalPrice());

        if (bundleRequestBody.getName().toLowerCase().contains("business")) {
            newBundle.setPrioBoarding(1);
            newBundle.setLoungeAccess(1);
        }


        int rowsAffected = bundleAccess.createBundle(newBundle);

        if (rowsAffected > 0) {
            return true;
        } else {
            return false;
        }

    }

    @Override
    public List<Bundle> getAllBundles() {
        return bundleAccess.getAllBundles();
    }

    @Override
    public List<Bundle> getBundleByClass(String flightClass) {
        return bundleAccess.getBundlesByFlightClass(flightClass);
    }

    @Override
    public Bundle getBundleById(String id) {
        Bundle bundle = bundleAccess.getBundleById(id);
        if (bundle == null) {
            return null;
        }
        return bundle;
    }

    @Override
    public boolean updateBundle(BundleRequestBody bundleRequestBody) {


        validateBundleRequestBody(bundleRequestBody);

        Bundle originBundle = bundleAccess.getBundleByName(bundleRequestBody.getName());
        if (originBundle == null) {
            throw new IllegalArgumentException("Bundle is not exists");
        }

        int rowsAffected = bundleAccess.updateBundle(originBundle, bundleRequestBody);

        if (rowsAffected > 0) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public boolean deleteBundle(String id) {

        Bundle existingBundle = bundleAccess.getBundleById(id);
        if (existingBundle == null) {
            throw new IllegalArgumentException("No Such Bundle");
        }

        int rowsAffected = bundleAccess.deleteBundle(id);

        if (rowsAffected > 0) {
            return true;
        } else {
            return false;
        }

    }


    public void validateBundleRequestBody(BundleRequestBody bundleRequestBody) {
        if (bundleRequestBody == null) {
            throw new IllegalArgumentException("Bundle data is missing");
        }

        if (bundleRequestBody.getName() == null || bundleRequestBody.getName().isEmpty()) {
            throw new IllegalArgumentException("Bundle name is missing");
        }

        if (String.valueOf(bundleRequestBody.getCheckinBaggage()) == null || String.valueOf(bundleRequestBody.getCheckinBaggage()).isEmpty()) {
            throw new IllegalArgumentException("Bundle baggage is missing");
        }

        if (String.valueOf(bundleRequestBody.getPrioCheckIn()) == null || String.valueOf(bundleRequestBody.getPrioCheckIn()).isEmpty()) {
            throw new IllegalArgumentException("Bundle Priority Check In is missing");
        }

        if (String.valueOf(bundleRequestBody.getDomesticPrice()) == null || String.valueOf(bundleRequestBody.getDomesticPrice()).isEmpty()) {
            throw new IllegalArgumentException("Bundle Domestic Price is missing");
        }

        if (String.valueOf(bundleRequestBody.getInternationalPrice()) == null || String.valueOf(bundleRequestBody.getInternationalPrice()).isEmpty()) {
            throw new IllegalArgumentException("Bundle International Price is missing");
        }
    }


}