package com.example.arilne.reservationsystem.Access;

import com.example.arilne.reservationsystem.Model.Flight;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;

@Repository
public class FlightAccess {

    private static final String INSERT_FLIGHTS = "INSERT INTO tbl_flights (id, airline_id, airplane_id, departure_airport, arrival_airport, departure_time, arrival_time, delayed_departure_time, delayed_arrived_time, duration_time, type, status, economy_seats, business_seats, booked_economy_seats, booked_business_seats, economy_price, business_price, is_full, is_delayed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    private static final String UPDATES_FLIGHTS = "UPDATE tbl_flights SET ";
    private static final String UPDATE_FLIGHT_PRICES = "UPDATE tbl_flights SET economy_price = ?, business_price = ? WHERE id = ?";
    private static final String DELETE_FLIGHT_BY_ID = "DELETE FROM tbl_flights WHERE id = ?";
    private static final String SEARCH_FLIGHT_BY_ID = "SELECT tbl_flights.*, tbl_airplane.name as airplane_name FROM tbl_flights " +
            "JOIN tbl_airplane ON tbl_flights.airplane_id = tbl_airplane.id " +
            "WHERE tbl_flights.id = ?";
    private static final String SEARCH_ALL_FLIGHT = "SELECT tbl_flights.*, tbl_airplane.name as airplane_name FROM tbl_flights " +
            "JOIN tbl_airplane ON tbl_flights.airplane_id = tbl_airplane.id ORDER BY tbl_flights.created_time_date";
    private static final String SEARCH_FILTERED_FLIGHT = "SELECT tbl_flights.*, tbl_airplane.name as airplane_name FROM tbl_flights " +
            "JOIN tbl_airplane ON tbl_flights.airplane_id = tbl_airplane.id ";

    private static final String SEARCH_CHEAPEST_FLIGHT_BY_DATE_RANGE = "SELECT f.*, a.name as airplane_name " +
            "FROM tbl_flights f " +
            "JOIN tbl_airplane a ON f.airplane_id = a.id " +
            "JOIN ( " +
            "SELECT DATE(departure_time) AS dep_date, MIN(economy_price) AS min_price " +
            "FROM tbl_flights " +
            "WHERE DATE(departure_time) BETWEEN ? AND ? " +
            "AND departure_airport = ? " +
            "AND arrival_airport = ? " +
            "AND status = 0 " +
            "AND is_full = 0 " +
            "GROUP BY DATE(departure_time) " +
            ") min_flights ON DATE(f.departure_time) = min_flights.dep_date AND f.economy_price = min_flights.min_price " +
            "WHERE DATE(f.departure_time) BETWEEN ? AND ? " +
            "AND f.departure_airport = ? " +
            "AND f.arrival_airport = ? " +
            "AND f.status = 0 " +
            "AND f.is_full = 0 " +
            "ORDER BY f.departure_time ASC";
    private static int rowsAffected = 0;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int createFlight(Flight flight) {
        try {
            rowsAffected = jdbcTemplate.update(
                    INSERT_FLIGHTS,
                    flight.getId(),
                    flight.getAirline_id(),
                    flight.getAirplane_id(),
                    flight.getDeparture_airport(),
                    flight.getArrival_airport(),
                    flight.getDeparture_time(),
                    flight.getArrival_time(),
                    flight.getDelayed_departure_time(),
                    flight.getDelayed_arrived_time(),
                    flight.getDuration_time(),
                    flight.getFlight_type(),
                    flight.getFlight_status(),
                    flight.getEconomy_seats(),
                    flight.getBusiness_seats(),
                    flight.getBooked_economy_seats(),
                    flight.getBooked_business_seats(),
                    flight.getEconomy_price(),
                    flight.getBusiness_price(),
                    flight.getIs_full(),
                    flight.getIs_delayed()
            );
            return rowsAffected;
        } catch (EmptyResultDataAccessException e) {
            return rowsAffected;
        }
    }


