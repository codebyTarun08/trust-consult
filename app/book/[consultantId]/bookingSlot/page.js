"use client"

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getConsultantData } from "@/services/clientService";
import { apiConnector } from "@/utils/apiConnector";
import toast from "react-hot-toast";
import Rating from "react-rating"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faSpinner, faCheckCircle, faTimesCircle,faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { FaStar } from "react-icons/fa";
import Image from "next/image";
// --- Utility Functions ---

const DEFAULT_IMAGE = "https://via.placeholder.com/150/007bff/ffffff?text=C"; 

// Converts 24-hour integer to 12-hour string (e.g., 9 -> "9:00 AM", 14 -> "2:00 PM")
const formatHour = (hour) => {
    const h = hour % 12 || 12;
    const ampm = hour < 12 || hour === 24 ? 'AM' : 'PM';
    return `${h}:00 ${ampm}`;
};

// Converts the slot object {startHour, endHour} into a display string
const formatSlotForDisplay = (slotObject) => {
    if (!slotObject || slotObject.startHour === undefined || slotObject.endHour === undefined) return "Invalid Slot";
    const start = formatHour(slotObject.startHour);
    const end = formatHour(slotObject.endHour);
    return `${start} - ${end}`;
}

// Helper function to format the date for display
const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  } catch {
    return iso;
  }
};

// Helper to format booking date for previous bookings list
const formatBookingDate = (iso) => {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return 'Invalid Date';
    }
};

// Helper to get a simple status badge for previous bookings
const getStatusBadge = (status) => {
    switch (status) {
        case 'completed':
            return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Completed</span>;
        case 'cancelled': // Note: Used 'cancelled' to match the enum in the schema
            return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">Canceled</span>;
        case 'pending':
        case 'scheduled':
            return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">Scheduled</span>;
        default:
            return <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium">Archived</span>;
    }
}


// --- Main Component ---

