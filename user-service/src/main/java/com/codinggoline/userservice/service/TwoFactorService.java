package com.codinggoline.userservice.service;

import org.apache.commons.codec.binary.Base32;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Locale;

@Service
public class TwoFactorService {

    private static final int SECRET_SIZE = 20;
    private static final int WINDOW = 1; // ±1 pour tolérer le délai réseau
    private static final int DIGITS = 6;
    private static final int TIME_STEP = 30;

    private final Base32 base32 = new Base32();
    private final SecureRandom secureRandom = new SecureRandom();

    public String generateSecret() {
        byte[] buffer = new byte[SECRET_SIZE];
        secureRandom.nextBytes(buffer);
        // Encoder sans padding et sans espaces
        String secret = base32.encodeToString(buffer);
        // Retirer le padding '=' et les espaces
        return secret.replaceAll("=", "").replaceAll("\\s", "");
    }

    public boolean verifyCode(String base32Secret, int code) {
        if (base32Secret == null || base32Secret.isEmpty()) {
            return false;
        }

        try {
            // Normaliser le secret (majuscules, sans espaces)
            String normalizedSecret = base32Secret.toUpperCase().replaceAll("\\s", "");
            byte[] keyBytes = base32.decode(normalizedSecret);

            if (keyBytes == null || keyBytes.length == 0) {
                return false;
            }

            long timeWindow = Instant.now().getEpochSecond() / TIME_STEP;

            // Vérifier la fenêtre de temps
            for (long i = -WINDOW; i <= WINDOW; i++) {
                int candidate = generateTOTP(keyBytes, timeWindow + i);
                if (candidate == code) {
                    return true;
                }
            }
        } catch (Exception e) {
            // Log l'erreur pour debug
            System.err.println("Error verifying 2FA code: " + e.getMessage());
            return false;
        }
        return false;
    }

    private int generateTOTP(byte[] key, long time) throws GeneralSecurityException {
        byte[] data = new byte[8];
        long value = time;
        for (int i = 8; i-- > 0; value >>>= 8) {
            data[i] = (byte) value;
        }

        Mac mac = Mac.getInstance("HmacSHA1");
        SecretKeySpec signKey = new SecretKeySpec(key, "HmacSHA1");
        mac.init(signKey);
        byte[] hash = mac.doFinal(data);

        int offset = hash[hash.length - 1] & 0xF;
        int binary = ((hash[offset] & 0x7f) << 24)
                | ((hash[offset + 1] & 0xff) << 16)
                | ((hash[offset + 2] & 0xff) << 8)
                | (hash[offset + 3] & 0xff);

        int otp = binary % 1_000_000;
        return otp;
    }

    public String getOtpAuthUri(String secret, String account, String issuer) {
        // Normaliser le secret avant de l'inclure dans l'URI
        String normalizedSecret = secret.replaceAll("=", "").replaceAll("\\s", "");
        String label = String.format("%s:%s", issuer, account);

        return String.format(Locale.US,
                "otpauth://totp/%s?secret=%s&issuer=%s&digits=%d&period=%d&algorithm=SHA1",
                URLEncoder.encode(label, StandardCharsets.UTF_8),
                normalizedSecret,
                URLEncoder.encode(issuer, StandardCharsets.UTF_8),
                DIGITS,
                TIME_STEP
        );
    }
}