'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';

const ReviewPage = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const { bookingId } = useParams();

  const handleStarClick = (starIndex) => {
    setRating(starIndex);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating.');
      return;
    }

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId, rating, review }),
      });

      if (response.ok) {
        toast.success('Review submitted successfully!');
        // Redirect to bookings page or a thank you page
        window.location.href = '/bookings';
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to submit review.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('An error occurred while submitting your review.');
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen font-inter text-white p-4 sm:p-10">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Leave a Review</h2>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">Rating</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                    onClick={() => handleStarClick(star)}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="review" className="block text-lg font-semibold mb-2">Review</label>
              <textarea
                id="review"
                rows="4"
                className="w-full bg-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition-shadow"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tell us about your experience..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
