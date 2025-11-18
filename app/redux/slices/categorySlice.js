const { createSlice } = require("@reduxjs/toolkit")

const initialState = {
    category:[],
    loading:false
}

const categorySlice = createSlice({
    name:"category",
    initialState,
    reducers:{
        setCategory:(state,action)=>{
            state.category=action.payload
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        }
    }
})

export const {setCategory,setLoading} = categorySlice.actions
export default categorySlice.reducer