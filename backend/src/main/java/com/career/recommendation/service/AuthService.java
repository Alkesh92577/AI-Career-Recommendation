package com.career.recommendation.service;

import com.career.recommendation.dto.LoginRequest;
import com.career.recommendation.dto.RegisterRequest;
import com.career.recommendation.model.User;
import com.career.recommendation.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.career.recommendation.service.FirebasePasswordResetService;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;
    private final FirebasePasswordResetService firebasePasswordResetService;


    public AuthService(
        UserRepository userRepository,
        JavaMailSender mailSender,
        PasswordEncoder passwordEncoder,
        FirebasePasswordResetService firebasePasswordResetService) {

    this.userRepository = userRepository;
    this.mailSender = mailSender;
    this.passwordEncoder = passwordEncoder;
    this.firebasePasswordResetService = firebasePasswordResetService;
}


    // =========================================================
    // REGISTER
    // =========================================================

    public Map<String, Object> register(RegisterRequest request) {

        Map<String, Object> response = new HashMap<>();

        if (userRepository.existsByEmail(request.getEmail())) {

            response.put("success", false);
            response.put("message", "Email already registered");

            return response;
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // =====================================================
        // IMPORTANT:
        // Password ko plain text me save nahi karna.
        // BCrypt se encrypt/hash karke save karenge.
        // =====================================================

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole("STUDENT");

        User savedUser = userRepository.save(user);

        response.put("success", true);
        response.put("message", "Registration successful");
        response.put("userId", savedUser.getId());
        response.put("name", savedUser.getName());
        response.put("email", savedUser.getEmail());
        response.put("role", savedUser.getRole());

        return response;
    }


    // =========================================================
    // LOGIN
    // =========================================================

    public Map<String, Object> login(LoginRequest request) {

        Map<String, Object> response = new HashMap<>();

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {

            response.put("success", false);
            response.put("message", "User not found");

            return response;
        }


        String storedPassword = user.getPassword();

        boolean passwordMatches = false;


        // =====================================================
        // NEW USERS
        // BCrypt password check
        // =====================================================

        if (isBCryptPassword(storedPassword)) {

            passwordMatches = passwordEncoder.matches(
                    request.getPassword(),
                    storedPassword
            );

        }

        // =====================================================
        // OLD USERS
        // Existing database me plain-text password ho sakta hai.
        //
        // Successful login ke baad automatically BCrypt me
        // convert kar denge.
        // =====================================================

        else {

            passwordMatches =
                    storedPassword != null
                    && storedPassword.equals(request.getPassword());


            if (passwordMatches) {

                user.setPassword(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                );

                userRepository.save(user);
            }
        }


        // =====================================================
        // INVALID PASSWORD
        // =====================================================

        if (!passwordMatches) {

            response.put("success", false);
            response.put("message", "Invalid password");

            return response;
        }


        // =====================================================
        // LOGIN SUCCESS
        // =====================================================

        response.put("success", true);
        response.put("message", "Login successful");
        response.put("userId", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        return response;
    }


    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    public Map<String, Object> forgotPassword(String email) {

        Map<String, Object> response = new HashMap<>();

        User user = userRepository
                .findByEmail(email)
                .orElse(null);


        /*
         * Security:
         * User exists hai ya nahi, dono cases mein same
         * message return karenge.
         */

        if (user == null) {

            response.put(
                    "success",
                    true
            );

            response.put(
                    "message",
                    "If an account exists with this email, a password reset link will be sent."
            );

            return response;
        }


        // =====================================================
        // SECURE RANDOM TOKEN
        // =====================================================

        String resetToken = generateSecureToken();


        // =====================================================
        // TOKEN 15 MINUTES VALID
        // =====================================================

        long expiryTime =
                System.currentTimeMillis()
                        + (15 * 60 * 1000);


        // =====================================================
        // SAVE TOKEN
        // =====================================================

        user.setResetToken(resetToken);
        user.setResetTokenExpiry(expiryTime);

        userRepository.save(user);


        // =====================================================
        // RESET LINK
        // =====================================================

        String resetLink =
        firebasePasswordResetService
                .generatePasswordResetLink(user.getEmail());


        // =====================================================
        // EMAIL
        // =====================================================

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(
                System.getenv("MAIL_USERNAME")
        );

        message.setTo(
                user.getEmail()
        );

        message.setSubject(
                "AI Career Recommendation - Password Reset"
        );

        message.setText(
                "Hello " + user.getName() + ",\n\n"
                + "We received a request to reset your password.\n\n"
                + "Click the link below to create a new password:\n\n"
                + resetLink + "\n\n"
                + "This link will expire in 15 minutes.\n\n"
                + "If you did not request a password reset, "
                + "you can safely ignore this email.\n\n"
                + "Regards,\n"
                + "AI Career Recommendation Team"
        );


        // =====================================================
        // SEND EMAIL
        // =====================================================

        mailSender.send(message);


        response.put(
                "success",
                true
        );

        response.put(
                "message",
                "If an account exists with this email, a password reset link will be sent."
        );

        return response;
    }


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    public Map<String, Object> resetPassword(
            String token,
            String newPassword) {

        Map<String, Object> response =
                new HashMap<>();


        // =====================================================
        // FIND USER BY RESET TOKEN
        // =====================================================

        User user =
                userRepository
                        .findAll()
                        .stream()
                        .filter(u ->
                                token != null
                                && token.equals(
                                        u.getResetToken()
                                )
                        )
                        .findFirst()
                        .orElse(null);


        // =====================================================
        // INVALID TOKEN
        // =====================================================

        if (user == null) {

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    "Invalid or expired reset token."
            );

            return response;
        }


        // =====================================================
        // TOKEN EXPIRY CHECK
        // =====================================================

        if (user.getResetTokenExpiry() == null
                || System.currentTimeMillis()
                > user.getResetTokenExpiry()) {

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    "Reset link has expired. Please request a new one."
            );

            return response;
        }


        // =====================================================
        // NEW PASSWORD
        // BCrypt hash karke save karenge.
        // =====================================================

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );


        // =====================================================
        // TOKEN INVALIDATE
        // =====================================================

        user.setResetToken(null);
        user.setResetTokenExpiry(null);


        userRepository.save(user);


        // =====================================================
        // SUCCESS
        // =====================================================

        response.put(
                "success",
                true
        );

        response.put(
                "message",
                "Password reset successful. You can now login with your new password."
        );

        return response;
    }


    // =========================================================
    // CHECK WHETHER PASSWORD IS BCRYPT
    // =========================================================

    private boolean isBCryptPassword(String password) {

        if (password == null) {
            return false;
        }

        return password.startsWith("$2a$")
                || password.startsWith("$2b$")
                || password.startsWith("$2y$");
    }


    // =========================================================
    // SECURE TOKEN GENERATOR
    // =========================================================

    private String generateSecureToken() {

        SecureRandom secureRandom =
                new SecureRandom();

        byte[] tokenBytes =
                new byte[32];

        secureRandom.nextBytes(tokenBytes);

        StringBuilder token =
                new StringBuilder();

        for (byte b : tokenBytes) {

            token.append(
                    String.format(
                            "%02x",
                            b
                    )
            );
        }

        return token.toString();
    }
}