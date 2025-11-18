"use client"
import React from 'react'
import Template from './Template'
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
const Login = () => {
  const { loading } = useSelector((state) => state.auth)
  return (
    loading ? (
      <div className="p-8 bg-gray-900 h-screen text-center text-xl text-blue-200 flex items-center justify-center space-x-2">
        <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5"/>
        <span>Signing in...</span>
      </div>
    ) : (
      <Template
        title={"Welcome Back!"}
        desc1={"Log in to continue exploring consultants, booking sessions, and growing with expert advice."}
        formType="login"
      />
    )
  )
}

export default Login