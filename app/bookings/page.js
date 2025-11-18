"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { getBookings } from "@/services/clientService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faUserTie,
  faIndianRupeeSign,
  faSpinner,
  faTimesCircle,
  faCheckCircle,
  faCircleInfo,
  faStar,
  faComments,
  faHourglass,
  faMoneyCheckAlt,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const formatHour = (hour) => {
  const h = hour % 12 || 12;
  const ampm = hour < 12 || hour === 24 ? "AM" : "PM";
  return `${h}:00 ${ampm}`;
};

// Display slot as "9:00 AM - 10:00 AM"
const formatSlotForDisplay = (slotObject) => {
  if (!slotObject || slotObject.startHour === undefined || slotObject.endHour === undefined) return "N/A";
  const start = formatHour(slotObject.startHour);
  const end = formatHour(slotObject.endHour);
  return `${start} - ${end}`;
};

// Format ISO date to human-readable
const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

// Check if current time is within booking slot time
const isChatActive = (slot) => {
  const now = new Date();
  const start = new Date(slot.date);
  start.setHours(slot.startHour, 0, 0);
  const end = new Date(slot.date);
  end.setHours(slot.endHour, 0, 0);
  return (now >= start);
};

// Status badge (booking + payment)
const getStatusBadge = (status) => {
  const baseClasses = "text-xs px-2 py-0.5 rounded-full font-bold shadow-sm";

  //If else ladder for payment status
  if (status === "unpaid") {
    return (
      // <span className={`${baseClasses} bg-red-600 text-white`}>
      //   <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-1" /> UNPAID
      // </span>
    <span
      className={`${baseClasses} flex items-center gap-1 px-2 rounded-full text-red-600 font-semibold backdrop-blur-md bg-red-600/15 border border-red-600/25 shadow-sm shadow-red-600/20`}
    >
      <FontAwesomeIcon icon={faIndianRupeeSign} className="text-sm" />
      UNPAID
    </span>
    );
  }else if (status === "paid") {
    return (
    <span
      className={`${baseClasses} flex items-center gap-0.5 px-2 rounded-full text-green-600 font-semibold backdrop-blur-md bg-green-600/15 border border-green-600/25 shadow-sm shadow-green-600/20`}
    >
      <FontAwesomeIcon icon={faIndianRupeeSign} className="text-sm" />
      PAID
    </span>
    );
  }

  switch (status) {
    case "completed":
      return (
        <span 
          className={`${baseClasses} flex items-center gap-0.5 px-2 rounded-full text-green-600 font-semibold backdrop-blur-md bg-green-600/15 border border-green-600/25 shadow-sm shadow-green-600/20`}
        >
          <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> COMPLETED
        </span>
      );
    case "cancelled":
      return (
        <span 
          className={`${baseClasses} flex items-center gap-0.5 px-2 rounded-full text-gray-400  font-semibold backdrop-blur-md bg-gray-600/40 border border-gray-600 shadow-sm shadow-gray-600/40`}
        >
          <FontAwesomeIcon icon={faTimesCircle} className="mr-1" /> CANCELLED
        </span>
      );
    case "pending":
      return (
        <span
          className={`${baseClasses} flex items-center gap-0.5 px-2 rounded-full text-yellow-500 font-semibold backdrop-blur-md bg-yellow-600/25 border border-yellow-600/25 shadow-sm shadow-yellow-600/20`}
        >
          <FontAwesomeIcon icon={faClock} className="mr-1" /> PENDING
        </span>
      );
    case "confirmed":
      return (
        <span
          className={`${baseClasses} flex justify-center items-center gap-0.5 px-2 rounded-full text-sky-500 font-semibold backdrop-blur-md bg-blue-500/25 border border-blue-500/35 shadow-sm shadow-blue-600/20`}
        >
          <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> CONFIRMED
        </span>
      );
    default:
      return (
        <span
          className={`${baseClasses} flex justify-center items-center gap-0.5 px-2 rounded-full text-white font-semibold backdrop-blur-md bg-neutral-500/25 border border-neutral-500/35 shadow-sm shadow-neutral-600/20`}
        >
          STATUS UNKNOWN
        </span>
      );
  }
};

