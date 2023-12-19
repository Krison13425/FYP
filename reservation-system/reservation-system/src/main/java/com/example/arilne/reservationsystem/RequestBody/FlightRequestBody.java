package com.example.arilne.reservationsystem.RequestBody;

import java.sql.Time;
import java.util.Date;

public class FlightRequestBody {
    String airline_id;
    String airplane_id;
    String departure_airport;
    String arrival_airport;
    Date departure_date;
    Time departure_time;
    double economy_price;
    double business_price;

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

    public Date getDeparture_date() {
        return departure_date;
    }

    public void setDeparture_date(Date departure_date) {
        this.departure_date = departure_date;
    }

    public Time getDeparture_time() {
        return departure_time;
    }

    public void setDeparture_time(Time departure_time) {
        this.departure_time = departure_time;
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

    @Override
    public String toString() {
        return "FlightRequestBody{" +
                "airline_id='" + airline_id + '\'' +
                ", airplane_id='" + airplane_id + '\'' +
                ", departure_airport='" + departure_airport + '\'' +
                ", arrival_airport='" + arrival_airport + '\'' +
                ", departure_date=" + departure_date +
                ", departure_time=" + departure_time +
                ", economy_price=" + economy_price +
                ", business_price=" + business_price +
                '}';
    }
}