// generate QR (token or image)
// store path/token


package com.reservex.backend.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

@Service
public class QrCodeService {

    private static final int WIDTH = 300;
    private static final int HEIGHT = 300;

    public byte[] generateQrCodeBytes(String content) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix matrix = writer.encode(content, BarcodeFormat.QR_CODE, WIDTH, HEIGHT);
            var out = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }

    public byte[] generateQrCodeForReservation(String qrCodeToken) {
        // Generate QR code with the token/UUID
        // This can be scanned at the venue to verify the reservation
        return generateQrCodeBytes(qrCodeToken);
    }
    
    public byte[] generateQrCodeForReservationWithDetails(Integer reservationId, String qrCodeToken, String businessName) {
        // Create a more detailed QR code content
        String qrContent = String.format("RESERVATION_ID:%d|TOKEN:%s|BUSINESS:%s", 
            reservationId, qrCodeToken, businessName);
        return generateQrCodeBytes(qrContent);
    }
}
