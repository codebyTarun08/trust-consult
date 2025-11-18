"use client"
import HighLightText from '@/components/HighLightText'
import React,{useState,useEffect} from 'react'
import { getAllConsultants } from '@/services/clientService'; // Your service to fetch all users
import { useDispatch , useSelector } from 'react-redux';
import { apiConnector } from "@/utils/apiConnector";
import { CONSULTANT_ENDPOINTS } from "@/utils/api";
import toast from "react-hot-toast";
import { FiFilter, FiCalendar } from "react-icons/fi"; 
import { IoMdTime } from "react-icons/io";
import { getCategories } from '@/services/clientService';
import Link from 'next/link';
import Footer from '@/components/common/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';


const Page = () => { 
  const [loading, setLoading] = useState(false);
  const {allConsultant} = useSelector((state)=>state.consultant)
  const {category} = useSelector((state)=>state.category);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        await dispatch(getAllConsultants()); 
        await dispatch(getCategories());
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load consultants.");
      } finally {
        setLoading(false);
      }
    };

    if (allConsultant.length === 0) {
      fetchUsers();
    }
  }, [dispatch,allConsultant.length]);

  const activeCategory = category.filter((cat)=>(cat.isActive===true));
  const filteredConsultants =
    selectedCategory === "all"
      ? allConsultant
      : allConsultant.filter((c) =>
          c.categories?.some((cat) => cat._id === selectedCategory) 
        );
  return (
    <>
    <div className="min-h-screen bg-gray-900 text-white font-inter">
      {/* HEADER SECTION (Preserved) */}
      <div className='flex flex-col justify-center items-center bg-black h-[300px] gap-y-4 md:gap-y-5 px-4'>
        <h3 className='flex flex-col md:flex-row gap-x-2 justify-center items-center text-center'>
          <span className='text-3xl md:text-4xl text-richblack-300 font-bold'>Book Your Expert </span>
          <HighLightText text="Consultant"/>
        </h3>
        <p className='text-richblack-300 w-full md:w-2/4 text-center text-base md:text-lg'>
          <span className='text-blue-200 text-lg md:text-xl mr-2 font-semibold'>
            Ready to take the next step?
          </span>
          Connect with our network of experienced consultants who are here to guide you. Whether you&apos;re seeking advice on career growth, technical challenges, or business strategy, you&apos;ll find an expert to match your needs.
        </p>
      </div>

      <div className='h-8 md:h-16 bg-black opacity-10 blur-3xl'></div>

      <div className='max-w-7xl mx-auto p-4 md:p-10'>
        {/* CATEGORY FILTER SECTION */}
        <div className="mb-8 md:mb-10 p-3 md:p-4 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
            <h3 className='text-xl md:text-2xl font-semibold flex items-center text-indigo-400'>
                <FiFilter className="mr-2 md:mr-3" /> Filter Consultants
            </h3>
            {
              activeCategory?.length > 0 ? (
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-grow max-w-xs p-2 md:p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-white cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {activeCategory.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat?.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-red-400">No categories available.</p>
              )
           }
          </div>
        </div>

        {/* CONSULTANT LISTING */}
        <h3 className='text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-richblack-100 text-center md:text-left'>Available Experts ({filteredConsultants.length})</h3>

        {loading ? (
          <div className="p-6 md:p-8 bg-gray-900 h-8 text-center text-lg md:text-xl text-blue-200 flex items-center justify-center space-x-2">
            <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5"/>
            <span>Loading Consultants...</span>
          </div>
        ) : filteredConsultants.length === 0 ? (
          <p className="text-center text-xl md:text-2xl text-red-400 p-6 md:p-10 bg-gray-800 rounded-lg">
            No consultants found matching the selected category.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {filteredConsultants.map((consultant) => (
              <Link key={consultant._id} href={`book/${consultant._id}/bookingSlot`}>
                <div
                  key={consultant._id}
                  className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 flex flex-col transform hover:-translate-y-1"
                >
                  <div className="flex items-center mb-3 md:mb-4">
                    <Image
                      unoptimized
                      width={100}
                      height={100}
                      src={consultant?.consultantId?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${consultant.firstName} ${consultant.lastName}`}
                      alt={`${consultant.firstName} Profile`}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover mr-3 md:mr-4 border-2 border-indigo-500"
                    />
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-indigo-400">
                        {consultant.consultantId.firstName} {consultant.consultantId.lastName}
                      </h2>
                      <p className="text-xs text-gray-400">
                        Joined: {new Date(consultant.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4 flex-grow line-clamp-3">
                      A seasoned professional with expertise in {consultant.categories[0].name} and {consultant.expertise?.[0] || 'Leadership'}. Ready to help you achieve your goals.
                  </p>

                  <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-3">
                      {consultant.categories?.slice(0, 3).map((cat) => (
                        <span
                          key={cat._id}
                          className="bg-indigo-900 text-indigo-300 text-[10px] md:text-xs font-medium px-2 md:px-3 py-1 rounded-full"
                        >
                          {cat.name}
                        </span>
                      ))}
                      <span className="bg-green-900 text-green-300 text-[10px] md:text-xs font-medium px-2 md:px-3 py-1 rounded-full">
                        {consultant.expertise?.[0] || 'Expert'}
                      </span>
                  </div>

                  <div className="mt-auto pt-3 md:pt-4 border-t border-gray-700">
                    <p className="font-semibold text-xs md:text-sm mb-1 md:mb-2 flex items-center text-gray-300">
                      <IoMdTime className="mr-1 md:mr-2 text-lg text-yellow-400" /> Bookable Slots:
                    </p>
                    <div className="flex flex-wrap gap-1 md:gap-2 max-h-16 md:max-h-24 overflow-y-auto pr-1">
                      {consultant.availability?.timeSlots?.length > 0 ? (
                        consultant.availability.timeSlots.slice(0,2).map((slot, idx) => (
                          <button
                            key={idx}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-medium transition-colors duration-200 shadow-md active:scale-95"
                            title={`Book slot on ${new Date(slot.date).toLocaleDateString()}`}
                          >
                            {`${slot.startHour===12 ? 12 : slot.startHour % 12} ${slot.startHour >= 12 ? "PM": "AM"} - ${slot.endHour===12 ? 12 : slot.endHour % 12} ${slot.endHour >= 12 ? "PM": "AM"}`}
                          </button>
                        ))
                      ) : (
                        <p className="text-[10px] md:text-xs text-red-400">No slots available.</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default Page