package com.career.recommendation.service;

import com.google.firebase.auth.FirebaseAuth;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class FirebasePasswordResetService {

    private static final String FRONTEND_RESET_URL =
            "https://ai-career-recommendation-tau.vercel.app/reset-password";

    public String generatePasswordResetLink(String email) {

        try {

            // Firebase official reset link generate karega
            String firebaseLink =
                    FirebaseAuth.getInstance()
                            .generatePasswordResetLink(email);

            // Firebase generated link ke query parameters nikalo
            URI uri = URI.create(firebaseLink);

            Map<String, String> params =
                    parseQuery(uri.getRawQuery());

            String mode = params.get("mode");
            String oobCode = params.get("oobCode");
            String apiKey = params.get("apiKey");

            if (oobCode == null || apiKey == null) {
                throw new RuntimeException(
                        "Firebase reset link does not contain required parameters."
                );
            }

            // Apne Vercel ResetPassword page ka link banao
            return FRONTEND_RESET_URL
                    + "?mode="
                    + encode(mode)
                    + "&oobCode="
                    + encode(oobCode)
                    + "&apiKey="
                    + encode(apiKey);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to generate Firebase password reset link",
                    e
            );
        }
    }

    private Map<String, String> parseQuery(String query) {

        Map<String, String> params = new HashMap<>();

        if (query == null || query.isEmpty()) {
            return params;
        }

        for (String pair : query.split("&")) {

            String[] parts = pair.split("=", 2);

            String key = URLDecoder.decode(
                    parts[0],
                    StandardCharsets.UTF_8
            );

            String value = parts.length > 1
                    ? URLDecoder.decode(
                            parts[1],
                            StandardCharsets.UTF_8
                    )
                    : "";

            params.put(key, value);
        }

        return params;
    }

    private String encode(String value) {

        if (value == null) {
            return "";
        }

        return java.net.URLEncoder
                .encode(value, StandardCharsets.UTF_8);
    }
}