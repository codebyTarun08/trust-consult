"use client";

import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faUser,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const ConsultantBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/consultant/getBookings", {
        method: "GET",
        headers: {
          "x-user-id": localStorage.getItem("consultantId"),
        },
      });

      const data = await res.json();
      if (res.ok) setBookings(data.data);
      else toast.error(data.error || "Failed to fetch bookings");
    } catch (error) {
      toast.error("Error fetching bookings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleBookingAction = async (bookingId, action) => {
    const endpoint =
      action === "accept" ? "/api/booking/accept" : "/api/booking/cancel";
    const body =
      action === "accept"
        ? { bookingId }
        : { bookingId, reason: "Consultant declined the booking" };

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchBookings(); // refresh bookings
      } else {
        toast.error(data.error || "Action failed");
      }
    } catch (err) {
      toast.error("Server error");
      console.error(err);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => b.status === activeTab);
  }, [bookings, activeTab]);

  const formatDate = (iso) => new Date(iso).toLocaleDateString();
  const formatTime = (hour) => {
    const h = hour % 12 || 12;
    const ampm = hour < 12 || hour === 24 ? "AM" : "PM";
    return `${h}:00 ${ampm}`;
  };

  if (loading)
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-900 text-white">
        <FontAwesomeIcon icon={faSpinner} spin className="text-blue-400 w-8 h-8" />
        <p className="ml-3 text-lg">Loading your bookings...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">📅 Consultant Bookings</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-700 mb-6">
        {["pending", "confirmed", "cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer pb-2 text-lg font-semibold ${
              activeTab === tab
                ? "text-blue-400 border-b-4 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-10 text-center border border-gray-700">
          <p className="text-gray-400">
            No {activeTab} bookings found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
            >
              {/* Client Info */}
              <div className="mb-3">
                <p className="text-gray-400 text-sm mb-1 flex items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-400" />
                  Client:
                </p>
                <p className="text-lg font-semibold">
                  {b.clientId?.firstName} {b.clientId?.lastName}
                </p>
              </div>

              {/* Date and Time */}
              <div className="text-gray-300 mb-3">
                <p className="flex items-center mb-1">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-yellow-400" />
                  Date: {formatDate(b.slot.date)}
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-2 text-yellow-400" />
                  Time: {formatTime(b.slot.startHour)} - {formatTime(b.slot.endHour)}
                </p>
              </div>

              {/* Status */}
              <p className="text-sm text-gray-400 mb-4">
                Status:{" "}
                <span
                  className={`font-bold ${
                    b.status === "pending"
                      ? "text-yellow-400"
                      : b.status === "confirmed"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {b.status.toUpperCase()}
                </span>
              </p>

              {/* Action Buttons */}
              {b.status === "pending" && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleBookingAction(b._id, "accept")}
                   // className="cursor-pointer flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold"
                      className="cursor-pointer text-center text-green-500 font-semibold 
                            rounded-xl py-2 flex-1
                            backdrop-blur-md bg-green-500/10 
                            border border-green-400/40 
                            shadow-md shadow-green-400/20
                            transition-all duration-300
                            hover:shadow-green-500/30 hover:bg-green-500/20"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleBookingAction(b._id, "cancel")}
                    //className="cursor-pointer flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold"
                    className="cursor-pointer text-center text-red-500 font-semibold 
                            rounded-xl py-2  flex-1
                            backdrop-blur-md bg-red-500/10 
                            border border-red-500/40 
                            shadow-md shadow-red-500/20 
                            transition-all duration-300
                            hover:shadow-red-500/30 hover:bg-red-500/20"
                  >
                    <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                    Reject
                  </button>
                </div>
              )}

              {b.status !== "pending" && (
                <div className="text-sm text-gray-500 italic">
                  {b.status === "cancelled"
                    ? b.cancelReason || "Cancelled"
                    : "Accepted and awaiting session"}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultantBookingsPage;
