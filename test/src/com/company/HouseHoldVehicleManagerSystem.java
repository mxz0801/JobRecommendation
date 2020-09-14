package com.company;

import java.util.*;

public class HouseHoldVehicleManagerSystem {

    List<Vehicle> vehicles;

    public HouseHoldVehicleManagerSystem()
    {
        Vehicle bike1 = new Bicycle();
        Vehicle bike2 = new Bicycle();
        Vehicle suv = new IceCar();
        Vehicle sedan = new IceCar();
        Vehicle modelX = new EvCar();

        vehicles.add(bike1);
        vehicles.add(bike2);
        vehicles.add(suv);
        vehicles.add(sedan);
        vehicles.add(modelX);

    }
    public void start()
    {
        for(Vehicle vehicle:vehicles)
        {
            vehicle.start();
        }
    }



}
