import React from 'react';
import { useState } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import backendURL from './config'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${backendURL}/api/login`, { email, password }).then((res) => {
            toast.success('user logined')
        }).catch((error) => {
            toast.error(error.response.data.message)
            console.log(error)
        })

    };
    return (
        <div>
            <ToastContainer />
            <h2>login In</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}
