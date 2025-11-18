import { apiConnector } from "@/utils/apiConnector";
import toast from "react-hot-toast";
import { ADMIN_ENDPOINTS } from '@/utils/api'
import { setCategory,setLoading } from "@/app/redux/slices/categorySlice";
const {GETALLUSERS, GETALLCONSULTANTS, GETCATEGORY, CREATECATEGORY, DEACTIVATECATEGORY, UPDATECATEGORY, BLOCKUSER, UNBLOCKUSER} = ADMIN_ENDPOINTS;

export function getAllUsers() {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        try{
            const response = await apiConnector(
                "GET",
                GETALLUSERS,
                null,
                {
                    "content-type": "application/json"
                }
            )
            if(!response?.data?.success){
                throw new Error(response.data.message)
            }   
            //console.log("All Users: ", response.data.users);
            return response?.data?.users;
        } catch (error) {
            console.error("Error fetching all Users:", error);
            toast.error("Error in getting Users");
        } finally {
            toast.dismiss(toastId);
        }
    }
}
export function getAllConsultants() {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
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
            //console.log("All Consultants: ", response.data.consultants);
        } catch (error) {
            console.error("Error fetching all consultants:", error);
            toast.error("Error in getting Consultants");
        } finally {
            toast.dismiss(toastId);
        }
    }
}
export function getCategories() {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
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
            toast.dismiss(toastId);
            dispatch(setLoading(false))
        }
    }
}

export function createCategory(data){
    return async(dispatch)=>{
        const toastId=toast.loading("Loading...");
        try {
            //console.log(data)
            const response = await apiConnector(
                "POST",
                CREATECATEGORY,
                data,
                {
                    "content-type":"application/json"
                }
            )
            if(!response?.data?.message){
                throw new Error(response.data.message)
            }
            toast.success("Category Created Successfully")
            //console.log("CATEGORY CREATED SUCCESSFULLY ",response?.data?.message)
        } catch (error) {
            console.log("CATEGORY CREATION ERROR ",error)
            toast.error("Category Not Created")
        }finally{
            toast.dismiss(toastId);
        }
    }
}

export function updateCategory(data){
    return async(dispatch)=>{
        const toastId=toast.loading("Loading...");
        try {
            const response = await apiConnector(
                "PUT",
                UPDATECATEGORY,
                data,
                {
                    "content-type": "application/json"
                }
            )
            if(!response?.data?.message){
                throw new Error(response.data.message)
            }
            toast.success("Category Updated Successfully")
            //console.log("CATEGORY UPDATED SUCCESSFULLY ",response?.data?.message)
        } catch (error) {
            console.log("CATEGORY UPDATE ERROR ",error)
            toast.error("Category Not Updated")
        }finally{
            toast.dismiss(toastId);
        }
    }
}

export function deactivateCategory(data){
    return async(dispatch)=>{
        const toastId=toast.loading("Loading...");
        try {
            const response = await apiConnector(
                "PATCH",
                DEACTIVATECATEGORY,
                data,
                {
                    "content-type": "application/json"
                }
            )
            if(!response?.data?.message){
                throw new Error(response.data.message)
            }
            toast.success("Category Deactivated Successfully")
            //console.log("CATEGORY DEACTIVATED SUCCESSFULLY ",response?.data?.message)
        } catch (error) {
            console.log("CATEGORY DEACTIVATION ERROR ",error)
            toast.error("Category Not Deactivated")
        }finally{
            toast.dismiss(toastId);
        }
    }
}
