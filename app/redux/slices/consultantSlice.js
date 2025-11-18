const { createSlice } = require("@reduxjs/toolkit")

const initialState = {
    allConsultant : [],
    loading : false
}
const consultantSlice = createSlice({
        name:"consultant",
        initialState,
        reducers:{
            setConsultant:(state,action)=>{
                state.allConsultant = action.payload
            },
            setLoading:(state,action)=>{
                state.loading = action.payload
            }
        }
})

export const{setConsultant,setLoading} = consultantSlice.actions
export default consultantSlice.reducer