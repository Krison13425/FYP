package com.example.arilne.reservationsystem.RequestBody;

public class AirplaneRequestBody {
    String name;
    int speed;
    int type;
    String location;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSpeed() {
        return speed;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    @Override
    public String toString() {
        return "AirplaneRequestBody{" +
                "name='" + name + '\'' +
                ", speed=" + speed +
                ", type=" + type +
                ", location='" + location + '\'' +
                '}';
    }
}
