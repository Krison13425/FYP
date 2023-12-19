package com.example.arilne.reservationsystem.Model;

public class Price {
    String  id;
    String flight_id;
    double economy_price;
    double business_price;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFlight_id() {
        return flight_id;
    }

    public void setFlight_id(String flight_id) {
        this.flight_id = flight_id;
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


}

