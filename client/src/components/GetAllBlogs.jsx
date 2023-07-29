import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import backendURL from "./config";
import "./blogs.css";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

export default function GetAllBlogs() {
  const [blogArray, setBlogArray] = useState([]);
  const [userList, setUserList] = useState({});
  const [flag, setFlag] = useState(false);
  const [followerFlag, setFollowerFlag] = useState(false);
  const token = localStorage.getItem("token");
  let user = JSON.parse(localStorage.getItem("userId"))
  const navigate = useNavigate();
  useEffect(() => {
    getAllBlogController();
    userProfile()
  }, []);

  console.log(userList)

  const userProfile = () =>{
   return  axios.get(`${backendURL}/api/user-profile/${user._id}`,{headers:{Authorization:token}})
    .then((res) => {
     setUserList(res.data.userExist)
    })
    .catch((error) => {
      toast.error(error.response.data.message);
      console.log(error);
    });
  }

  const getAllBlogController = () => {
    axios
      .get(`${backendURL}/api/get-blog/${user._id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        let temp = [];
        res.data.allBlogs.forEach((i) => {
          temp.push({
            ...i,
            currentIndex: 0,
            commentValue: "",
            likeCount: i.likes.length,
          });
        });
        setBlogArray(temp);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  const addComment = (_id, value) => {
    let comments = {
      email: user.email,
      userId: user._id,
      comment: value,
      profile: user.profile,
    };
    return axios
      .post(`${backendURL}/api/add-comments/${_id}`, comments, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        toast.success("comment added");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteComment = (blogId, _id) => {
    return axios
      .post(
        `${backendURL}/api/delete-comments`,
        {
          blogId,
          _id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        toast.success("comment added");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const like = (_id, index) => {
    let temp = [...blogArray];
    let likes = {
      email: user.email,
      userId: user._id,
      profile: user.profile,
    };
    if (
      temp[index].likes.filter((i) => {
        return i.userId == user._id;
      }).length > 0
    ) {
      temp[index].likes = temp[index].likes.filter((i) => {
        return i.userId !== user._id;
      });
      setBlogArray(temp);
    } else {
      temp[index].likes.push(likes);
      setBlogArray(temp);
    }
    return axios
      .post(`${backendURL}/api/like/${_id}`, likes, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const sendUnFollowRequest = (userDetail) => {
    // let unfollow = user.frineds.filter((friend) => {
    //   return friend._id !== userDetail._id;
    // });
    // setUserList((prevUser) => ({
    //   ...prevUser,
    //   frineds: unfollow,
    // }));
    // const updatedUserData = {
    //   ...user,
    //   frineds: unfollow,
    // };
    // localStorage.setItem("userId", JSON.stringify(updatedUserData));
    return axios
      .post(
        `${backendURL}/api/unfollow-request`,
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
        getAllBlogController();
        userProfile();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  console.log(userList)

  const sendRequest = (userDetail) => {
    // const updatedFriends = [...user.frineds];
    // updatedFriends.push(userDetail);

    // const updatedUser = {
    //   ...user,
    //   frineds: updatedFriends,
    // };

    // console.log(updatedUser)
    // // localStorage.setItem("userId", JSON.stringify(updatedUser));

    // setUserList(updatedUser);
    return axios
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
        getAllBlogController();
        userProfile();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };


  const pre = (i) => {
    let temp = [...blogArray];
    const isFirstIndex = blogArray[i].currentIndex === 0;
    const newIndex = isFirstIndex
      ? blogArray[i].images.length - 1
      : blogArray[i].currentIndex - 1;
    temp[i] = { ...temp[i], currentIndex: newIndex };
    setBlogArray(temp);
  };

  const next = (i) => {
    let temp = [...blogArray];
    const isFirstIndex =
      blogArray[i].currentIndex === blogArray[i].images.length - 1;
    const newIndex = isFirstIndex ? 0 : blogArray[i].currentIndex + 1;
    temp[i] = { ...temp[i], currentIndex: newIndex };
    setBlogArray(temp);
  };

  const addCommentsFunc = (value, index) => {
    let temp = [...blogArray];
    temp[index] = { ...temp[index], commentValue: value };
    setBlogArray(temp);
  };

  console.log(userList)

  return (
    <div className="signInContainer" style={{ flexDirection: "row" }}>
      <div className="blogFirstContainer">
        <div className="blogContiner1">
          <div style={{ width: "100%" }}>
            <img src={user.cover} className="coverImagClass" alt="" />
          </div>
          <div className="upload">
            <img src={user.profile} alt="" />
          </div>
          <form className="formContainer">
            <div className="verticalAlign" style={{ textAlign: "center" }}>
              <label htmlFor="name" style={{ fontSize: "15px" }}>
                Name: {user.name}
              </label>
            </div>
            <div className="verticalAlign" style={{ textAlign: "center" }}>
              <label htmlFor="email" style={{ fontSize: "15px" }}>
                Email: {user.email}
              </label>
            </div>
            <div style={{ display: "flex" }}>
              <div className="following">following</div>
              <div className="following" style={{ border: "none" }}>
                followers
              </div>
            </div>
            <div style={{ display: "flex", marginTop: "-1rem" }}>
              <div className="following">{userList?.frineds?.length}</div>
              <div className="following" style={{ border: "none" }}>
                {userList?.follower?.length}
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="blogContiner2" >
        {" "}
        {blogArray.map((i, index) => {
          return (
            <div class="card">
              <div className="friends_design" style={{marginBottom:'1rem'}}>
                <img
                  src={i.userId.profile ? i.userId.profile : "profilepicture.jpg"}
                  alt=""
                  onClick={() => {
                    navigate(`/user-profile/${i.userId._id}`);
                  }}
                />
               <div>{i.userId.email}<div>{i.createdAt}</div> </div></div>
              <div class="swiper-container">
                {i.images.length > 1 && (
                  <div
                    onClick={() => {
                      pre(index);
                    }}
                  >
                    <i
                      class="fas fa-chevron-left"
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                )}
                <div style={{ display: "flex", height:"200px", width:'100%' }}>
                  <img
                    key={i._id}
                    src={i.images[i.currentIndex]}
                    alt=""
                    style={{
                      height: "auto",
                      width: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                {i.images.length > 1 && (
                  <div
                    onClick={() => {
                      next(index);
                    }}
                  >
                    <i
                      class="fas fa-chevron-right"
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                )}
              </div>
              <h2 class="card-title">{i.title}</h2>
              <p class="card-description">{i.description}</p>
              {i.comments
                .sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
                .map((comment) => {
                  return (
                    <div style={{ border: "1px solid" }}>
                      <img
                        src={comment.profile}
                        style={{
                          height: "50px",
                          width: "50px",
                          borderRadius: "50%",
                        }}
                        alt=""
                      />{" "}
                      <div
                        onClick={() => {
                          navigate(`/user-profile/${comment.userId}`);
                        }}
                      >
                        {comment.email}
                      </div>
                      <div>{comment.comment}</div>
                      {(i.userId._id == user._id ||
                        comment.userId == user._id) && (
                        <button
                          onClick={() => {
                            deleteComment(i._id, comment._id);
                          }}
                        >
                          delete
                        </button>
                      )}
                    </div>
                  );
                })}
              <textarea
                value={i.commentValue}
                onChange={(e) => {
                  addCommentsFunc(e.target.value, index);
                }}
                name=""
                id=""
                cols="30"
                rows="10"
              />
              <button
                onClick={() => {
                  addComment(i._id, i.commentValue);
                }}
              >
                add
              </button>
              <button
                style={
                  i.likes.filter((i) => {
                    return i.userId == user._id;
                  }).length > 0
                    ? { background: "blue", color: "white" }
                    : {}
                }
                onClick={() => {
                  like(i._id, index);
                }}
              >
                {" "}
                {i.likes.filter((i) => {
                  return i.userId == user._id;
                }).length > 0
                  ? "unlike"
                  : "like"}{" "}
                {i.likes.length}{" "}
              </button>
              <div>people who liked</div>
              {i.likes.map((like) => {
                return (
                  <div>
                    <img
                      src={like.profile}
                      style={{
                        height: "50px",
                        width: "50px",
                        borderRadius: "50%",
                      }}
                      alt=""
                    />{" "}
                    {like.email}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="blogFirstContainer">
        <div className="blogContiner1">
          <h2>following</h2>
          {userList?.frineds?.slice(0.5).map((friend) => {
            return (
              <div className="friends_design">
                <img
                  src={friend.profile ? friend.profile : "profilepicture.jpg"}
                  onClick={() => {
                    navigate(`/user-profile/${friend._id}`);
                  }}
                />
                {friend.email}
                <button
                  className="smallButton"
                  onClick={() => {
                    sendUnFollowRequest(friend);
                  }}
                >
                  unfollow
                </button>
              </div>
            );
          })}
          {userList?.frineds?.length > 2 && (
            <div
              className="friends_design"
              onClick={() => {
                setFlag(true);
              }}
            >
              see all
            </div>
          )}
          <h2>followers</h2>
          {userList?.follower?.map((friend) => {
            return (
              <div className="friends_design">
                <img
                  onClick={() => {
                    navigate(`/user-profile/${friend._id}`);
                  }}
                  src={friend.profile ? friend.profile : "profilepicture.jpg"}
                  alt=""
                />
                {friend.email}{" "}
                <button
                  onClick={() => {
                    userList?.frineds.some((i) => {
                      return i._id == friend._id;
                    })
                      ? sendUnFollowRequest(friend)
                      : sendRequest(friend);
                  }}
                  className="smallButton"
                >
                  {userList?.frineds.some((i) => {
                    return i._id == friend._id;
                  })
                    ? "unfollow"
                    : "follow"}
                </button>
              </div>
            );
          })}
          {userList?.follower?.length > 1 && (
            <div
              className="friends_design"
              onClick={() => {
                setFollowerFlag(true);
              }}
            >
              see all
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={flag}
        PaperProps={{
          style: {
            width: "auto",
            height: "33rem",
          },
        }}
        onClose={() => {
          setFlag(false);
        }}
        maxWidth="md"
      >
        <DialogTitle
          style={{
            textAlign: "center",
            padding: "1rem",
            position: "relative",
            fontFamily: "Lato",
          }}
        >
          <div
            onClick={() => {
              setFlag(false);
            }}
          >
            <i
              className="fas fa-times"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
            />
          </div>
        </DialogTitle>
        <DialogContent>
          <h2>following</h2>
          {userList?.frineds?.map((friend) => {
            return (
              <div className="friends_design">
                <img
                  onClick={() => {
                    navigate(`/user-profile/${friend._id}`);
                  }}
                  src={friend.profile ? friend.profile : "profilepicture.jpg"}
                  alt=""
                />
                {friend.email}
                <button
                  className="smallButton"
                  onClick={() => {
                    sendUnFollowRequest(friend);
                  }}
                >
                  unfollow
                </button>
              </div>
            );
          })}
        </DialogContent>
      </Dialog>
      <Dialog
        open={followerFlag}
        PaperProps={{
          style: {
            width: "auto",
            height: "33rem",
          },
        }}
        onClose={() => {
          setFollowerFlag(false);
        }}
        maxWidth="md"
      >
        <DialogTitle
          style={{
            textAlign: "center",
            padding: "1rem",
            position: "relative",
            fontFamily: "Lato",
          }}
        >
          <div
            onClick={() => {
              setFollowerFlag(false);
            }}
          >
            <i
              className="fas fa-times"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
            />
          </div>
        </DialogTitle>
        <DialogContent>
          <h2>followers</h2>
          {userList?.follower?.map((friend) => {
            return (
              <div className="friends_design">
                <img
                  onClick={() => {
                    navigate(`/user-profile/${friend._id}`);
                  }}
                  src={friend.profile ? friend.profile : "profilepicture.jpg"}
                  alt=""
                />
                {friend.email}
                <button
                  onClick={() => {
                    userList?.frineds.some((i) => {
                      return i._id == friend._id;
                    })
                      ? sendUnFollowRequest(friend)
                      : sendRequest(friend);
                  }}
                  className="smallButton"
                >
                  {userList?.frineds.some((i) => {
                    return i._id == friend._id;
                  })
                    ? "unfollow"
                    : "follow"}
                </button>
              </div>
            );
          })}
        </DialogContent>
      </Dialog>
    </div>
  );
}
