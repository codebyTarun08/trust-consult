import { NextResponse } from "next/server";
import databaseConnection from "@/lib/dbConfig";
import Booking from "@/models/bookingModel";
import User from "@/models/userModel";
import { bookingCreatedClientTemplate,bookingCreatedConsultantTemplate } from "@/mail/bookingCreatedMail";
import { mailSender } from "@/utils/mailSender";

const sendBookingCreationEmail = async (role, email, subject, bookingDetails) => {
    try {
        let emailBody;
        if (role === "Consultant") {
            emailBody = bookingCreatedConsultantTemplate(bookingDetails);
        } else if (role === "Client") {
            emailBody = bookingCreatedClientTemplate(bookingDetails);
        }

        const mailResponse = await mailSender(subject, email, emailBody);
        //console.log("Mail Response: ", mailResponse);

    } catch (error) {
        console.error("Error sending booking creation email:", error);
    }
};

export async function POST(request) {
    try {
        await databaseConnection();

        const { clientId, consultantId, description, slot } = await request.json();

        if (!clientId || !consultantId || !description || !slot) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        const Client = await User.findById(clientId);
        const Consultant = await User.findById(consultantId);

        // ❌ FIXED: Validate users properly
        if (!Client || !Consultant) {
            return NextResponse.json(
                { success: false, error: "Invalid clientId or consultantId" },
                { status: 400 }
            );
        }

        // Create booking
        const newBooking = await Booking.create({
            clientId,
            consultantId,
            description,
            slot,
            review: null,
        });

        const bookingDetails = {
            consultantName: `${Consultant.firstName} ${Consultant.lastName}`,
            clientName: `${Client.firstName} ${Client.lastName}`,
            date: slot.date,
            startHour: slot.startHour,
            endHour: slot.endHour,
            rate: slot.bookingAmount,
            problemDescription: description,
        };

        // Email notifications
        await sendBookingCreationEmail(
            "Client",
            Client.email,
            "New Booking Created - TrustConsult",
            bookingDetails
        );

        await sendBookingCreationEmail(
            "Consultant",
            Consultant.email,
            "New Booking Request - TrustConsult",
            bookingDetails
        );

        return NextResponse.json(
            { success: true, message: "Booking created successfully" },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create booking" },
            { status: 500 }
        );
    }
}
