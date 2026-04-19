package com.coforge.dto;

import lombok.Data;

@Data
public class EmailCodeRequest {
    private String email;
    private String code;
}
