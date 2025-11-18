const { createSlice } = require("@reduxjs/toolkit")

const initialState= {
    user : (typeof window !== "undefined" && localStorage.getItem("user"))? JSON.parse(localStorage.getItem("user")): null,
    consultant:null,
    loading:false
}
const profileSlice = createSlice({
    name:"profile",
    initialState,
    reducers:{
        setUser(state,action){
            state.user=action.payload
            if(typeof window !== "undefined"){
                  localStorage.setItem("user",JSON.stringify(action.payload))
            }
        },
        setLoading(state,action){
            state.loading=action.payload
        },
        setConsultant(state,action){
            state.consultant=action.payload
        }
    }
});
export const {setUser,setLoading,setConsultant} = profileSlice.actions;
export default profileSlice.reducer;