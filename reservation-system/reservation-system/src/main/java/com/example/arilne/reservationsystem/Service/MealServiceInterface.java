package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Model.Meal;
import com.example.arilne.reservationsystem.RequestBody.MealRequestBody;

import java.util.List;

public interface MealServiceInterface {
    boolean createMeal(MealRequestBody mealRequestBody);

    List<Meal> getAllMeals();
    
    List<Meal> getMealsByType(int type);

    Meal getMealById(String id);

    boolean updateMeal(MealRequestBody mealRequestBody);

    boolean deleteMeal(String id);
}
