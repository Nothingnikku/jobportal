package com.coforge.service;


import com.coforge.dto.LoginReqDto;
import com.coforge.dto.SignupReqDto;

public interface AuthServiceInterface {
	String signup(SignupReqDto req);
	String login(LoginReqDto req);
}
