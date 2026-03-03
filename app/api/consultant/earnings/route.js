import databaseConnection from "@/lib/dbConfig";
import Booking from "@/models/bookingModel";
import { NextResponse } from "next/server";

export async function GET(request) {
    await  databaseConnection();

    const { searchParams } = new URL(request.url);
    const consultantId = searchParams.get('consultantId');

    if (!consultantId) {
        return NextResponse.json({ message: "Consultant ID is required" }, { status: 400 });
    }

    try {
        const bookings = await Booking.find({ consultantId: consultantId });

        const totalBookings = bookings.length;
        const pendingTransactions = bookings.filter(b => b.status === 'confirmed').length;
        const totalEarnings = bookings
            .filter(b => b.status === 'completed')
            .reduce((acc, b) => acc + (b.slot.bookingAmount || 0), 0);

        const monthlyEarnings = bookings
            .filter(b => b.status === 'completed')
            .reduce((acc, b) => {
                const month = new Date(b.createdAt).toLocaleString('default', { month: 'long' });
                acc[month] = (acc[month] || 0) + (b.slot.bookingAmount || 0);
                return acc;
            }, {});

        const pendingMoney = bookings
            .filter(b => b.status === 'confirmed')
            .reduce((acc, b) => acc + (b.slot.bookingAmount || 0), 0);

        const completedBookings = bookings.filter(b => b.status === 'completed').length;

        return NextResponse.json({
            totalEarnings,
            pendingTransactions,
            totalBookings,
            monthlyEarnings,
            pendingMoney,
            completedBookings,
        });
    } catch (error) {
        console.error("Error fetching earnings data:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}