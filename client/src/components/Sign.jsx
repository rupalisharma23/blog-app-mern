
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import backendURL from './config';
import jwt_decode from 'jwt-decode';
import GoogleLogin from 'react-google-login';

export default function SignIn() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadGoogleSignIn = () => {
      /* global google */
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_CLIENT_ID,
        callback: responseSuccessGoogle
      });

      google.accounts.id.renderButton(
        document.getElementById('signInDiv'),
        { theme: 'outline', size: 'large' }
      );
    };

    if (typeof google !== 'undefined' && typeof google.accounts !== 'undefined') {
      loadGoogleSignIn();
    } else {
      // Load Google Sign-In script dynamically
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = loadGoogleSignIn;

      document.body.appendChild(script);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${backendURL}/api/register`, { name, email, password })
      .then((res) => {
        toast.success('User created');
        navigate('/login');
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  const responseSuccessGoogle = (response) => {
    var userObject = jwt_decode(response.credential);
    setUser(userObject);
    axios.post(`${backendURL}/api/register`, { name: response.credential.name, email: response.credential.email })
      .then((res) => {
        toast.success('User created');
        document.getElementById('signInDiv').hidden = true;
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  return (
    <div>
      <ToastContainer />
      <div>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Sign In</button>
          <button onClick={() => { navigate('/login'); }}>Login</button>
          <div id="signInDiv"></div>
          {user && (
            <div>
              <img src={user.picture} alt="" />
              <h1>{user.email}</h1>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