const BookingsPage = () => {
  const dispatch = useDispatch();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        let payload = {
          userId : user._id,
          role: user.role
        }
        const result = await dispatch(getBookings(payload));
        setBookings(result?.data || result || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load your booking history.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [dispatch]);

  // ---------------------- Filter Bookings ----------------------
  const filteredBookings = useMemo(() => {
    const now = new Date();

    return bookings.filter((b) => {
      const bookingDate = new Date(b.slot.date);

      switch (activeTab) {
        case "upcoming":
          return b.status === "confirmed" && bookingDate >= now;
        case "payment_pending":
          return b.paymentStatus === "unpaid";
        case "completed":
          return b.status === "completed";
        case "all":
        default:
          return true;
      }
    });
  }, [bookings, activeTab]);

  // ---------------------- Action Handlers ----------------------

  const handleChat = (bookingId, slot) => {
    if (!isChatActive(slot)) {
      toast.error("Chat will open only during your scheduled slot time.");
      return;
    }
    window.location.href = `/chat/${bookingId}`;
  };

  const handlePay = (bookingId) => {
    toast.success(`Redirecting to payment for Booking ID: ${bookingId}`);
    // Implement payment modal or redirect logic
  };

  const handleReview = (bookingId) => {
    toast.success(`Opening review form for Booking ID: ${bookingId}`);
    // Implement review modal or separate page
  };

  // ---------------------- Render ----------------------
  if (loading) {
    return (
      <div className="bg-gray-900 h-[calc(100vh-4rem)] font-inter text-white p-10 flex justify-center items-center">
        <div className="flex flex-row justify-center items-center gap-4">
          <FontAwesomeIcon icon={faSpinner} spin className="w-8 h-8 text-blue-400" />
          <p className="text-xl text-blue-200">Loading your consultations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen font-inter text-white p-2 sm:p-4 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-8 text-white text-center sm:text-left">🗓️ My Consultation History</h2>

        {/* Tabs */}
        <div className="flex md:flex-wrap space-x-0 sm:space-x-4 mb-6 sm:mb-8 border-b border-gray-700 overflow-x-auto">
          {["all", "upcoming", "payment_pending", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer py-2 sm:py-3 px-3 sm:px-6 text-xs sm:text-base font-semibold transition-colors duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? "border-b-4 border-blue-500 text-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab === "all" && (
                <>
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> All Bookings
                </>
              )}
              
              {tab === "upcoming" && (
                <>
                  <FontAwesomeIcon icon={faClock} className="mr-2" /> Upcoming Consultations
                </>
              )}
              
              {tab === "payment_pending" && (
                <>
                  <FontAwesomeIcon icon={faMoneyCheckAlt} className="mr-2" /> Payment Pending
                </>
              )}

              {tab === "completed" && (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> Completed
                </>
              )}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="p-6 sm:p-10 bg-gray-800 rounded-lg text-center border-2 border-dashed border-gray-700">
            <p className="text-base sm:text-xl text-gray-400">
              {activeTab === "all" && "You haven't made any bookings yet."}
              {activeTab === "upcoming" && "No upcoming consultations found."}
              {activeTab === "payment_pending" && "No pending payments."}
              {activeTab === "completed" && "No completed consultations yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-700 flex flex-col justify-between min-w-0"
              >
                {/* Header */}
                <div className="flex flex-wrap justify-between items-start mb-2 sm:mb-4 gap-2">
                  {getStatusBadge(booking.status)}
                  {getStatusBadge(booking.paymentStatus)}
                  <span className="text-xs text-gray-500 block w-full sm:w-auto">
                    Booked: {formatDate(booking.createdAt)}
                  </span>
                </div>

                {/* Consultant Info */}
                <div className="mb-2 sm:mb-4">
                  <p className="text-xs sm:text-sm text-gray-400 mb-1 flex items-center">
                    <FontAwesomeIcon icon={faUserTie} className="mr-2 text-blue-400" />
                    Consultant:
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-white break-words">
                    {booking.consultantId?.firstName
                      ? `${booking.consultantId.firstName} ${booking.consultantId.lastName}`
                      : booking.consultantId?._id || booking.consultantId}
                  </p>
                </div>

                {/* Slot Details */}
                <div className="mb-2 sm:mb-4 space-y-1 sm:space-y-2">
                  <p className="flex items-center text-sm sm:text-md font-medium text-gray-300">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-yellow-400 w-4 h-4" />
                    Date: {formatDate(booking.slot.date)}
                  </p>
                  <p className="flex items-center text-sm sm:text-md font-medium text-gray-300">
                    <FontAwesomeIcon icon={faClock} className="mr-2 text-yellow-400 w-4 h-4" />
                    Time: {formatSlotForDisplay(booking.slot)}
                  </p>
                </div>

                {/* Description & Amount */}
                <div className="mb-2 sm:mb-4 border-t border-gray-700 pt-2 sm:pt-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-400 flex items-center mb-1">
                    <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
                    Description:
                  </p>
                  <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 italic mb-2 sm:mb-3 break-words">
                    {booking.description}
                  </p>

                  <p className="text-lg sm:text-xl font-bold text-green-400 flex items-center gap-0">
                    <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-2" />
                    {booking.slot.bookingAmount.toFixed(2)}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-auto space-y-2">
                  {/* CHAT Button */}
                  {
                    booking.status === "confirmed" ? (
                      <button
                        disabled={!isChatActive(booking.slot)}
                        onClick={() => handleChat(booking._id, booking.slot)}
                        className={`
                          text-center font-semibold 
                          rounded-xl py-2 
                          backdrop-blur-md 
                          border
                          shadow-md  
                          transition-all duration-300
                          w-full cursor-pointer ${
                          !isChatActive(booking.slot)
                            ? "bg-gray-600/10 cursor-not-allowed border-gray-500/20 shadow-gray-500/20 text-gray-300 hover:bg-gray-500/20 hover:shadow-gray-500/30"
                            : "bg-green-600/10 border-green-500/20 shadow-green-500/20 hover:bg-green-700/20 text-green-500 hover:shadow-green-500/30"
                        }`}
                      >
                        <FontAwesomeIcon icon={faComments} className="mr-2" />
                        {!isChatActive(booking.slot) ? "Chat (Locked)" : "Join Chat"}
                      </button>
                    ):(
                      booking.status === "cancelled" ? (
                        <p 
                        className="text-center text-red-500 font-semibold 
                            rounded-xl py-2 
                            backdrop-blur-md bg-red-500/10 
                            border border-red-500/40 
                            shadow-md shadow-red-500/20 
                            transition-all duration-300
                            hover:shadow-red-500/30 hover:bg-red-500/20"
                        >
                          <FontAwesomeIcon icon={faTimesCircle} className="mr-2"/>
                          Request Cancelled
                        </p>

                      ):(
                        booking.status === "completed" ? (
                          <p className="text-center text-green-500 font-semibold 
                            rounded-xl py-2
                            backdrop-blur-md bg-green-500/10 
                            border border-green-400/40 
                            shadow-md shadow-green-400/20
                            transition-all duration-300
                            hover:shadow-green-500/30 hover:bg-green-500/20">
                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2"/>
                            Completed
                          </p>
                        ):(
                        <p className="text-center text-yellow-500 font-semibold 
                              rounded-xl py-2
                              backdrop-blur-md bg-yellow-500/10 
                              border border-yellow-400/40 
                              shadow-md shadow-yellow-400/20
                            transition-all duration-300
                            hover:shadow-yellow-500/30 hover:bg-yellow-500/20">
                            <FontAwesomeIcon icon={faHourglass} className="mr-2"/>
                            Request Not Accepted Yet
                          </p>
                        )
                      )
                    )
                  }

                  {/* PAY Button */}
                  {(booking.paymentStatus === "unpaid" && booking.status === "completed") && (
                    <button
                      onClick={() => handlePay(booking._id)}
                      className="
                          w-full rounded-lg
                          text-center text-blue-50 font-semibold 
                          py-2 
                          backdrop-blur-md bg-blue-300/40 
                          border border-blue-200/40 
                          shadow-md shadow-blue-500/50 
                          transition-all duration-300
                          hover:shadow-blue-400/60 hover:bg-blue-500/50"
                    >
                      <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-2" /> Pay Now
                    </button>
                  )}

                  {/* REVIEW Button */}
                  {booking.status === "completed" && !booking.reviewStatus && (
                    <button
                      onClick={() => handleReview(booking._id)}
                      className="
                          w-full rounded-lg
                          text-center text-yellow-100 font-semibold 
                          py-2 
                          backdrop-blur-md bg-yellow-400/40 
                          border border-yellow-200/40 
                          shadow-md shadow-yellow-500/20 
                          transition-all duration-300
                          hover:shadow-yellow-600/30 hover:bg-yellow-500/50"
                    >
                      <FontAwesomeIcon icon={faStar} className="mr-2" /> Leave a Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