const Page = () => {
  const { consultantId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const user = typeof window !== 'undefined' ? localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null : null;
  // Booking State
  const [selectedDate, setSelectedDate] = useState(''); // Stores ISO date string for API
  // selectedSlotObject stores the full slot object, e.g., { startHour: 9, endHour: 10, rate: 400, ... }
  const [selectedSlotObject, setSelectedSlotObject] = useState(null); 
  const [previousBookingConsultantId,setPreviousBookingConsultantId] = useState('');
  const [description, setDescription] = useState(''); // New state for description
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!consultantId) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const result = await dispatch(getConsultantData(consultantId));
        setData(result);
        setPreviousBookingConsultantId(result.consultantId._id);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load consultant data");
      } finally {
        setLoading(false);
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultantId]);


  // 1. Normalize Consultant Data
  const consultant = useMemo(() => {
    return data?.consultantId ?? data?.consultant ?? data ?? {};
  }, [data]);

  const ratingCount = useMemo(()=>{
    return data?.rating ?? {};
  },[data]);

  // 2. Process Time Slots for Display
  const slotsForDisplay = useMemo(() => {
    const rawTimeSlots = data?.availability?.timeSlots ?? data?.timeSlots ?? [];
    
    return rawTimeSlots.map(slotObj => ({
        ...slotObj,
        // Add the formatted time string and slot value
        displayTime: formatSlotForDisplay(slotObj),
        // Use the full object as the item's data payload for easier state management
    }));
  }, [data]);

  const bookingAmount = useMemo(() => {
    return selectedSlotObject?.rate ?? 0;
  }, [selectedSlotObject]);


  const [previousBookings, setPreviousBookings] = useState([]);

  useEffect(() => {
    if (!previousBookingConsultantId) return;

    const fetchPreviousBookings = async () => {
      try {
        const res = await fetch(`/api/client/getPreviousBookings?consultantId=${previousBookingConsultantId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const response = await res.json();
        console.log("Previous Bookings Data:", response);

        if (response.success) {
          setPreviousBookings(response.bookings);
        }
      } catch (err) {
        console.error("Error fetching previous bookings:", err);
      }
    };

    fetchPreviousBookings();
  }, [previousBookingConsultantId]);




  if (!mounted) return null;

  if (loading) {
    return (
      <div className="p-8 bg-gray-900 h-screen text-center text-xl text-blue-200 flex items-center justify-center space-x-2">
        <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5"/>
        <span>Loading consultant data...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-center text-lg text-neutral-500">No consultant found.</div>;
  }
  
  const consultantImage = consultant.image || DEFAULT_IMAGE;


  // Booking function: Updated to match the complex slot schema and include new fields
  const handleBook = async () => {
    if (!selectedDate || !selectedSlotObject || !description.trim()) {
      toast.error("Please select a date and time slot, and provide a description.");
      return;
    }
    if(!token){
      toast.error("You must be logged in to book a slot.");
      router.push("/auth/login");
      return;
    }
    if(user.role === "Admin"){
      toast.error("Admins are not allowed to book consultation slots.");
      return;
    }
    if(user.role === "Consultant"){
      toast.error("Consultants are not allowed to book consultation slots.");
      return;
    }
    setBooking(true);
    const toastId = toast.loading("Booking slot...");

    // Fetch client ID from local storage (or wherever you store it)
    const client = localStorage.getItem("user");
    const clientId = client ? JSON.parse(client)._id : null;

    if (!clientId) {
        toast.error("Client not logged in. Cannot proceed with booking.", { id: toastId });
        setBooking(false);
        return;
    }
    
    try {
      // Structure payload exactly matching the Mongoose schema
      const payload = {
        clientId: clientId,
        consultantId: consultant._id ?? consultantId,
        description: description.trim(),
        slot: {
            startHour: selectedSlotObject.startHour,
            endHour: selectedSlotObject.endHour,
            date: selectedDate, // ISO date string from date picker
            bookingAmount: bookingAmount,
        },
        // status and paymentStatus will default on the backend
      };
      console.log("Booking Payload:", payload);
      const res = await apiConnector("POST", "/api/client/createBooking", payload, { "content-type": "application/json" });
      if (!res?.data?.success) {
        throw new Error(res?.data?.message || "Booking failed");
      }
      toast.success("Booking confirmed! 🎉 Payment is pending.", { id: toastId });
      router.push("/bookings");
    } catch (err) {
      console.error("Booking error", err);
      toast.error(err?.message || "Booking failed", { id: toastId });
    } finally {
      setBooking(false);
      toast.dismiss(toastId);
    }
  };

  // Helper to ensure the date picker only allows future/today dates (and limited range)
  const today = new Date().toISOString().substring(0, 10);
  const maxDateLimit = new Date();
  maxDateLimit.setMonth(maxDateLimit.getMonth() + 3); // Allow booking 3 months out
  const maxDate = maxDateLimit.toISOString().substring(0, 10);
  
  return (
    <div className="bg-gray-900">
      <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 min-h-screen">
        
        {/* Consultant Header and Booking Section (Main 2-Column Layout) */}
        <div className="bg-slate-900 rounded-xl shadow-2xl overflow-hidden mb-8 border border-richblack-600">
          <div className="flex flex-col lg:flex-row ">
            
            {/* Left Column: Consultant Profile Summary */}
            <div className="lg:w-1/3 p-6 sm:p-8 bg-slate-800 border-b lg:border-r border-slate-700">
              <div className="flex flex-col items-center text-center">
                {/* <img
                  src={consultantImage}
                  alt={`${consultant.firstName} ${consultant.lastName}`}
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
                /> */}
                <div className="relative w-36 h-36">
                  <Image
                    src={consultantImage}
                    alt={`${consultant.firstName} ${consultant.lastName}`}
                    fill
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                    sizes="144px"
                    priority
                  />
                </div>
                <h2 className="mt-4 text-3xl font-extrabold text-white">
                  {consultant.firstName} {consultant.lastName}
                </h2>
                <p className="text-lg text-blue-400 font-medium">Consultant</p>
                <p className="text-sm text-neutral-400 mt-2 italic">{data.bio ?? consultant.bio}</p>
                
                {/* Categories/Specializations */}
                <Rating
                  className="mt-3"
                  initialRating={ratingCount || 0}
                  readonly={true}
                  emptySymbol={<FaStar className="text-gray-300 w-10 h-8"/>}
                  fullSymbol={<FaStar className="text-yellow-400 w-10 h-8"/>}
                  fractions={2}
                />
                <div className="mt-4 flex gap-2 flex-wrap justify-center">
                  {(data.categories ?? consultant.categories ?? []).map((c) => (
                    <span 
                      key={c._id ?? c.name} 
                      className="px-3 py-1 rounded-full bg-blue-900 text-blue-300 text-xs font-semibold"
                    >
                      {c.name ?? c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Date & Time Slot Selection */}
            <div className="lg:w-2/3 p-6 sm:p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">
                  Book a Consultation Slot
              </h3>

              {/* Step 1: Date Picker */}
              <div className="mb-6">
                <h4 className="flex items-center text-lg font-semibold mb-3 text-neutral-300">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-500 w-4 h-4" /> Step 1: Select Date
                </h4>
                <label htmlFor="booking-date" className="text-neutral-600 block text-sm font-medium mb-2">
                  Selected Date: <span className="font-bold text-blue-600">{selectedDate ? formatDate(selectedDate) : 'Not Selected'}</span>
                </label>
                <input
                  id="booking-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedSlotObject(null); // Reset slot selection
                  }}
                  min={today}
                  max={maxDate}
                  className="w-full cursor-pointer text-white sm:w-1/2 p-3 border border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-slate-800 transition-shadow shadow-sm"
                />
              </div>

              {/* Step 2: Time Slots Selector */}
              <div className="mb-6">
                <h4 className="flex items-center text-lg font-semibold mb-3 text-neutral-300">
                  <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-500 w-4 h-4" /> Step 2: Choose Time Slot
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {!selectedDate ? (
                    <p className="text-base text-neutral-500 py-2 col-span-full">
                      Please select a date to view available slots.
                    </p>
                  ) : (
                    slotsForDisplay.map((slotObj) => (
                      <button
                        key={slotObj._id}
                        onClick={() => setSelectedSlotObject(slotObj)} 
                        disabled={slotObj.isBooked} // Disable if booked
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-150 relative ${
                          slotObj.isBooked
                            ? "bg-slate-700 border-slate-600 text-neutral-500 cursor-not-allowed opacity-70" // Booked/Disabled style
                            : selectedSlotObject?._id === slotObj._id // Compare by object ID
                              ? "bg-blue-600 text-white border-blue-600 shadow-lg" // Selected style
                              : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700" // Available style
                        } flex flex-col items-start`}
                      >
                        <span className='font-semibold'>{slotObj.displayTime}</span>
                        <span className='text-xs font-normal opacity-80 mt-1'><FontAwesomeIcon icon={faIndianRupeeSign} /> {slotObj.rate}</span>
                        
                        {/* Availability Badge */}
                        <span className={`absolute top-0 right-0 mt-[-5px] mr-[-5px] px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${
                              slotObj.isBooked 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-green-500 text-white'
                          }`}>
                          <FontAwesomeIcon icon={slotObj.isBooked ? faTimesCircle : faCheckCircle} className="mr-1 w-3 h-3"/>
                          {slotObj.isBooked ? 'Booked' : 'Available'}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Step 3: Description Input */}
              <div className="mb-6">
                <h4 className="flex items-center text-lg font-semibold mb-3 text-neutral-300">
                  📝 Step 3: Describe Your Need
                </h4>
                <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what you'd like to discuss during the consultation (Required)"
                    className="w-full p-3 border border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-slate-800 text-white"
                />
              </div>

              {/* Step 4: Summary & Action Button */}
              <div className="mt-8 pt-4 border-t border-slate-700">
                <div className="flex justify-between items-center text-lg font-bold mb-4 text-white">
                    <span>Total Booking Amount:</span>
                    <span className="text-green-400"><FontAwesomeIcon icon={faIndianRupeeSign} />{bookingAmount}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBook}
                    disabled={!selectedSlotObject || booking || !selectedDate || !description.trim() || bookingAmount <= 0}
                    className={`cursor-pointer flex-grow px-6 py-3 rounded-lg text-white font-bold text-lg transition-colors ${
                      !selectedSlotObject || booking || !selectedDate || !description.trim() || bookingAmount <= 0
                        ? "bg-gray-600 cursor-not-allowed" 
                        : "hover:bg-blue-600 shadow-md shadow-blue-200/50"
                    }`}
                  >
                    {booking 
                      ? (<span className="flex items-center justify-center"><FontAwesomeIcon icon={faSpinner} spin className="mr-2 w-4 h-4" /> Confirming...</span>) 
                      : "Proceed to Book"}
                  </button>

                  <button
                    onClick={() => router.back()}
                    className="px-4 py-3 rounded-lg transition duration-300 border border-neutral-300 bg-red-500 text-sm text-white font-semibold hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section>
          {/* Section Header */}
          <h3 className="text-3xl font-extrabold mb-6 text-white tracking-tight border-b border-slate-700 pb-2">
            🗓️ Past Consultations
          </h3>

          {previousBookings?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previousBookings.map((booking) => (
                // Consultation Card
                <div
                  key={booking._id}
                  className="p-5 bg-slate-800 border border-slate-700 rounded-xl shadow-lg hover:shadow-xl hover:border-blue-500/50 transition duration-300 ease-in-out flex flex-col justify-between"
                >
                  {/* Date and Status Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-blue-400">
                      {formatBookingDate(booking?.slot?.date)}
                    </h4>
                    {/* Assuming getStatusBadge returns a colored pill/badge */}
                    {getStatusBadge(booking.status)} 
                  </div>

                  {/* Time and Duration */}
                  <p className="text-neutral-300 text-base mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-white">Time:</span> {booking.slot.startHour > 12 ? booking.slot.startHour - 12 + " PM" : booking.slot.startHour + " AM"} - {booking.slot.endHour > 12 ? booking.slot.endHour - 12 + " PM" : booking.slot.endHour + " AM"}
                  </p>

                  {/* Review Section */}
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    {booking.reviewStatus ? (
                      <>
                        {/* Rating component using FaStar icons */}
                        <div className="flex items-center mb-2">
                            <Rating
                                initialRating={booking.review.rating}
                                readonly={true}
                                emptySymbol={<FaStar className="text-gray-600"/>}
                                fullSymbol={<FaStar className="text-yellow-500"/>}
                                fractions={2}
                                className="mr-3"
                            />
                            <span className="text-sm font-semibold text-white">({booking.review.rating} / 5)</span>
                        </div>
                        
                        {/* Review Text */}
                        <p className="text-sm italic text-neutral-400 line-clamp-3">
                          "{booking.review.review}"
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-neutral-500 italic text-center py-2">
                        No review provided yet.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No Bookings Found State
            <div className="p-10 text-center border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-neutral-400 text-lg font-medium">
                No previous consultations found.
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                Your booking history will appear here.
              </p>
            </div>
          )}
        </section>
        
      </div>
    </div>
  );
}

export default Page;