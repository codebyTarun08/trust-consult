import { NextResponse } from 'next/server';
import { connect } from '@/lib/dbConfig';
import Booking from '@/models/bookingModel';
import Review from '@/models/reviewModel';

connect();

export async function POST(request) {
  try {
    const { bookingId, rating, comment } = await request.json();

    if (!bookingId || !rating) {
      return NextResponse.json({ message: 'Booking ID and rating are required.' }, { status: 400 });
    }

    const booking = await Booking.findById(bookingId).populate('consultantId');

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found.' }, { status: 404 });
    }

    const review = new Review({
      booking: bookingId,
      consultant: booking.consultantId._id,
      user: booking.userId,
      rating,
      comment,
    });

    await review.save();

    booking.reviewStatus = true;
    await booking.save();

    return NextResponse.json({ message: 'Review submitted successfully.' });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ message: 'An error occurred while submitting the review.' }, { status: 500 });
  }
}