    public int updateFlight(Flight originFlight, String flightStatus, Date departureDate, Date arrivalDate) {

        StringBuilder queryBuilder = new StringBuilder(UPDATES_FLIGHTS);
        List<Object> params = new ArrayList<>();
        boolean commaRequired = false;

        if (flightStatus != null && !flightStatus.isEmpty() && originFlight.getFlight_status() != Integer.parseInt(flightStatus)) {
            queryBuilder.append("status = ? ");
            params.add(Integer.parseInt(flightStatus));
            commaRequired = true;
        }

        if (departureDate != null && originFlight.getDeparture_time() != departureDate) {
            if (commaRequired) {
                queryBuilder.append(", ");
            }
            queryBuilder.append("delayed_departure_time = ? ");
            params.add(departureDate);
            commaRequired = true;
        }

        if (arrivalDate != null && originFlight.getArrival_time() != arrivalDate) {
            if (commaRequired) {
                queryBuilder.append(", ");
            }
            queryBuilder.append("delayed_arrived_time = ? ");
            params.add(arrivalDate);
        }

        if (flightStatus.equals("4")) {
            if (commaRequired) {
                queryBuilder.append(", ");
            }
            queryBuilder.append("is_delayed = ? ");
            params.add(1);
        }

        queryBuilder.append(" WHERE id = ?");
        params.add(originFlight.getId());

        try {
            rowsAffected = jdbcTemplate.update(queryBuilder.toString(), params.toArray());
            return rowsAffected;
        } catch (EmptyResultDataAccessException e) {
            return rowsAffected;
        }

    }

    public int updateFlightPrice(String flightId, double economyPrice, double businessPrice) {

        if (!flightId.isEmpty() && flightId != null) {
            try {
                rowsAffected = jdbcTemplate.update(UPDATE_FLIGHT_PRICES, economyPrice, businessPrice, flightId);
                return rowsAffected;
            } catch (EmptyResultDataAccessException e) {
                return rowsAffected;
            }
        }
        return rowsAffected;
    }

