package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.BookingAccess;
import com.example.arilne.reservationsystem.Model.Booking;
import com.example.arilne.reservationsystem.Model.User;
import jakarta.activation.DataSource;
import jakarta.activation.FileDataSource;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;

@Service
public class EmailService {

    @Autowired
    JavaMailSender emailSender;
    @Autowired
    PdfCreator pdfCreator;

    @Autowired
    BookingAccess bookingAccess;

    public void sendEmailWithAttachment(String bookingId) throws Exception {

        Booking booking = bookingAccess.getBookingById(bookingId);
        String to = booking.getEmail();
        String from = "skywingsairline2023@gmail.com";

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        String customerName = booking.getTitle() + ". " + booking.getFirstName() + " " + booking.getLastName();
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject("Travel Itinerary from SkyWings");
        helper.setText("Dear " + customerName + ",\n" +
                "\n" +
                "Thank you for choosing SkyWings for your upcoming journey. We're delighted to assist you on your travels and look forward to offering you a comfortable and enjoyable experience. \n" +
                "\n" +
                "Please find attached your travel itinerary. Please ensure that you either print this travel itinerary or have it available on your mobile device when you arrive at the airport.\n" +
                "\n" +
                "Safe travels,\n" +
                "The SkyWings Team");

        byte[] pdfBytes = pdfCreator.createPdf(bookingId);
        File pdfFile = File.createTempFile("Travel Itinerary", ".pdf");
        try (FileOutputStream fos = new FileOutputStream(pdfFile)) {
            fos.write(pdfBytes);
        }

        DataSource source = new FileDataSource(pdfFile.getPath());
        helper.addAttachment(pdfFile.getName(), source);

        pdfFile.deleteOnExit();

        emailSender.send(message);
    }

    public void sendVerificationEmail(User user) throws Exception {
        String to = user.getUserEmail();
        String from = "skywingsairline2023@gmail.com";

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject("Please verify your email");

        String linkText = "Click here to verify your email";
        String verifyURL = "http://localhost:8080/api/v1/auth/verify-email?token=" + user.getVerificationToken();

        String emailText = "Dear " + user.getUserName() + ",<br>" +
                "<br>" +
                "Thank you for registering. Please <a href=\"" + verifyURL + "\">" + linkText + "</a> to verify your email.<br>" +
                "<br>" +
                "Best Regards,<br>" +
                "The SkyWings Team";

        helper.setText(emailText, true);

        emailSender.send(message);
    }


    public void sendPasswordResetEmail(User user) throws Exception {
        String to = user.getUserEmail();
        String from = "skywingsairline2023@gmail.com";

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject("Password reset request");

        String linkText = "Click here to reset your password";
        String resetURL = "http://localhost:3000/ResetPassword?token=" + user.getVerificationToken();

        String emailText = "Dear " + user.getUserName() + ",<br>" +
                "<br>" +
                "We received a request to reset your password. Please <a href=\"" + resetURL + "\">" + linkText + "</a> to complete the process.<br>" +
                "<br>" +
                "If you didn't make this request, please ignore this email.<br>" +
                "<br>" +
                "Best Regards,<br>" +
                "The SkyWings Team";

        helper.setText(emailText, true);

        emailSender.send(message);
    }


    public void sendDelayedFlightEmail(Booking booking, String newDepartureTime) throws Exception {
        String to = booking.getEmail();
        String from = "skywingsairline2023@gmail.com";

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        String customerName = booking.getTitle() + ". " + booking.getFirstName() + " " + booking.getLastName();
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject("Important: Your Flight Has Been Delayed");

        helper.setText("Dear " + customerName + ",\n" +
                "\n" +
                "We regret to inform you that your flight has been delayed. The new departure time is: " + newDepartureTime + "\n" +
                "\n" +
                "We apologize for any inconvenience this may cause and appreciate your understanding. If you have any questions or need further assistance, please don't hesitate to contact us.\n" +
                "\n" +
                "Safe travels,\n" +
                "The SkyWings Team");

        emailSender.send(message);
    }


    public void sendPasswordResetConfirmationEmail(User user) throws Exception {
        String to = user.getUserEmail();
        String from = "skywingsairline2023@gmail.com";

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject("Password Reset Confirmation");

        String emailText = "Dear " + user.getUserName() + ",\n" +
                "\n" +
                "Your password has been successfully reset. If you did not request this change, please contact our support team immediately.\n" +
                "\n" +
                "Best Regards,\n" +
                "The SkyWings Team";

        helper.setText(emailText);

        emailSender.send(message);
    }
}
