import React from "react";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import backendURL from "./config";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const params = useParams();
  const changePassword = () => {
    axios
      .post(`${backendURL}/api/reset-password`, {
        _id: params._id,
        token: params.token,
        password,
      })
      .then((res) => {
        toast.success(res.data.message);
        navigate('/login')
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };
  return (
    <div className="signInContainer">
      <ToastContainer />
      <div className="loginContiner1">
      <div className="verticalAlign" style={{width:'100%'}}>
      <label htmlFor="password">Password:</label>
      <input
       className="inputDesign"
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      </div>
      <button
        onClick={() => {
          changePassword();
        }} className="singInButton" style={{marginTop:'2rem'}}
      >
        change password
      </button>
      </div>
    </div>
  );
}
