"use client"
import React,{useState} from 'react'
import Template from './Template'
import Loading from '../common/Loading';
import { useSelector } from 'react-redux';
const Signup = () => {
  const {loading} = useSelector((state)=>state.auth)
  return (
    loading ? (
        <div><Loading/></div>
    ) : (
      <div>
        <Template
        title={"Create Your Free Account"}
        desc1={"Join our network to connect with verified consultants and book appointments instantly."}
        formType="signup"/>
      </div>
    )
  )
}

export default Signup