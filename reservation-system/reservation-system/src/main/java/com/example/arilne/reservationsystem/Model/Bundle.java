package com.example.arilne.reservationsystem.Model;

public class Bundle {
    String id;
    String name;
    int cabinBaggage;
    int freeMeal;
    int checkinBaggage20;
    int checkinBaggage30;
    int checkinBaggage40;
    int prioCheckIn;
    int prioBoarding;
    int loungeAccess;
    double domesticPrice;
    double internationalPrice;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCabinBaggage() {
        return cabinBaggage;
    }

    public void setCabinBaggage(int cabinBaggage) {
        this.cabinBaggage = cabinBaggage;
    }

    public int getFreeMeal() {
        return freeMeal;
    }

    public void setFreeMeal(int freeMeal) {
        this.freeMeal = freeMeal;
    }

    public int getCheckinBaggage20() {
        return checkinBaggage20;
    }

    public void setCheckinBaggage20(int checkinBaggage20) {
        this.checkinBaggage20 = checkinBaggage20;
    }

    public int getCheckinBaggage30() {
        return checkinBaggage30;
    }

    public void setCheckinBaggage30(int checkinBaggage30) {
        this.checkinBaggage30 = checkinBaggage30;
    }

    public int getCheckinBaggage40() {
        return checkinBaggage40;
    }

    public void setCheckinBaggage40(int checkinBaggage40) {
        this.checkinBaggage40 = checkinBaggage40;
    }

    public int getPrioCheckIn() {
        return prioCheckIn;
    }

    public void setPrioCheckIn(int prioCheckIn) {
        this.prioCheckIn = prioCheckIn;
    }

    public int getPrioBoarding() {
        return prioBoarding;
    }

    public void setPrioBoarding(int prioBoarding) {
        this.prioBoarding = prioBoarding;
    }

    public int getLoungeAccess() {
        return loungeAccess;
    }

    public void setLoungeAccess(int loungeAccess) {
        this.loungeAccess = loungeAccess;
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
        return "Bundle{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", cabinBaggage=" + cabinBaggage +
                ", freeMeal=" + freeMeal +
                ", checkinBaggage20=" + checkinBaggage20 +
                ", checkinBaggage30=" + checkinBaggage30 +
                ", checkinBaggage40=" + checkinBaggage40 +
                ", prioCheckIn=" + prioCheckIn +
                ", prioBoarding=" + prioBoarding +
                ", loungeAccess=" + loungeAccess +
                ", domesticPrice=" + domesticPrice +
                ", internationalPrice=" + internationalPrice +
                '}';
    }
}
