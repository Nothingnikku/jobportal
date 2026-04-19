package com.coforge.exceptions;

public class SkillNotFoundException
extends RuntimeException{

    public SkillNotFoundException(String message){

        super(message);
    }

}