package com.example.arilne.reservationsystem.RequestBody;

public class BaggageRequestBody {

    String name;
    int kg;
    double domesticPrice;
    double internationalPrice;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getKg() {
        return kg;
    }

    public void setKg(int kg) {
        this.kg = kg;
    }

    public double getDomesticPrice() {
        return domesticPrice;
    }

    public void setDomesticPrice(double domesticPrice) {
        this.domesticPrice = domesticPrice;
    }

    public double getInternationalPrice() {
        return internationalPrice;
    }

    public void setInternationalPrice(double internationalPrice) {
        this.internationalPrice = internationalPrice;
    }

    @Override
    public String toString() {
        return "Baggage{" +
                ", name='" + name + '\'' +
                ", kg=" + kg +
                ", domesticPrice=" + domesticPrice +
                ", internationalPrice=" + internationalPrice +
                '}';
    }
}
