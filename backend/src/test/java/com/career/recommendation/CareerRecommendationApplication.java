package com.career.recommendation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CareerRecommendationApplication {

    public static void main(String[] args) {

        SpringApplication.run(
                CareerRecommendationApplication.class,
                args
        );

        System.out.println("====================================");
        System.out.println(" Career Recommendation Backend Started ");
        System.out.println(" http://localhost:8080 ");
        System.out.println("====================================");
    }
}