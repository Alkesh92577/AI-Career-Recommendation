package com.career.recommendation.config;

import com.career.recommendation.model.User;
import com.career.recommendation.repository.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.ImportUserRecord;
import com.google.firebase.auth.UserImportOptions;
import com.google.firebase.auth.UserImportResult;
import com.google.firebase.auth.hash.Bcrypt;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

//@Component
public class FirebaseUserImportRunner implements CommandLineRunner {

    private final UserRepository userRepository;

    public FirebaseUserImportRunner(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        System.out.println("==========================================");
        System.out.println("FIREBASE USER IMPORT STARTED");
        System.out.println("==========================================");

        List<User> mysqlUsers = userRepository.findAll();

        List<ImportUserRecord> firebaseUsers = mysqlUsers.stream()
                .filter(user -> isBCryptPassword(user.getPassword()))
                .map(user -> ImportUserRecord.builder()
                        .setUid("mysql-" + user.getId())
                        .setEmail(user.getEmail())
                        .setDisplayName(user.getName())
                        .setPasswordHash(
                                user.getPassword()
                                        .getBytes(StandardCharsets.UTF_8)
                        )
                        .build())
                .collect(Collectors.toList());

        System.out.println("MySQL users found: " + mysqlUsers.size());
        System.out.println("BCrypt users to import: " + firebaseUsers.size());

        if (firebaseUsers.isEmpty()) {
            System.out.println("No BCrypt users found. Nothing to import.");
            return;
        }

        UserImportOptions options =
                UserImportOptions.withHash(Bcrypt.getInstance());

        UserImportResult result =
                FirebaseAuth.getInstance()
                        .importUsers(firebaseUsers, options);

        System.out.println("Successfully imported: "
                + result.getSuccessCount());

        System.out.println("Failed imports: "
                + result.getFailureCount());

        result.getErrors().forEach(error ->
                System.out.println(
                        "Failed index: "
                                + error.getIndex()
                                + " | Reason: "
                                + error.getReason()
                )
        );

        System.out.println("==========================================");
        System.out.println("FIREBASE USER IMPORT COMPLETED");
        System.out.println("==========================================");
    }

    private boolean isBCryptPassword(String password) {

        if (password == null) {
            return false;
        }

        return password.startsWith("$2a$")
                || password.startsWith("$2b$")
                || password.startsWith("$2y$");
    }
}