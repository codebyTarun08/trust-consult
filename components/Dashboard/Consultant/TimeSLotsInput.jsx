// "use client";
// import React, { useState, useEffect } from "react";
// import { MdClose } from "react-icons/md";

// // Utility to format 24h -> 12h with AM/PM
// const formatTime = (hour) => {
//   let suffix = hour >= 12 ? "PM" : "AM";
//   let formattedHour = hour % 12 || 12;
//   return `${formattedHour}:00 ${suffix}`;
// };

// const TimeSlotsInput = ({ slots = [], setSlots,setValue,name }) => {
//   const [timeSlots, setTimeSlotsState] = useState(slots);

//   const [startHour, setStartHour] = useState("");
//   const [endHour, setEndHour] = useState("");
//   const [rate, setRate] = useState("");

//   useEffect(()=>{
//     setValue(name,timeSlots)
//   },[timeSlots,name,setValue])
//   useEffect(() => {
//     setTimeSlotsState(slots);
//   }, [slots]);

//   const handleAddSlot = () => {
//     if (!startHour || !endHour || !rate) return;

//     const newSlot = {
//       startHour: parseInt(startHour),
//       endHour: parseInt(endHour),
//       rate: parseFloat(rate),
//     };

//     const updated = [...timeSlots, newSlot];
//     setTimeSlotsState(updated);
//     setSlots(updated);

//     // Reset fields
//     setStartHour("");
//     setEndHour("");
//     setRate("");
//   };

//   const handleDelete = (index) => {
//     const updated = timeSlots.filter((_, i) => i !== index);
//     setTimeSlotsState(updated);
//     setSlots(updated);
//   };

//   return (
//     <div className="my-4">
//       <label className="block text-sm font-semibold mb-2 text-cyan-900">Availability Slots</label>

//       {/* Chips */}
//       <div className="flex flex-wrap gap-2 mb-4 transition-all duration-200">
//         {timeSlots.map((slot, index) => (
//           <div
//             key={index}
//             className="flex items-center gap-2 bg-yellow-400 text-richblack-900 px-3 py-1 rounded-full text-sm"
//           >
//             {`${formatTime(slot.startHour)} - ${formatTime(slot.endHour)}  (₹${slot.rate})`}
//             <button
//               type="button"
//               onClick={() => handleDelete(index)}
//               className="focus:outline-none"
//             >
//               <MdClose className="text-sm text-red-500 cursor-pointer" />
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Input fields */}
//       <div className="flex gap-2 items-center justify-around">
//         <select
//           name="startHour"
//           value={startHour}
//           onChange={(e) => setStartHour(e.target.value)}
//           className="border border-richblack-400 p-4 rounded-lg bg-gray-800 text-white"
//         >
//           <option value="">Start Hour</option>
//           {Array.from({ length: 24 }, (_, i) => (
//             <option key={i} value={i}>
//               {formatTime(i)}
//             </option>
//           ))}
//         </select>

//         <select
//           name="endHour"
//           value={endHour}
//           onChange={(e) => setEndHour(e.target.value)}
//           className="border border-richblack-400 p-4 rounded-lg bg-gray-800 text-white transition-all duration-200"
//         >
//           <option value="">End Hour</option>
//           {Array.from({ length: 24 }, (_, i) => (
//             <option key={i} value={i}>
//               {formatTime(i)}
//             </option>
//           ))}
//         </select>

//         <input
//           name="rate"
//           type="number"
//           value={rate}
//           onChange={(e) => setRate(e.target.value)}
//           placeholder="Rate"
//           className="border border-richblack-400 p-4 rounded-lg bg-gray-800 text-white w-26 h-14"
//         />

//         <button
//           type="button"
//           onClick={handleAddSlot}
//           className="bg-caribbeangreen-200 text-richblack-900 px-4 py-2 rounded-lg font-semibold w-32 h-14 cursor-pointer hover:bg-caribbeangreen-100 transition-all duration-200"
//         >
//           Add
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TimeSlotsInput;
"use client";

import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";

// Utility to format 24h -> 12h
const formatTime = (hour) => {
  let suffix = hour >= 12 ? "PM" : "AM";
  let formattedHour = hour % 12 || 12;
  return `${formattedHour}:00 ${suffix}`;
};

const TimeSlotsInput = ({ slots = [], setSlots, setValue, name }) => {
  const [timeSlots, setTimeSlotsState] = useState(slots);
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [rate, setRate] = useState("");

  useEffect(() => {
    setValue(name, timeSlots);
  }, [timeSlots, name, setValue]);

  useEffect(() => {
    setTimeSlotsState(slots);
  }, [slots]);

  const handleAddSlot = () => {
    if (!startHour || !endHour || !rate) return;

    const newSlot = {
      startHour: parseInt(startHour),
      endHour: parseInt(endHour),
      rate: parseFloat(rate),
    };

    const updated = [...timeSlots, newSlot];
    setTimeSlotsState(updated);
    setSlots(updated);

    setStartHour("");
    setEndHour("");
    setRate("");
  };

  const handleDelete = (index) => {
    const updated = timeSlots.filter((_, i) => i !== index);
    setTimeSlotsState(updated);
    setSlots(updated);
  };

  return (
    <div className="my-4">
      <label className="block text-sm font-semibold mb-2 text-cyan-900">
        Availability Slots
      </label>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {timeSlots.map((slot, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-yellow-400 text-richblack-900 px-3 py-1 rounded-full text-xs sm:text-sm"
          >
            {`${formatTime(slot.startHour)} - ${formatTime(slot.endHour)} (₹${slot.rate})`}
            <button type="button" onClick={() => handleDelete(index)}>
              <MdClose className="text-sm text-red-500 cursor-pointer" />
            </button>
          </div>
        ))}
      </div>

      {/* Input Fields */}
      <div className="
        flex flex-col sm:flex-row 
        gap-3 sm:gap-4 
        items-stretch sm:items-center 
        w-full
      ">
        
        {/* Start Hour */}
        <select
          name="startHour"
          value={startHour}
          onChange={(e) => setStartHour(e.target.value)}
          className="border border-richblack-400 p-3 rounded-lg bg-gray-800 text-white w-full"
        >
          <option value="">Start Hour</option>
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>{formatTime(i)}</option>
          ))}
        </select>

        {/* End Hour */}
        <select
          name="endHour"
          value={endHour}
          onChange={(e) => setEndHour(e.target.value)}
          className="border border-richblack-400 p-3 rounded-lg bg-gray-800 text-white w-full"
        >
          <option value="">End Hour</option>
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>{formatTime(i)}</option>
          ))}
        </select>

        {/* Rate */}
        <input
          name="rate"
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          placeholder="Rate"
          className="border border-richblack-400 p-3 rounded-lg bg-gray-800 text-white w-full sm:w-28"
        />

        {/* Add Button */}
        <button
          type="button"
          onClick={handleAddSlot}
          className="
            bg-caribbeangreen-200 text-richblack-900 
            px-4 py-3 rounded-lg font-semibold 
            w-full sm:w-28 
            cursor-pointer hover:bg-caribbeangreen-100 
            transition-all duration-200
          "
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default TimeSlotsInput;
