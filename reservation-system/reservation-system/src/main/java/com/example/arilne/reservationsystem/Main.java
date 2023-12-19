package com.example.arilne.reservationsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.FileNotFoundException;
import java.net.MalformedURLException;


@SpringBootApplication
public class Main {

    public static void main(String[] args) throws FileNotFoundException, MalformedURLException {
        SpringApplication.run(Main.class, args);


//        EmailController emailController = new EmailController();
//
//        // The booking ID you want to create a PDF for and send
//        String bookingId = "55777b31-298c-4f4b-9afc-11403093f992";
//
//        // Send an email with the PDF as an attachment
//        String result = emailController.sendEmailWithAttachment(bookingId);
//
//        // Print the result
//        System.out.println(result);

    }
}
