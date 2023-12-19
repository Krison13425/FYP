package com.example.arilne.reservationsystem.Model;

import java.sql.Time;
import java.util.Date;

public class Flight {

    String id;
    String airline_id;
    String airplane_id;
    String airplane_name;
    String departure_airport;
    String arrival_airport;
    Date departure_time;
    Date arrival_time;
    Time duration_time;
    int flight_type;
    int flight_status;
    double economy_price;
    double business_price;
    int economy_seats;
    int business_seats;
    int booked_economy_seats;
    int booked_business_seats;
    int is_full;
    int is_delayed;
    private Date delayed_departure_time;
    private Date delayed_arrived_time;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAirline_id() {
        return airline_id;
    }

    public void setAirline_id(String airline_id) {
        this.airline_id = airline_id;
    }

    public String getAirplane_id() {
        return airplane_id;
    }

    public void setAirplane_id(String airplane_id) {
        this.airplane_id = airplane_id;
    }

    public String getAirplane_name() {
        return airplane_name;
    }

    public void setAirplane_name(String airplane_name) {
        this.airplane_name = airplane_name;
    }

    public String getDeparture_airport() {
        return departure_airport;
    }

    public void setDeparture_airport(String departure_airport) {
        this.departure_airport = departure_airport;
    }

    public String getArrival_airport() {
        return arrival_airport;
    }

    public void setArrival_airport(String arrival_airport) {
        this.arrival_airport = arrival_airport;
    }

    public Date getDeparture_time() {
        return departure_time;
    }

    public void setDeparture_time(Date departure_time) {
        this.departure_time = departure_time;
    }

    public Date getArrival_time() {
        return arrival_time;
    }

    public void setArrival_time(Date arrival_time) {
        this.arrival_time = arrival_time;
    }

    public int getFlight_type() {
        return flight_type;
    }

    public void setFlight_type(int flight_type) {
        this.flight_type = flight_type;
    }

    public int getFlight_status() {
        return flight_status;
    }

    public void setFlight_status(int flight_status) {
        this.flight_status = flight_status;
    }

    public Time getDuration_time() {
        return duration_time;
    }

    public void setDuration_time(Time duration_time) {
        this.duration_time = duration_time;
    }

    public double getEconomy_price() {
        return economy_price;
    }

    public void setEconomy_price(double economy_price) {
        this.economy_price = economy_price;
    }

    public double getBusiness_price() {
        return business_price;
    }

    public void setBusiness_price(double business_price) {
        this.business_price = business_price;
    }

    public int getIs_delayed() {
        return is_delayed;
    }

    public void setIs_delayed(int is_delayed) {
        this.is_delayed = is_delayed;
    }

    public int getEconomy_seats() {
        return economy_seats;
    }

    public void setEconomy_seats(int economy_seats) {
        this.economy_seats = economy_seats;
    }

    public int getBusiness_seats() {
        return business_seats;
    }

    public void setBusiness_seats(int business_seats) {
        this.business_seats = business_seats;
    }

    public int getBooked_economy_seats() {
        return booked_economy_seats;
    }

    public void setBooked_economy_seats(int booked_economy_seats) {
        this.booked_economy_seats = booked_economy_seats;
    }

    public int getBooked_business_seats() {
        return booked_business_seats;
    }

    public void setBooked_business_seats(int booked_business_seats) {
        this.booked_business_seats = booked_business_seats;
    }

    public int getIs_full() {
        return is_full;
    }

    public void setIs_full(int is_full) {
        this.is_full = is_full;
    }

    public Date getDelayed_departure_time() {
        return delayed_departure_time;
    }

    public void setDelayed_departure_time(Date delayed_departure_time) {
        this.delayed_departure_time = delayed_departure_time;
    }

    public Date getDelayed_arrived_time() {
        return delayed_arrived_time;
    }

    public void setDelayed_arrived_time(Date delayed_arrived_time) {
        this.delayed_arrived_time = delayed_arrived_time;
    }

    @Override
    public String toString() {
        return "Flight{" +
                "id='" + id + '\'' +
                ", airline_id='" + airline_id + '\'' +
                ", airplane_id='" + airplane_id + '\'' +
                ", airplane_name='" + airplane_name + '\'' +
                ", departure_airport='" + departure_airport + '\'' +
                ", arrival_airport='" + arrival_airport + '\'' +
                ", departure_time=" + departure_time +
                ", arrival_time=" + arrival_time +
                ", duration_time=" + duration_time +
                ", flight_type=" + flight_type +
                ", flight_status=" + flight_status +
                ", economy_price=" + economy_price +
                ", business_price=" + business_price +
                ", economy_seats=" + economy_seats +
                ", business_seats=" + business_seats +
                ", booked_economy_seats=" + booked_economy_seats +
                ", booked_business_seats=" + booked_business_seats +
                ", is_full=" + is_full +
                ", is_delayed=" + is_delayed +
                '}';
    }
}

