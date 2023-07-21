import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import backendURL from './config';
import './blogs.css';

export default function DiscoverPeople() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('userId'));
    const [users,setUsers] = useState([])

    useEffect(() => {
        getAllUsers();
    }, []);

    const getAllUsers = () => {
        axios
            .get(`${backendURL}/api/blog-users/${user._id}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                setUsers(res.data.allUsers)
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                console.log(error);
            });
    };

    

    const sendRequest = (userDetail) =>{
        axios.post(`${backendURL}/api/follow-request`,{
            sendersId: user._id,
            recieversId: userDetail._id
        }, {
            headers: {
                Authorization: token,
            },
        }).then((res) => {
            toast.error(res.data.message);
        })
            .catch((error) => {
                toast.error(error.response.data.message);
                console.log(error);
            });
    }

  return (
    <div>
        {users.map((user)=>{
            return(
                <div>
                    <div>{user.name}</div>
                    <div>{user.email}</div>
                    <button onClick={()=>{sendRequest(user)}}>follow</button>
                </div>
            )
        })}
    </div>
  )
}
