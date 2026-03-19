package com.forum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreatePostRequest {
    @NotBlank
    private String title;
    
    @NotBlank
    private String content;
    
    @NotNull
    private Long categoryId;
}