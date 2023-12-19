package com.example.arilne.reservationsystem.RequestBody;

public class BundleRequestBody {

    String name;
    int checkinBaggage;
    int prioCheckIn;
    double domesticPrice;
    double internationalPrice;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public int getCheckinBaggage() {
        return checkinBaggage;
    }

    public void setCheckinBaggage(int checkinBaggage) {
        this.checkinBaggage = checkinBaggage;
    }

    public int getPrioCheckIn() {
        return prioCheckIn;
    }

    public void setPrioCheckIn(int prioCheckIn) {
        this.prioCheckIn = prioCheckIn;
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
        return "BundleRequestBody{" +
                "name='" + name + '\'' +
                ", checkinBaggage=" + checkinBaggage +
                ", prioCheckIn=" + prioCheckIn +
                ", domesticPrice=" + domesticPrice +
                ", internationalPrice=" + internationalPrice +
                '}';
    }
}
