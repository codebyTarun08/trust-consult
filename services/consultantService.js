import { setConsultant,setLoading } from "@/app/redux/slices/profileSlice";
import { CONSULTANT_ENDPOINTS } from "@/utils/api";
import { apiConnector } from "@/utils/apiConnector";
import toast from "react-hot-toast";
const { CREATEPROFILE , GETCONSULTANT } = CONSULTANT_ENDPOINTS;

export function createProfile(data){
    return async(dispatch)=>{
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector(
                    "PUT",
                    CREATEPROFILE,
                    data,
                    {
                    "content-type": "application/json"
                    }
            )
            if(!response?.data?.success){
                throw new Error(response.data.message)
            }
        //console.log(response.data.consultant)
        dispatch(setConsultant(response?.data?.consultant));
        toast.success("Consultant Profile Updated Successfully")
        } catch (error) {
            toast.error("ERROR IN CONSULTANT PROFILE UPDATE")
        }finally{
            dispatch(setLoading(false))
            toast.dismiss(toastId);
        }
    }
}

export function getConsultant(){
    return async(dispatch)=>{
        try {
            const response = await apiConnector(
                "GET",
                GETCONSULTANT,
            )
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            dispatch(setConsultant(response?.data?.consultant)); 
            //console.log(response.data.consultant)
        } catch (error) {
            console.log("Error in fetching data");
        }
    }
}