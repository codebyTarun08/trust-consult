import { apiConnector } from "@/utils/apiConnector";
import toast from "react-hot-toast";
import { CLIENT_ENDPOINTS } from '@/utils/api'
import { setLoading,setCategory } from "@/app/redux/slices/categorySlice";
import { setConsultant } from "@/app/redux/slices/consultantSlice";

const { GETALLCONSULTANTS, GETCATEGORY,GETCONSULTANTDATA,GETBOOKINGS } = CLIENT_ENDPOINTS;

export function getAllConsultants() {
    return async (dispatch) => {
        //const toastId = toast.loading("Loading...");
        try{
            const response = await apiConnector(
                "GET",
                GETALLCONSULTANTS,
                null,
                {
                    "content-type": "application/json"
                }
            )
            if(!response?.data?.success){
                throw new Error(response.data.message)
            }   
            dispatch(setConsultant(response.data.consultants));
            //console.log(response.data.consultants)
            //toast.success("Consultant fetched Successfully")
        } catch (error) {
            console.error("Error fetching all Users:", error);
            toast.error("Error in getting Users");
        } finally {
            //toast.dismiss(toastId);
        }
    }
}

export function getCategories() {
    return async (dispatch) => {
       // const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector(
                "GET",
                GETCATEGORY,
                null,
                {
                    "content-type": "application/json"
                }
            )
            if(!response?.data?.message){
                throw new Error(response.data.message)
            }
            dispatch(setCategory(response?.data?.categories));
            //console.log("All Categories: ", response.data.categories);
            return response?.data?.categories;
        } catch (error) {
            console.error("Error fetching all categories:", error);
            toast.error("Category Not Found")
        } finally {
          //  toast.dismiss(toastId);
            dispatch(setLoading(false))
        }
    }
}
export function getConsultantData(consultantId) {
    return async (dispatch) => {
        //const toastId = toast.loading("Loading...");
        //console.log(consultantId);
        try{
            const response = await apiConnector(
                "GET",
                `${GETCONSULTANTDATA}?id=${consultantId}`,
                null,
                {
                    "content-type": "application/json"
                }
            )
            if(!response?.data?.message){
                throw new Error(response.data.message)
            }
            //toast.success("Consultant Fetched Successfully");
            //console.log(response.data.consultantData)
            return response.data.consultantData;
        } catch (error) {
            console.error("Error fetching the data of consultant:", error);
            toast.error("Consultant not found")
        } finally {
            //toast.dismiss(toastId);
        }
    }
}

export function getBookings(payload){
    return async (dispatch) => {
        //const toastId = toast.loading("Loading...");
        try {
            const response = await apiConnector(
                "GET",
                GETBOOKINGS,
                null,
                {
                    "x-user-id": payload.userId,
                    "x-user-role": payload.role,
                    "content-type": "application/json"
                }
            )
            if(!response?.data?.success){
                throw new Error(response.data.message)
            }
            // dispatch(setBookings(response.data.bookings));
            //console.log(response.data.bookings)
            toast.success("Bookings fetched Successfully")
            /*
                toast.success("Bookings fetched Successfully", {
                style: {
                    background: "#001F3F",   // dark blue/black theme
                    color: "#00E6E6",        // cyan text
                    border: "1px solid #00E6E6",
                },
                iconTheme: {
                    primary: "#00E6E6",      // cyan icon
                    secondary: "#001F3F",
                },
                });
            */
            return response.data.bookings;
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Error fetching bookings");
        } finally {
          //  toast.dismiss(toastId);
        }
    }
}