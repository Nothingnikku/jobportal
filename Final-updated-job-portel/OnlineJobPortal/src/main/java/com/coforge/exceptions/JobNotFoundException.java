package com.coforge.exceptions;

public class JobNotFoundException extends RuntimeException{

    public JobNotFoundException(String msg){

        super(msg);
    }

}