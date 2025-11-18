const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL

export const USER_ENDPOINTS={
    OTP : `${BASE_URL}/api/users/sendOtp`,
    SIGNUP: `${BASE_URL}/api/users/signup`,
    LOGIN: `${BASE_URL}/api/users/login`,
    UPDATEPROFILE: `${BASE_URL}/api/users/uploadProfile`,
    UPDATEPROFILEDATA: `${BASE_URL}/api/users/updateProfile`,
    CHANGEPASSWORD: `${BASE_URL}/api/users/changePassword`,
}

export const ADMIN_ENDPOINTS={
    GETALLUSERS:`${BASE_URL}/api/admin/getAllUsers`,
    GETALLCONSULTANTS:`${BASE_URL}/api/admin/getAllConsultants`,
    GETCATEGORY:`${BASE_URL}/api/admin/getAllCategories`,
    CREATECATEGORY:`${BASE_URL}/api/admin/createCategory`,
    DEACTIVATECATEGORY:`${BASE_URL}/api/admin/deactivateCategory`,
    UPDATECATEGORY:`${BASE_URL}/api/admin/updateCategory`,
    BLOCKUSER:`${BASE_URL}/api/admin/blockUser`,
    UNBLOCKUSER:`${BASE_URL}/api/admin/unblockUser`,
}

export const CONSULTANT_ENDPOINTS={
    CREATEPROFILE:`${BASE_URL}/api/consultant/createProfile`,
    GETCONSULTANT:`${BASE_URL}/api/consultant/getConsultant`
}

export const CLIENT_ENDPOINTS={
    GETALLCONSULTANTS:`${BASE_URL}/api/client/getAllConsultants`,
    GETCATEGORY: `${BASE_URL}/api/client/getCategories`,
    GETCONSULTANTDATA: `${BASE_URL}/api/client/getConsultantData`,
    CREATEBOOKING:`${BASE_URL}/api/client/createBooking`,
    GETBOOKINGS:`${BASE_URL}/api/client/getBookings`
}