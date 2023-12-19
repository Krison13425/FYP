package com.example.arilne.reservationsystem.Controller;

import com.example.arilne.reservationsystem.Model.Meal;
import com.example.arilne.reservationsystem.RequestBody.MealRequestBody;
import com.example.arilne.reservationsystem.Service.MealServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meal")
@CrossOrigin
public class MealController {

    @Autowired
    MealServiceInterface mealService;

    @GetMapping("/all")
    public List<Meal> getAllMeals() {
        return mealService.getAllMeals();
    }

    @PostMapping("/create")
    public ResponseEntity<String> createMeal(@RequestBody MealRequestBody mealRequestBody) {

        try {
            boolean isCreated = mealService.createMeal(mealRequestBody);

            if (isCreated) {
                return new ResponseEntity<>("Meal created successfully.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Unable to create meal.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/edit")
    public ResponseEntity<String> editMeal(@RequestBody MealRequestBody mealRequestBody) {

        try {
            boolean isEdited = mealService.updateMeal(mealRequestBody);

            if (isEdited) {
                return new ResponseEntity<>("Meal edited successfully.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Unable to edit meal.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Meal> getMealById(@PathVariable String id) {
        Meal meal = mealService.getMealById(id);
        if (meal != null) {
            return ResponseEntity.ok(meal);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/filter")
    public List<Meal> getFilteredMeal(
            @RequestParam(required = false) String type) {
        if (type != null && !type.isBlank()) {
            return mealService.getMealsByType(Integer.valueOf(type));
        } else {
            return mealService.getAllMeals();
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteBaggageById(@PathVariable String id) {
        try {
            boolean isDeleted = mealService.deleteMeal(id);

            if (isDeleted) {
                return new ResponseEntity<>("Meal deleted successfully.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Unable to delete meal.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
