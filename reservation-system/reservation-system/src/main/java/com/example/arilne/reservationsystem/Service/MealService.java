package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.MealAccess;
import com.example.arilne.reservationsystem.Model.Meal;
import com.example.arilne.reservationsystem.RequestBody.MealRequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;

@Service
public class MealService implements MealServiceInterface {

    @Autowired
    MealAccess mealAccess;

    public static void validateMealRequest(MealRequestBody mealRequestBody) {
        if (mealRequestBody == null) {
            throw new IllegalArgumentException("Meal data is missing");
        }
        try {
            Base64.getDecoder().decode(mealRequestBody.getPic());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Meal picture is not a valid Base64 string");
        }

        if (mealRequestBody.getName() == null || mealRequestBody.getName().isEmpty()) {
            throw new IllegalArgumentException("Meal name is missing");
        }

        if (String.valueOf(mealRequestBody.getPrice()) == null) {
            throw new IllegalArgumentException("Meal price is missing");
        }

        if (String.valueOf(mealRequestBody.getType()) == null) {
            throw new IllegalArgumentException("Meal type is missing");
        }
    }

    @Override
    public boolean createMeal(MealRequestBody mealRequestBody) {

        validateMealRequest(mealRequestBody);

        Meal existingMeal = mealAccess.getMealByName(mealRequestBody.getName());
        if (existingMeal != null) {
            throw new IllegalArgumentException("Meal with the same name already exists");
        }

        Meal newMeal = new Meal();

        newMeal.setId(IDGenerator.generateUUID());
        newMeal.setName(mealRequestBody.getName());
        newMeal.setPrice(mealRequestBody.getPrice());
        newMeal.setType(mealRequestBody.getType());
        

        int rowsAffected = mealAccess.createMeal(newMeal);


        if (rowsAffected > 0) {
            return true;
        } else {
            return false;
        }

    }

    @Override
    public List<Meal> getAllMeals() {
        return mealAccess.getAllMeals();
    }


    @Override
    public List<Meal> getMealsByType(int type) {
        return mealAccess.getMealsByType(type);
    }

    @Override
    public Meal getMealById(String id) {

        Meal meal = mealAccess.getMealById(id);

        if (meal == null) {
            return null;
        }

        return meal;
    }

    @Override
    public boolean updateMeal(MealRequestBody mealRequestBody) {

        validateMealRequest(mealRequestBody);

        Meal originMeal = mealAccess.getMealByName(mealRequestBody.getName());
        if (originMeal == null) {
            throw new IllegalArgumentException("No Such Meal");
        }

        int rowsAffected = mealAccess.updateMeal(originMeal, mealRequestBody);

        if (rowsAffected > 0) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public boolean deleteMeal(String id) {

        Meal existingMeal = mealAccess.getMealById(id);

        if (existingMeal == null) {
            throw new IllegalArgumentException("No Such Meal");
        }

        int rowsAffected = mealAccess.deleteMeal(id);

        if (rowsAffected > 0) {
            return true;
        }

        return false;
    }
}
