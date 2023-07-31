import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import backendURL from './config'
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${backendURL}/api/login`, { email, password }).then((res) => {
            toast.success('user logined')
            localStorage.setItem('userId', JSON.stringify(res.data.userExist))
            localStorage.setItem('token', res.data.token)
            navigate('/Blogs')
        }).catch((error) => {
            toast.error(error.response.data.message)
            console.log(error)
        })

    };
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

      const responseSuccessGoogle = (response) => {
        var userObject = jwt_decode(response.credential);
        setUser(userObject);
        axios
          .post(`${backendURL}/api/register/google`, {
            name: userObject.name,
            email: userObject.email,
            email_verified: userObject.email_verified,
            profile: userObject.picture,
          })
          .then((res) => {
            toast.success("User created");
            localStorage.setItem("userId", JSON.stringify(res.data.newUser));
            localStorage.setItem("token", res.data.token);
            navigate("/allBlogs");
            document.getElementById("signInDiv").hidden = true;
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
            <h2>login In</h2>
            <form className="formContainer" onSubmit={handleSubmit}>
                <div className="verticalAlign">
                    <label htmlFor="email">Email:</label>
                    <input className="inputDesign" type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="verticalAlign">
                    <label htmlFor="password">Password:</label>
                    <input className="inputDesign" type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button className="singInButton" type="submit">login</button>
            </form>
            <div className="alreadyUser" style={{marginTop:'1rem', textDecoration:'underline'}}  onClick={() => {
              navigate("/fogot-password");
            }} >forget password?</div>
            <div style={{width:'100%',marginTop:'1rem'}} id="signInDiv"></div>
            </div>
        </div>
    )
}
