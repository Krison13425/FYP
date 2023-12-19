package com.example.arilne.reservationsystem.RequestBody;

public class MealRequestBody {

    String name;
    double price;
    int type;
    String pic;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }

    @Override
    public String toString() {
        return "MealRequestBody{" +
                "name='" + name + '\'' +
                ", price=" + price +
                ", type=" + type +
                ", pic='" + pic + '\'' +
                '}';
    }
}
