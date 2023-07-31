import React from "react";
import { useState } from "react";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import backendURL from './config'

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const resetPassword = () =>{
    axios.post(`${backendURL}/api/forgot-password`, { email }).then((res) => {
         toast.success(res.data.message)
    }).catch((error) => {
        toast.error(error.response.data.message)
        console.log(error)
    })
  }
  return (
    <div className="signInContainer">
        < ToastContainer/>
      <div className="loginContiner1">
      <div className="verticalAlign" style={{width:'100%'}}>
      <label htmlFor="email">Email:</label>
        <input
         className="inputDesign"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
        <button className="singInButton" style={{marginTop:'2rem'}} onClick={()=>{resetPassword()}} >reset password</button>
      </div>
    </div>
  );
}
