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
    <div>
        < ToastContainer/>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button onClick={()=>{resetPassword()}} >reset password</button>
      </div>
    </div>
  );
}
