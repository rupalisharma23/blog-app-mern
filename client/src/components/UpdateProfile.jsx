import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import backendURL from './config';

export default function UpdateProfile() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('userId'));
  const [name, setName] = useState(user.name);
  const [profile, setProfile] = useState(user.profile);
  const [cover, setCover] = useState(user.cover); 
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${backendURL}/api/update-profile/${user._id}`, { name,  profile, cover },{headers:{Authorization:token}})
      .then((res) => {
        toast.success(res.data.message);
        user.name = name;
        user.profile = profile;
        user.cover = cover;
        localStorage.setItem('userId',JSON.stringify(user))
      })
      .catch((error) => {
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
    <ToastContainer />
    <div>
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
              <label htmlFor="images">profile:</label>
              <input type="file" id="images" name="profile" accept="image/*"  onChange={handleInputChange}  />
          </div>
          <div>
              <label htmlFor="images">cover</label>
              <input type="file" id="images" name="cover" accept="image/*"  onChange={handleInputChange} />
          </div>
          <div onClick={()=>{resetPassword()}} >change password</div>
         { profile && <img src={profile} alt="" style={{height:'200px', width:'200px', objectFit:'contain', borderRadius:'50%'}} />}
         { cover && <img src={cover} alt="" style={{height:'200px', width:'200px', objectFit:'contain'}} />}
        <button type="submit">update</button>
      </form>
      <button type="submit" onClick={handleLogout}>logout</button>
    </div>
  </div>
  )
}
