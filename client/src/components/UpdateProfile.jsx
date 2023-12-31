import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import backendURL from './config';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Footer from './Footer';
import {CircularProgress} from "@mui/material";

export default function UpdateProfile() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('userId'));
  const [name, setName] = useState(user.name);
  const [profile, setProfile] = useState(user.profile);
  const [cover, setCover] = useState(user.cover); 
  const [loader, setLoader] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    if (e.target.name === 'profile') {
        const selectedImages = e.target.files[0]
            const reader = new FileReader();
            reader.readAsDataURL(selectedImages);
            reader.onload = () => {
               setProfile(reader.result)
            }
    }
   else if (e.target.name === 'cover') {
        const selectedImages = e.target.files[0]
            const reader = new FileReader();
            reader.readAsDataURL(selectedImages);
            reader.onload = () => {
               setCover(reader.result)
            }
    }
};

const handleLogout = () => {
    localStorage.clear(); // Clear user data from local storage
    navigate('/login')
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true)
   return axios.post(`${backendURL}/api/update-profile/${user._id}`, { name,  profile, cover },{headers:{Authorization:token}})
      .then((res) => {
        setLoader(false)
        toast.success(res.data.message);
        user.name = name;
        user.profile = profile;
        user.cover = cover;
        localStorage.setItem('userId',JSON.stringify(user))
      })
      .catch((error) => {
        setLoader(false)
        toast.error(error.response.data.message);
        console.log(error);
      });
  };
  const resetPassword = () =>{
    axios.post(`${backendURL}/api/forgot-password`, { email:user.email }).then((res) => {
         toast.success(res.data.message)
    }).catch((error) => {
        toast.error(error.response.data.message)
        console.log(error)
    })
  }
  return (
    <div>
      <Footer/>
      <div className="signInContainer" style={{height:'auto'}}>
  <ToastContainer />
  <div className="loginContiner1">
    <div style={{width:'100%'}}>
    <label onChange={handleInputChange} htmlFor="images">
    <img src={cover?cover:"coverpicture.jpg"} className="coverImagClass" alt="" /></label>
    <input
          type="file"
          id="images"
          name="cover"
          accept="image/*"
          onChange={handleInputChange}
         style={{display:'none'}}
        />
    </div>

    <div className="upload">
      <img src={profile? profile : 'profilepicture.jpg'} alt="" />
      <div className="round">
        <input
          type="file"
          id="images"
          name="profile"
          accept="image/*"
          onChange={handleInputChange}
        />
        <i className="fa fa-camera" ></i>
      </div>
    </div>

    <h2>Update</h2>
    <form className="formContainer" onSubmit={handleSubmit}>
      <div className="verticalAlign">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          className="inputDesign"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="verticalAlign">
        <label style={{display:'flex', alignItems:'center', gap:'1rem'}} onClick={()=>{resetPassword()}} htmlFor="password">change password <ArrowForwardIosIcon style={{height:'20px', width:'20px'}} /> </label>
      </div>
      <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
      <button className="singInButton" style={{width:'100px'}} type="submit">{loader? <CircularProgress style={{color:'white', width:'20px', height:'20px'}}/>:'save'}</button>
      <button className="singInButton" style={{width:'100px'}} type="submit" onClick={handleLogout}>logout</button>
      </div>
    </form>
  </div>
</div>
    </div>
  )
}
