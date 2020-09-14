package com.company;

public class Couch implements Seatable{
    @Override
    public void sit() {

    }

    @Override
    public int getNumberOfSeats() {
        return 1;
    }

    @Override
    public int getComfortableRating() {
        return 5;
    }
}
