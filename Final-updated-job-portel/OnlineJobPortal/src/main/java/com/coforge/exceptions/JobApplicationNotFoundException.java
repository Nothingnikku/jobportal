package com.coforge.exceptions;

public class JobApplicationNotFoundException
extends RuntimeException{

    public JobApplicationNotFoundException(String message){

        super(message);
    }

}