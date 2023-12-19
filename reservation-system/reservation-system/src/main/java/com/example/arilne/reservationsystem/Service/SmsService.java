package com.example.arilne.reservationsystem.Service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.trial_number}")
    private String trialNumber;

    public void sendSms(String to, String body) {
        Message message = Message.creator(
                        new PhoneNumber(to),
                        new PhoneNumber(trialNumber),
                        body)
                .create();
        System.out.println("Sent message w/ SID: " + message.getSid());
    }
}
