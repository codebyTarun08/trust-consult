import { apiConnector } from "@/utils/apiConnector";
import toast from "react-hot-toast";
import { USER_ENDPOINTS } from '@/utils/api'
import { setLoading, setToken} from "@/app/redux/slices/authSlice";
import { setUser} from "@/app/redux/slices/profileSlice";

const {OTP, SIGNUP, LOGIN, UPDATEPROFILE, UPDATEPROFILEDATA ,CHANGEPASSWORD} = USER_ENDPOINTS;

export function sendOtp(email,router) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true))
        try {
            const response = await apiConnector(
                "POST",
                OTP,
                { email },
                {
                    "content-type": "application/json"
                }
            )
            if (!response?.data?.success) {
                throw new Error(response.data.message)
            }
            toast.success("OTP sent successfully");
            router.replace("/auth/verify-email")
        } catch (error) {
            console.log("OTP API ERROR---->", error);
            toast.error("OTP sending failed")
        } finally {
            dispatch(setLoading(false))
            toast.dismiss(toastId)
        }
    }
}

export function signupUser(signupData, router) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true))
        try {
            const response = await apiConnector(
                "POST",
                SIGNUP,
                signupData,
                {
                    "content-type": "application/json"
                }
            )
            if (!response?.data?.success) {
                throw new Error(response.data.message)
            }
            toast.success("User Signup Successfully");
            //console.log("USER DATA---> ", response)
            router.push('/auth/login')
        } catch (error) {
            console.log("SIGNUP API ERROR---->", error);
            toast.error("Signup Failed, Please try again");
            router.push("/auth/signup")
        } finally {
            dispatch(setLoading(false))
            toast.dismiss(toastId)
        }
    }

}

export function loginUser(formData,router) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        //console.log(formData)
        dispatch(setLoading(true))
        try {
            const response = await apiConnector(
                "POST",
                LOGIN,
                formData,
                {
                    "content-type": "application/json"
                }
            )
            if (!response?.data?.success) {
                throw new Error(response.data.message)
            }
            dispatch(setToken(response?.data?.token))
            dispatch(setUser(response?.data?.user))
            toast.success("User Login Successfully");
            //console.log("USER DATA---> ", response.data.user)
            router.push('/dashboard/profile')
        } catch (error) {
            console.log("Login API ERROR---->", error);
            toast.error("Login Failed , Please try again")
        } finally {
            dispatch(setLoading(false))
            toast.dismiss(toastId)
        }
    }
}

export function updateProfilePicture(data){
    return async(dispatch)=>{
        const toastId=toast.loading("Loading..");
        try {
            const response = await apiConnector(
                "POST",
                UPDATEPROFILE,
                data,
                {
                    "content-type": "multipart/form-data"
                }
            );
            if(!response?.data?.success){
                throw new Error(response.data.message)
            }
            toast.success("Profile Picture Updated Successfully")
        } catch (error) {
            console.error(error);
            toast.error("Profile Not Updated")
        }finally{
            toast.dismiss(toastId)
        }
    }
}

export function updateProfileData(data){
    return async(dispatch)=>{
        const toastId=toast.loading("Loading...");
        try {
            const response = await apiConnector(
                "PUT",
                UPDATEPROFILEDATA,
                data,
                {
                    'content-type': 'application/json'
                }
            )
            if(!response?.data?.success){
                throw new Error(response.data.message)
            }
            toast.success("Profile Updated Successfully")
            return response;
        } catch (error) {
            console.error(error.message);
        }finally{
            toast.dismiss(toastId)
        }
    }
}
export function changePassword(data){
    return async(dispatch)=>{
        const toastId=toast.loading("Loading...");
        //console.log(data);
        try {
            const response = await apiConnector(
                "POST",
                CHANGEPASSWORD,
                data,
                {
                    'content-type': 'application/json'
                }
            )
            toast.success("Password Changed Successfully")
            return response;
        } catch (error) {
            toast.error("Password not updated",error.message)
            console.error(error.message);
        }finally{
            toast.dismiss(toastId)
        }
    }
}