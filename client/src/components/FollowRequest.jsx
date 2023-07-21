import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import backendURL from './config';
import './blogs.css';

export default function FollowRequest() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('userId'));
    const [users, setUsers] = useState([])

    useEffect(() => {
        getFollowRequest();
    }, []);

    const getFollowRequest = () => {
        axios
            .get(`${backendURL}/api/get-follow-request/${user._id}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                setUsers(res.data.getFollowRequestsList)
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                console.log(error);
            });
    };

    const deleteRequest = (userDetail) => {
        axios.post(`${backendURL}/api/delete-follow-request`, {
            sendersId: userDetail._id,
            recieversId: user._id
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
    const acceptRequest = (userDetail) => {
        axios.post(`${backendURL}/api/accept-follow-request`, {
            sendersId: userDetail._id,
            recieversId: user._id
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
          {users.map((user) => {
              return (
                  <div>
                      <div>{user.sendersId.name}</div>
                      <div>{user.sendersId.email}</div>
                      <button onClick={() => { acceptRequest(user.sendersId) }}>accept</button>
                      <button onClick={() => { deleteRequest(user.sendersId) }}>delete</button>
                  </div>
              )
          })}
      </div>
  )
}
