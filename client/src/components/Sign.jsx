import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import backendURL from "./config";
import jwt_decode from "jwt-decode";
import GoogleLogin from "react-google-login";
import { CircularProgress } from '@mui/material';

export default function SignIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState("");
  const [cover, setCover] = useState("");
  const [signinFlag, setSigninFlag] = useState(false)
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadGoogleSignIn = () => {
      /* global google */
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_CLIENT_ID,
        callback: responseSuccessGoogle,
      });

      google.accounts.id.renderButton(document.getElementById("signInDiv"), {
        theme: "outline",
        size: "large",
      });
    };

    if (
      typeof google !== "undefined" &&
      typeof google.accounts !== "undefined"
    ) {
      loadGoogleSignIn();
    } else {
      // Load Google Sign-In script dynamically
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = loadGoogleSignIn;

      document.body.appendChild(script);
    }
  }, []);

  const handleInputChange = (e) => {
    if (e.target.name === "profile") {
      const selectedImages = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(selectedImages);
      reader.onload = () => {
        setProfile(reader.result);
      };
    } else if (e.target.name === "cover") {
      const selectedImages = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(selectedImages);
      reader.onload = () => {
        setCover(reader.result);
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSigninFlag(true)
    axios
      .post(`${backendURL}/api/register`, {
        name,
        email,
        password,
        profile,
        cover,
      })
      .then((res) => {
        setSigninFlag(false)
        toast.success("User created");
        navigate("/login");
      })
      .catch((error) => {
        setSigninFlag(false)
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  const responseSuccessGoogle = (response) => {
    var userObject = jwt_decode(response.credential);
    setUser(userObject);
    setSigninFlag(true)
    axios
      .post(`${backendURL}/api/register/google`, {
        name: userObject.name,
        email: userObject.email,
        email_verified: userObject.email_verified,
        profile: userObject.picture,
      })
      .then((res) => {
        setSigninFlag(false)
        toast.success("User created");
        localStorage.setItem("userId", JSON.stringify(res.data.newUser));
        localStorage.setItem("token", res.data.token);
        navigate("/allBlogs");
        document.getElementById("signInDiv").hidden = true;
      })
      .catch((error) => {
        setSigninFlag(false)
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  return (
    <div className="signInContainer">
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

        <h2>Sign In</h2>
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
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="inputDesign"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="verticalAlign">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              className="inputDesign"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="singInButton" type="submit">{signinFlag? <CircularProgress style={{color:'white'}} /> : 'Sign In' }</button>
          <div className="alreadyUser" >already a user? <span onClick={() => {
              navigate("/login");
            }} style={{fontWeight:500, textDecoration:'underline', cursor:'pointer'}} > Login</span></div>
          <div id="signInDiv"></div>
        </form>
      </div>
    </div>
  );
}
