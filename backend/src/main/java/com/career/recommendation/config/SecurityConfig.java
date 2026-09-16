package com.career.recommendation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // =========================================================
    // USER DETAILS SERVICE
    // =========================================================
    // Spring Boot ka default generated user/password disable
    // karne ke liye custom UserDetailsService provide kar rahe hain.
    //
    // Actual application login AuthService ke through hota hai.
    // =========================================================

    @Bean
    public UserDetailsService userDetailsService() {

        return username -> {
            throw new UsernameNotFoundException(
                "Spring Security authentication is not used for this login flow."
            );
        };
    }


    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> {})

            .authorizeHttpRequests(auth -> auth

                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()

                .anyRequest().permitAll()
            );

        return http.build();
    }
}