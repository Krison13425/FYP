package com.example.arilne.reservationsystem.Model;

public class Airplane {
    String id;
    String name;
    int speed;
    int type;
    String location;
    int status;

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

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Airplane{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", speed=" + speed +
                ", type=" + type +
                ", location='" + location + '\'' +
                ", status=" + status +
                '}';
    }
}
