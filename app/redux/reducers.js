import { combineReducers } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice' 
import profileReducer from './slices/profileSlice'
import categoryReducer from './slices/categorySlice'
import consultantReducer from './slices/consultantSlice'
const rootReducer = combineReducers({
    auth:authReducer,
    profile:profileReducer,
    category:categoryReducer,
    consultant:consultantReducer
})

export default rootReducer;