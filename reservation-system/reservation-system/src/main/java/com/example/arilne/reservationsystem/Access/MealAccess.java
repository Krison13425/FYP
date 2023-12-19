package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.Meal;
import com.example.arilne.reservationsystem.RequestBody.MealRequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class MealAccess {
    private static final String INSERT_MEAL = "INSERT INTO tbl_meal (id, name, price, type) VALUES (?, ?, ?, ?, ?)";
    private static final String SELECT_ALL_MEAL = "SELECT * FROM tbl_meal";
    private static final String SELECT_MEAL_BY_ID = "SELECT * FROM tbl_meal WHERE id = ?";
    private static final String SELECT_MEAL_BY_NAME = "SELECT * FROM tbl_meal WHERE name = ?";
    private static final String SELECT_MEAL_BY_TYPE = "SELECT * FROM tbl_meal WHERE type = ?";
    private static final String UPDATE_MEAL = "UPDATE tbl_meal SET ";
    private static final String DELETE_MEAL = "DELETE FROM tbl_meal WHERE id = ?";
    private static int rowsAffected = 0;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int createMeal(Meal meal) {

        if (meal != null) {
            try {
                rowsAffected = jdbcTemplate.update(INSERT_MEAL, meal.getId(), meal.getName(), meal.getPrice(), meal.getType());
                return rowsAffected;
            } catch (EmptyResultDataAccessException e) {
                return rowsAffected;
            }
        }
        return rowsAffected;
    }

    public List<Meal> getAllMeals() {
        try {
            return jdbcTemplate.query(SELECT_ALL_MEAL, new MealRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }

    public Meal getMealById(String id) {
        try {
            return jdbcTemplate.queryForObject(SELECT_MEAL_BY_ID, new Object[]{id}, new MealRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public Meal getMealByName(String name) {
        try {
            return jdbcTemplate.queryForObject(SELECT_MEAL_BY_NAME, new Object[]{name}, new MealRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public List<Meal> getMealsByType(int type) {
        try {
            return jdbcTemplate.query(SELECT_MEAL_BY_TYPE, new Object[]{type}, new MealRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }

    public int updateMeal(Meal originMeal, MealRequestBody mealRequestBody) {
        try {
            StringBuilder queryBuilder = new StringBuilder(UPDATE_MEAL);
            List<Object> params = new ArrayList<>();


            if (!originMeal.getName().equals(mealRequestBody.getName())) {
                queryBuilder.append("name = ?, ");
                params.add(mealRequestBody.getName());
            }

            if (originMeal.getPrice() != mealRequestBody.getPrice()) {
                queryBuilder.append("price = ?, ");
                params.add(mealRequestBody.getPrice());
            }

            int i = queryBuilder.lastIndexOf(",");
            if (i != -1) {
                queryBuilder.deleteCharAt(i);
            }

            queryBuilder.append(" WHERE id = ?");
            params.add(originMeal.getId());

            rowsAffected = jdbcTemplate.update(queryBuilder.toString(), params.toArray());
            return rowsAffected;
        } catch (EmptyResultDataAccessException e) {
            return rowsAffected;
        }
    }

    public int deleteMeal(String id) {
        try {
            rowsAffected = jdbcTemplate.update(DELETE_MEAL, id);
            return rowsAffected;
        } catch (EmptyResultDataAccessException e) {
            return rowsAffected;
        }
    }

    private static class MealRowMapper implements RowMapper<Meal> {
        public Meal mapRow(ResultSet rs, int rowNum) throws SQLException {
            Meal meal = new Meal();
            meal.setId(rs.getString("id"));
            meal.setName(rs.getString("name"));
            meal.setPrice(rs.getDouble("price"));
            meal.setType(rs.getInt("type"));
            return meal;
        }
    }
}