    public Flight getFlightById(String flightId) {
        try {
            return jdbcTemplate.queryForObject(SEARCH_FLIGHT_BY_ID, new Object[]{flightId}, new FlightRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public List<Flight> getFilteredFlightList(String departureAirport, String arrivalAirport, Date departureDateStart, Date departureDateEnd, Date arrivalDateStart, Date arrivalDateEnd, String flightType, String flightStatus, String airplane_id) {
        StringBuilder queryBuilder = new StringBuilder(SEARCH_FILTERED_FLIGHT);
        List<Object> params = new ArrayList<>();

        if (departureAirport != null || arrivalAirport != null ||
                departureDateStart != null || departureDateEnd != null || arrivalDateStart != null || arrivalDateEnd != null ||
                flightType != null || flightStatus != null || airplane_id != null) {
            queryBuilder.append("WHERE ");
            boolean andRequired = false;

            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

            if (departureAirport != null && !departureAirport.isEmpty()) {
                queryBuilder.append("tbl_flights.departure_airport = ? ");
                params.add(departureAirport);
                andRequired = true;
            }

            if (arrivalAirport != null && !arrivalAirport.isEmpty()) {
                if (andRequired) {
                    queryBuilder.append("AND ");
                }
                queryBuilder.append("tbl_flights.arrival_airport = ? ");
                params.add(arrivalAirport);
                andRequired = true;
            }

            if (departureDateStart != null) {
                if (andRequired) {
                    queryBuilder.append("AND ");
                }

                if (departureDateEnd != null) {
                    queryBuilder.append("date(tbl_flights.departure_time) BETWEEN ? AND ? ");

                    params.add(formatter.format(departureDateStart));
                    params.add(formatter.format(departureDateEnd));
                } else {
                    queryBuilder.append("date(tbl_flights.departure_time) = ? ");
                    params.add(formatter.format(departureDateStart));
                }

                andRequired = true;
            }

            if (arrivalDateStart != null) {
                if (andRequired) {
                    queryBuilder.append("AND ");
                }

                if (arrivalDateEnd != null) {
                    queryBuilder.append("date(tbl_flights.arrival_time) BETWEEN ? AND ? ");
                    params.add(formatter.format(arrivalDateStart));
                    params.add(formatter.format(arrivalDateEnd));
                } else {
                    queryBuilder.append("date(tbl_flights.arrival_time) = ? ");
                    params.add(formatter.format(arrivalDateStart));
                }

                andRequired = true;
            }

            if (flightType != null && !flightType.isEmpty()) {
                if (andRequired) {
                    queryBuilder.append("AND ");
                }
                queryBuilder.append("tbl_flights.type = ? ");
                params.add(Integer.valueOf(flightType));
                andRequired = true;
            }

            if (flightStatus != null && !flightStatus.isEmpty()) {
                if (andRequired) {
                    queryBuilder.append("AND ");
                }
                queryBuilder.append("tbl_flights.status = ? ");
                params.add(Integer.valueOf(flightStatus));
                andRequired = true;
            }

            if (airplane_id != null && !airplane_id.isEmpty()) {
                if (andRequired) {
                    queryBuilder.append("AND ");
                }
                queryBuilder.append("tbl_flights.airplane_id = ? ");
                params.add(Integer.valueOf(airplane_id));
            }
        }

        try {
            return jdbcTemplate.query(queryBuilder.toString(), params.toArray(), new FlightRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }


    public List<Flight> findCheapestFlights(Date departureStartDate, Date departureEndDate, String departureAirport, String arrivalAirport) {

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

        return jdbcTemplate.query(SEARCH_CHEAPEST_FLIGHT_BY_DATE_RANGE, new FlightRowMapper(),
                formatter.format(departureStartDate),
                formatter.format(departureEndDate),
                departureAirport,
                arrivalAirport,
                formatter.format(departureStartDate),
                formatter.format(departureEndDate),
                departureAirport,
                arrivalAirport);
    }

    public List<Flight> getUserFilteredFlightList(String departureAirport, String arrivalAirport, Date departureDate, String flightStatus) {
        StringBuilder queryBuilder = new StringBuilder(SEARCH_FILTERED_FLIGHT);
        List<Object> params = new ArrayList<>();

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        boolean andRequired = false;

        if (departureAirport != null || departureDate != null || flightStatus != null) {
            queryBuilder.append("WHERE tbl_flights.is_full = 0 AND ");
        }

        if (departureAirport != null && !departureAirport.isEmpty()) {
            queryBuilder.append(andRequired ? "AND " : "").append("tbl_flights.departure_airport = ? ");
            params.add(departureAirport);
            andRequired = true;
        }

        if (arrivalAirport != null && !arrivalAirport.isEmpty()) {
            queryBuilder.append(andRequired ? "AND " : "").append("tbl_flights.arrival_airport = ? ");
            params.add(arrivalAirport);
            andRequired = true;
        }

        if (departureDate != null) {
            queryBuilder.append(andRequired ? "AND " : "").append("date(tbl_flights.departure_time) = ? ");
            params.add(formatter.format(departureDate));
            andRequired = true;
        }

        if (flightStatus != null && !flightStatus.isEmpty()) {
            queryBuilder.append(andRequired ? "AND " : "").append("tbl_flights.status = ? ");
            params.add(Integer.valueOf(flightStatus));
            andRequired = true;
        }

        try {
            return jdbcTemplate.query(queryBuilder.toString(), params.toArray(), new FlightRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }


    public List<Flight> getTodayFlightsByStatus(int flightStatus) {

        Date currentDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        Date startDate = calendar.getTime();
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        calendar.add(Calendar.SECOND, -1);
        Date endDate = calendar.getTime();

        try {
            return jdbcTemplate.query(
                    SEARCH_FILTERED_FLIGHT + "WHERE tbl_flights.departure_time BETWEEN ? AND ? AND tbl_flights.status = ?",
                    new Object[]{startDate, endDate, flightStatus},
                    new FlightRowMapper()
            );
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }


    public int deleteAirplane(String id) {
        try {
            rowsAffected = jdbcTemplate.update(DELETE_FLIGHT_BY_ID, id);
            return rowsAffected;
        } catch (EmptyResultDataAccessException e) {
            return rowsAffected;
        }
    }

    public List<Flight> getAllFlights() {
        try {
            return jdbcTemplate.query(SEARCH_ALL_FLIGHT, new FlightRowMapper());
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int getCountByStatus(String status, Date startDate, Date endDate) {
        StringBuilder queryBuilder = new StringBuilder();

        ArrayList<Object> params = new ArrayList<>();
        boolean whereAdded = false;

        if (status != null && !status.isEmpty()) {
            queryBuilder.append(whereAdded ? "AND " : "WHERE ");
            queryBuilder.append("status = ? ");
            params.add(status);
            whereAdded = true;
        }

        if (startDate != null && endDate != null) {
            queryBuilder.append(whereAdded ? "AND " : "WHERE ");
            queryBuilder.append("departure_time BETWEEN ? AND ? ");
            params.add(startDate);
            params.add(endDate);
            whereAdded = true;
        }

        queryBuilder.insert(0, "SELECT COUNT(*) FROM tbl_flights ");
        return jdbcTemplate.queryForObject(queryBuilder.toString(), params.toArray(), Integer.class);

    }

    public Map<String, Integer> getCountByStatusGroupedByMonth(int isDelayed) {
        StringBuilder queryBuilder = new StringBuilder("SELECT MONTH(departure_time) AS month, COUNT(*) AS count FROM tbl_flights ");

        ArrayList<Object> params = new ArrayList<>();

        if (isDelayed != 0) {
            queryBuilder.append("WHERE is_delayed = ?");
            params.add(isDelayed);
        }

        queryBuilder.append(" GROUP BY MONTH(departure_time)");

        List<Map<String, Object>> result = jdbcTemplate.queryForList(queryBuilder.toString(), params.toArray());

        Map<String, Integer> monthCountMap = new LinkedHashMap<>();
        for (Map<String, Object> row : result) {
            monthCountMap.put(String.valueOf(row.get("month")), ((Long) row.get("count")).intValue());
        }

        return monthCountMap;
    }


    private static class FlightRowMapper implements RowMapper<Flight> {

        public Flight mapRow(ResultSet rs, int rowNum) throws SQLException {
            Flight flight = new Flight();
            flight.setId(rs.getString("id"));
            flight.setAirline_id(rs.getString("airline_id"));
            flight.setAirplane_id(rs.getString("airplane_id"));
            flight.setDeparture_airport(rs.getString("departure_airport"));
            flight.setArrival_airport(rs.getString("arrival_airport"));
            flight.setDeparture_time(rs.getTimestamp("departure_time"));
            flight.setArrival_time(rs.getTimestamp("arrival_time"));
            flight.setDelayed_departure_time(rs.getTimestamp("delayed_departure_time"));
            flight.setDelayed_arrived_time(rs.getTimestamp("delayed_arrived_time"));
            flight.setDuration_time(rs.getTime("duration_time"));
            flight.setFlight_type(rs.getInt("type"));
            flight.setFlight_status(rs.getInt("status"));
            flight.setEconomy_seats(rs.getInt("economy_seats"));
            flight.setBusiness_seats(rs.getInt("business_seats"));
            flight.setBooked_economy_seats(rs.getInt("booked_economy_seats"));
            flight.setBooked_business_seats(rs.getInt("booked_business_seats"));
            flight.setEconomy_price(rs.getDouble("economy_price"));
            flight.setBusiness_price(rs.getDouble("business_price"));
            flight.setAirplane_name(rs.getString("airplane_name"));
            flight.setIs_full(rs.getInt("is_full"));
            flight.setIs_delayed(rs.getInt("is_delayed"));
            return flight;
        }
    }


}
