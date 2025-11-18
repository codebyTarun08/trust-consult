"use client"
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  user: null,
  signupData:null,
  loading: false,
  token:
    typeof window !== "undefined" && localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if(typeof window !== "undefined"){
        localStorage.setItem("user",JSON.stringify(action.payload))
      }
    },
    setSignupData: (state,action)=>{
      state.signupData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;

      // also update localStorage safely
      if (typeof window !== "undefined") {
        localStorage.setItem("token", JSON.stringify(action.payload));
      }
    },
    logout:(state)=>{
        state.user=null,
        state.token=null
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          axios.post('/api/users/logout');
        }
    }
  },
});

export const { setUser,setSignupData, setLoading, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
