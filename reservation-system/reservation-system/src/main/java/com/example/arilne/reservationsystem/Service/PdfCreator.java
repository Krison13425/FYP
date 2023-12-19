package com.example.arilne.reservationsystem.Service;

import com.example.arilne.reservationsystem.Access.*;
import com.example.arilne.reservationsystem.Model.*;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.color.Color;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.border.Border;
import com.itextpdf.layout.border.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.property.TextAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.Time;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class PdfCreator {

    @Autowired
    BookingAccess bookingAccess;
    @Autowired
    AirportAccess airportAccess;
    @Autowired
    PassengerAccess passengerAccess;
    @Autowired
    BundleAccess bundleAccess;
    @Autowired
    FlightAccess flightAccess;
    @Autowired
    MealAccess mealAccess;
    @Autowired
    SeatAccess seatAccess;

    @Autowired
    TransportationAccess transportationAccess;

    static Cell getHeaderTextCell(String textValue) {

        return new Cell().add(textValue).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT);
    }

    static Cell getHeaderTextCellValue(String textValue) {

        return new Cell().add(textValue).setBold().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.LEFT);
    }

    public byte[] createPdf(String bookingId) throws IOException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            String path = "Travel Itinerary.pdf";

            Booking booking = bookingAccess.getBookingById(bookingId);
            PdfWriter pdfWriter = new PdfWriter(outputStream);
            PdfDocument pdfDocument = new PdfDocument(pdfWriter);
            pdfDocument.setDefaultPageSize(PageSize.A4);
            Document document = new Document(pdfDocument);

            float threecol = 190f;
            float twocol = 285f;
            float twocol150 = twocol + 150f;
            float twocolumnWidth[] = {twocol150, twocol};
            float threeColumnWidth[] = {threecol, threecol, threecol};
            float fullwidth[] = {threecol * 3};
            Paragraph onesp = new Paragraph("\n");

            Image logo = null;
            try {

                logo = new Image(ImageDataFactory.create("C:\\Users\\Krison\\Downloads\\reservation-system\\reservation-system\\src\\main\\resources\\logo\\logo.png"));
                logo.scaleToFit(100, 100);
            } catch (Exception e) {
                e.printStackTrace();
            }

            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
            String dateString = dateFormat.format(new Date());

            Table table = new Table(twocolumnWidth);
            table.addCell(new Cell().add(logo).setBorder(Border.NO_BORDER).setBold());
            Table nestedtabe = new Table(new float[]{twocol / 2, twocol / 2});
            nestedtabe.addCell(getHeaderTextCell("Booking ID:"));
            nestedtabe.addCell(getHeaderTextCellValue(booking.getReferenceId()));
            nestedtabe.addCell(getHeaderTextCell("Booking Date:"));
            nestedtabe.addCell(getHeaderTextCellValue(dateString));

            table.addCell(nestedtabe.setBorder(Border.NO_BORDER));

            Table divider = new Table(fullwidth);
            document.add(table);
            document.add(onesp);
            document.add(divider);

            Table title = new Table(fullwidth);
            title.addCell(new Cell().add("Travel Itinerary").setBorder(Border.NO_BORDER));
            document.add(title);
            document.add(onesp);

            if (booking.getDepartureFlightId() != null) {

                Table flightTable = new Table(threeColumnWidth);
                flightTable.setBorder(new SolidBorder(1));
                flightTable.setBackgroundColor(Color.GRAY, 0.7f);
                Flight flight = flightAccess.getFlightById(booking.getDepartureFlightId());

                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("EEEE, dd MMM yyyy");
                String departureDateStr = simpleDateFormat.format(flight.getDeparture_time());

                Time duration = flight.getDuration_time();
                String durationStr = duration.getHours() + " Hours " + duration.getMinutes() + " Minutes";

                flightTable.addCell(new Cell().add("Flight 1 ").setBorder(Border.NO_BORDER));
                flightTable.addCell(new Cell().add(departureDateStr).setBorder(Border.NO_BORDER));
                flightTable.addCell(new Cell().add(durationStr).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT));
                document.add(flightTable);

                Table flightTableDetails = new Table(threeColumnWidth);
                flightTableDetails.setBorder(new SolidBorder(1));

                SimpleDateFormat simpleTimeFormat = new SimpleDateFormat("HH:mm");
                String departureTimeStr = simpleTimeFormat.format(flight.getDeparture_time());
                String arrivalTimeStr = simpleTimeFormat.format(flight.getArrival_time());

                Airport depAirport = airportAccess.getAirportDetails(flight.getDeparture_airport());
                Airport arrAirport = airportAccess.getAirportDetails(flight.getArrival_airport());


                flightTableDetails.addCell(new Cell().add(departureTimeStr).setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add(depAirport.getMunicipal()).setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("to").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("to").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add(arrivalTimeStr).setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add(arrAirport.getMunicipal()).setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add(flight.getAirplane_name()).setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add(durationStr).setFontColor(Color.GRAY).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT));

                document.add(flightTableDetails);

            }

            document.add(onesp);

            if (booking.getReturnFlightId() != null) {

                Table flightTable = new Table(threeColumnWidth);
                flightTable.setBorder(new SolidBorder(1));
                flightTable.setBackgroundColor(Color.GRAY, 0.7f);
                Flight flight = flightAccess.getFlightById(booking.getReturnFlightId());

                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("EEEE, dd MMM yyyy");
                String departureDateStr = simpleDateFormat.format(flight.getDeparture_time());

                Time duration = flight.getDuration_time();
                String durationStr = duration.getHours() + " Hours " + duration.getMinutes() + " Minutes";

                flightTable.addCell(new Cell().add("Flight 2 ").setBorder(Border.NO_BORDER));
                flightTable.addCell(new Cell().add(departureDateStr).setBorder(Border.NO_BORDER));
                flightTable.addCell(new Cell().add(durationStr).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT));
                document.add(flightTable);

                Table flightTableDetails = new Table(threeColumnWidth);
                flightTableDetails.setBorder(new SolidBorder(1));

                SimpleDateFormat simpleTimeFormat = new SimpleDateFormat("HH:mm");
                String departureTimeStr = simpleTimeFormat.format(flight.getDeparture_time());
                String arrivalTimeStr = simpleTimeFormat.format(flight.getArrival_time());

                Airport depAirport = airportAccess.getAirportDetails(flight.getDeparture_airport());
                Airport arrAirport = airportAccess.getAirportDetails(flight.getArrival_airport());


                flightTableDetails.addCell(new Cell().add(departureTimeStr).setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add(depAirport.getMunicipal()).setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("to").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("to").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add(arrivalTimeStr).setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add(arrAirport.getMunicipal()).setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add(flight.getAirplane_name()).setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add("").setBorder(Border.NO_BORDER));
                flightTableDetails.addCell(new Cell().add(durationStr).setFontColor(Color.GRAY).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT));

                document.add(flightTableDetails);

            }

            document.add(onesp);

            Table passengerTable = new Table(fullwidth);
            passengerTable.setBorder(new SolidBorder(1));
            passengerTable.addCell(new Cell().add("GUESTS").setBorder(Border.NO_BORDER));
            float padding = 10f;

            if (booking.getDepartureFlightId() != null || booking.getReturnFlightId() != null) {
                List<Passenger> depPassengers = passengerAccess.findByFlightIdAndBookingId(booking.getDepartureFlightId(), bookingId);
                List<Passenger> retPassengers = passengerAccess.findByFlightIdAndBookingId(booking.getReturnFlightId(), bookingId);

                Flight depFlight = flightAccess.getFlightById(booking.getDepartureFlightId());
                Flight retFlight = flightAccess.getFlightById(booking.getReturnFlightId());

                Bundle depbundle = bundleAccess.getBundleById(booking.getDepartureBundleId());
                Bundle retbundle = bundleAccess.getBundleById(booking.getReturnBundleId());

                if (depPassengers != null && depbundle != null && depFlight != null) {

                    Table nestedTable = new Table(threeColumnWidth);
                    nestedTable.addCell(new Cell().add(depFlight.getAirplane_name()).setBorder(Border.NO_BORDER).setBackgroundColor(Color.LIGHT_GRAY));
                    nestedTable.addCell(new Cell().add("").setBorder(Border.NO_BORDER).setBackgroundColor(Color.LIGHT_GRAY));
                    nestedTable.addCell(new Cell().add(depbundle.getName()).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT).setBackgroundColor(Color.LIGHT_GRAY));

                    passengerTable.addCell(new Cell().add(nestedTable).setBorder(Border.NO_BORDER));

                    for (Passenger passenger : depPassengers) {


                        passengerTable.addCell(new Cell().add(passenger.getSelectedTitle() + ". " + passenger.getFirstName() + " " + passenger.getLastName()).setBorder(Border.NO_BORDER).setBold());
                        if (passenger.getType() != 2) {
                            Seat seat = seatAccess.getSeatById(passenger.getSeatId());
                            passengerTable.addCell(new Cell().add("• Seat " + seat.getSeatRow() + seat.getSeatLetter()).setBorder(Border.NO_BORDER));
                            passengerTable.addCell(new Cell().add("• Mineral Water 250 ML").setBorder(Border.NO_BORDER));
                            Meal meal = mealAccess.getMealById(passenger.getMealId());
                            passengerTable.addCell(new Cell().add("• " + meal.getName()).setBorder(Border.NO_BORDER));
                            passengerTable.addCell(new Cell().add("• Checked Baggage " + passenger.getBaggage() + " Kg").setBorder(Border.NO_BORDER));
                        }
                        passengerTable.addCell(new Cell().add(" ").setBorder(Border.NO_BORDER).setPaddingBottom(padding));


                    }


                }

                if (retPassengers != null && retFlight != null && retbundle != null) {

                    Table nestedTable = new Table(threeColumnWidth);
                    nestedTable.addCell(new Cell().add(retFlight.getAirplane_name()).setBorder(Border.NO_BORDER).setBackgroundColor(Color.LIGHT_GRAY));
                    nestedTable.addCell(new Cell().add("").setBorder(Border.NO_BORDER).setBackgroundColor(Color.LIGHT_GRAY));
                    nestedTable.addCell(new Cell().add(retbundle.getName()).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT).setBackgroundColor(Color.LIGHT_GRAY));

                    passengerTable.addCell(new Cell().add(nestedTable).setBorder(Border.NO_BORDER));


                    for (Passenger passenger : retPassengers) {


                        passengerTable.addCell(new Cell().add(passenger.getSelectedTitle() + ". " + passenger.getFirstName() + " " + passenger.getLastName()).setBorder(Border.NO_BORDER).setBold());
                        if (passenger.getType() != 2) {
                            Seat seat = seatAccess.getSeatById(passenger.getSeatId());
                            passengerTable.addCell(new Cell().add("• Seat " + seat.getSeatRow() + seat.getSeatLetter()).setBorder(Border.NO_BORDER));
                            passengerTable.addCell(new Cell().add("• Mineral Water 250 ML").setBorder(Border.NO_BORDER));
                            Meal meal = mealAccess.getMealById(passenger.getMealId());
                            passengerTable.addCell(new Cell().add("• " + meal.getName()).setBorder(Border.NO_BORDER));
                            passengerTable.addCell(new Cell().add("• Checked Baggage" + passenger.getBaggage() + "Kg").setBorder(Border.NO_BORDER));
                        }

                        passengerTable.addCell(new Cell().add(" ").setBorder(Border.NO_BORDER).setPaddingBottom(padding));


                    }


                }


                document.add(passengerTable);
            }

            document.add(onesp);

            if (booking.getTransportId() != null) {

                Table TransportTable = new Table(fullwidth);
                passengerTable.setBorder(new SolidBorder(1));
                passengerTable.addCell(new Cell().add("TRANSPORT").setBorder(Border.NO_BORDER));


                Transport transport = transportationAccess.getTransportById(booking.getTransportId());
                Flight depFlight = flightAccess.getFlightById(booking.getDepartureFlightId());
                Flight retFlight = flightAccess.getFlightById(booking.getReturnFlightId());

                Airport airport = airportAccess.getAirportDetails(depFlight.getDeparture_airport());

                Date departureTime = depFlight.getDeparture_time();

                Calendar cal = Calendar.getInstance();
                cal.setTime(departureTime);
                cal.add(Calendar.HOUR, -3);
                Date threeHoursBeforeDeparture = cal.getTime();


                TransportTable.addCell(new Cell().add(transport.getName()).setBold().setBackgroundColor(Color.LIGHT_GRAY));

                TransportTable.addCell(new Cell().add("Departure Transportation").setBorder(Border.NO_BORDER).setBold());
                TransportTable.addCell(new Cell().add("• Pax: " + transport.getCapacity()).setBorder(Border.NO_BORDER));
                TransportTable.addCell(new Cell().add("• Luggage:" + transport.getLuggage() + " luggages").setBorder(Border.NO_BORDER));
                TransportTable.addCell(new Cell().add("• Pick Up Address: " + booking.getAddress()).setBorder(Border.NO_BORDER));
                TransportTable.addCell(new Cell().add("• Drop of Address: Kuala Lumpur International Airport, 64000 Sepang, Selangor").setBorder(Border.NO_BORDER));
                TransportTable.addCell(new Cell().add("• Estimated Pick Up Time: " + threeHoursBeforeDeparture).setBorder(Border.NO_BORDER).setBold().setBackgroundColor(Color.YELLOW));


                if (booking.getIsReturnTransport() == 1 && retFlight != null) {

                    Date pickuptime = retFlight.getArrival_time();

                    TransportTable.addCell(new Cell().add("Return Transportation").setBorder(Border.NO_BORDER).setBold());
                    TransportTable.addCell(new Cell().add("• Pax: " + transport.getCapacity()).setBorder(Border.NO_BORDER));
                    TransportTable.addCell(new Cell().add("• Luggage:" + transport.getLuggage() + " luggages").setBorder(Border.NO_BORDER));
                    TransportTable.addCell(new Cell().add("• Pick Up Address: Kuala Lumpur International Airport, 64000 Sepang, Selangor").setBorder(Border.NO_BORDER));
                    TransportTable.addCell(new Cell().add("• Drop of Address: " + booking.getAddress()).setBorder(Border.NO_BORDER));
                    TransportTable.addCell(new Cell().add("• Estimated Pick Up Time: " + pickuptime).setBorder(Border.NO_BORDER).setBold().setBackgroundColor(Color.YELLOW));

                }

                document.add(TransportTable);

            }


            document.close();
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new IOException("Failed to generate the PDF", e);
        }
    }


}
