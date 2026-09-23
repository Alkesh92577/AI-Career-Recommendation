package com.career.recommendation.service;

import com.career.recommendation.dto.LoginRequest;
import com.career.recommendation.dto.RegisterRequest;
import com.career.recommendation.model.User;
import com.career.recommendation.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FirebasePasswordResetService firebasePasswordResetService;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            FirebasePasswordResetService firebasePasswordResetService) {

        this.userRepository = userRepository;
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

        // Password ko plain text me save nahi karna.
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
        // NEW USERS - BCrypt
        // =====================================================

        if (isBCryptPassword(storedPassword)) {

            passwordMatches = passwordEncoder.matches(
                    request.getPassword(),
                    storedPassword
            );
        }

        // =====================================================
        // OLD USERS - Plain Text
        // =====================================================

        else {

            passwordMatches =
                    storedPassword != null
                            && storedPassword.equals(request.getPassword());

            // Successful login ke baad BCrypt me convert.
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

        // Security:
        // User exists hai ya nahi, dono cases mein same message.
        if (user == null) {

            response.put("success", true);
            response.put(
                    "message",
                    "If an account exists with this email, a password reset link will be sent."
            );

            return response;
        }

        // =====================================================
        // OLD MYSQL RESET TOKEN
        // =====================================================
        // Ye abhi database compatibility ke liye rakha gaya hai.
        // Actual Firebase reset link FirebasePasswordResetService
        // generate karega.

        String resetToken = generateSecureToken();

        long expiryTime =
                System.currentTimeMillis()
                        + (15 * 60 * 1000);

        user.setResetToken(resetToken);
        user.setResetTokenExpiry(expiryTime);

        userRepository.save(user);

        // =====================================================
        // FIREBASE RESET LINK
        // =====================================================

        String resetLink =
                firebasePasswordResetService
                        .generatePasswordResetLink(user.getEmail());

        // =====================================================
        // SEND EMAIL USING RESEND API
        // =====================================================

        try {

            sendPasswordResetEmail(
                    user.getEmail(),
                    user.getName(),
                    resetLink
            );

        } catch (Exception e) {

            System.err.println(
                    "❌ Resend email sending failed: "
                            + e.getMessage()
            );

            response.put("success", false);
            response.put(
                    "message",
                    "Unable to send password reset email. Please try again later."
            );

            return response;
        }

        response.put("success", true);
        response.put(
                "message",
                "If an account exists with this email, a password reset link will be sent."
        );

        return response;
    }

    // =========================================================
    // RESEND EMAIL API
    // =========================================================

    private void sendPasswordResetEmail(
            String recipientEmail,
            String recipientName,
            String resetLink) throws Exception {

        String apiKey = System.getenv("RESEND_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {

            throw new IllegalStateException(
                    "RESEND_API_KEY environment variable is not configured."
            );
        }

        /*
         * Free Resend testing sender.
         *
         * IMPORTANT:
         * onboarding@resend.dev can be used for testing,
         * but Resend may restrict recipients unless your
         * sending domain is verified.
         *
         * We can change this later to your verified domain.
         */
        String fromEmail =
                System.getenv("RESEND_FROM_EMAIL");

        if (fromEmail == null || fromEmail.isBlank()) {

            fromEmail = "onboarding@resend.dev";
        }

        String fromName =
                System.getenv("RESEND_FROM_NAME");

        if (fromName == null || fromName.isBlank()) {

            fromName = "AI Career Recommendation";
        }

        String subject =
                "AI Career Recommendation - Password Reset";

        String text =
                "Hello " + recipientName + ",\n\n"
                        + "We received a request to reset your password.\n\n"
                        + "Click the link below to create a new password:\n\n"
                        + resetLink + "\n\n"
                        + "This link will expire in 15 minutes.\n\n"
                        + "If you did not request a password reset, "
                        + "you can safely ignore this email.\n\n"
                        + "Regards,\n"
                        + "AI Career Recommendation Team";

        String jsonBody =
                "{"
                        + "\"from\":\""
                        + escapeJson(fromName + " <" + fromEmail + ">")
                        + "\","
                        + "\"to\":[\""
                        + escapeJson(recipientEmail)
                        + "\"],"
                        + "\"subject\":\""
                        + escapeJson(subject)
                        + "\","
                        + "\"text\":\""
                        + escapeJson(text)
                        + "\""
                        + "}";

        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(URI.create("https://api.resend.com/emails"))
                        .header(
                                "Authorization",
                                "Bearer " + apiKey
                        )
                        .header(
                                "Content-Type",
                                "application/json"
                        )
                        .POST(
                                HttpRequest.BodyPublishers.ofString(
                                        jsonBody
                                )
                        )
                        .build();

        HttpResponse<String> response =
                httpClient.send(
                        request,
                        HttpResponse.BodyHandlers.ofString()
                );

        System.out.println(
                "📧 Resend HTTP Status: "
                        + response.statusCode()
        );

        if (response.statusCode() < 200
                || response.statusCode() >= 300) {

            System.err.println(
                    "❌ Resend API Response: "
                            + response.body()
            );

            throw new RuntimeException(
                    "Resend API failed with HTTP "
                            + response.statusCode()
            );
        }

        System.out.println(
                "✅ Password reset email sent successfully through Resend."
        );
    }

    // =========================================================
    // JSON ESCAPE
    // =========================================================

    private String escapeJson(String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\r", "\\r")
                .replace("\n", "\\n")
                .replace("\t", "\\t");
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

            response.put("success", false);
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

            response.put("success", false);
            response.put(
                    "message",
                    "Reset link has expired. Please request a new one."
            );

            return response;
        }

        // =====================================================
        // NEW PASSWORD
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

        response.put("success", true);
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