import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import backendURL from "./config";
import "./blogs.css";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "./Footer";

export default function DiscoverPeople() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userId"));
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

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
        setUsers(res.data.allUsers);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  const sendRequest = (userDetail) => {
    let temp = users.filter((i) => {
      return i._id !== userDetail._id;
    });
    setUsers(temp);
    user.frineds.push(userDetail);
    localStorage.setItem("userId", JSON.stringify(user));
    axios
      .post(
        `${backendURL}/api/follow-request`,
        {
          sendersId: user._id,
          recieversId: userDetail._id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        toast.error(res.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  return (
    <div>
      <Footer/>
      <div className="signInContainer roww" style={{alignItems:'start'}}>
      <div className="blogContiner1" style={{boxShadow:'none'}}>
      <h2>people you may know</h2>
        {users.map((user) => {
          return (
            // <div className="blogContiner1">
            //     <div onClick={()=>{navigate(`/user-profile/${user._id}`)}}>{user.name}</div>
            //     <div>{user.email}</div>
            //     <button onClick={()=>{sendRequest(user)}}>follow</button>
            // </div>
            <div className="friends_design">
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <img
                  src={user.profile ? user.profile : "profilepicture.jpg"}
                  onClick={() => {
                    navigate(`/user-profile/${user._id}`);
                  }}
                />
                {user.name}
              </div>
              <button
                className="smallButton"
                onClick={() => {
                  sendRequest(user);
                }}
              >
                follow
              </button>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}
