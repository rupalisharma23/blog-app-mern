import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import backendURL from './config';
import './blogs.css';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendIcon from "@mui/icons-material/Send";
import moment from "moment";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Footer from './Footer';

export default function UserProfile() {
  const [blogArray, setBlogArray] = useState([]);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('userId'));
  const [likesArray, setLikesArray] = useState([]);
  const [commentArray, setCommentsArray] = useState([]);
  const [userList, setUserList] = useState({});
  const [userFollower, setUserFollower] = useState({});
  const [flag, setFlag] = useState(false);
  const [followerFlag, setFollowerFlag] = useState(false);
  const [likesFlag, setLikesFlag] = useState(false);
  const [indexForDeleteComment, setIndexForDeleteComment] = useState(0);
  const [commentFlag, setCommentFlag] = useState(false);
  const navigate = useNavigate();
  const params = useParams()
  useEffect(() => {
    getAllBlogController();
    userProfile();
    followerProfile()
    setFlag(false);
    setFollowerFlag(false);
    setLikesFlag(false);
    setCommentFlag(false);
  }, [params._id]);


  const getAllBlogController = () => {
    axios
      .get(`${backendURL}/api/personal-blog/${params._id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        let temp = [];
        res.data.allBlogs.forEach((i) => {
          temp.push({ ...i, currentIndex: 0 })
        })
        setBlogArray(temp);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  const userProfile = () => {
    return axios
      .get(`${backendURL}/api/user-profile/${user._id}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setUserList(res.data.userExist);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  const followerProfile = () => {
    return axios
      .get(`${backendURL}/api/user-profile/${params._id}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setUserFollower(res.data.userExist);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };


  const addComment = (_id, value, index, name) => {
    let comments = {
      email: user.email,
      userId: user._id,
      comment: value,
      profile: user.profile,
      name: user.name,
    };
    let temp = [...blogArray];
    temp[index] = { ...temp[index], commentValue: "" };
    temp[index].comments.push({
      ...comments,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setBlogArray(temp);
    toast.success("comment added");
    return axios
      .post(`${backendURL}/api/add-comments/${_id}`, comments, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {  getAllBlogController();})
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteComment = (blogId, _id) => {
    let temp = [...blogArray];
    const index = temp.findIndex((item) => item._id === blogId);
    temp[index] = {
      ...temp[index],
      comments: temp[index].comments.filter((i) => {
        return i._id !== _id;
      }),
    };
    setBlogArray(temp);
    setCommentsArray(temp[index]);
    toast.success("comment deleted");
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
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const like = (_id, index, name) => {
    let temp = [...blogArray];
    let likes = {
      email: user.email,
      userId: user._id,
      profile: user.profile,
      name: user.name,
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

  const sendUnFollowRequest = (userDetail, likeFlag) => {
    return axios
      .post(
        `${backendURL}/api/unfollow-request`,
        {
          sendersId: user._id,
          recieversId: likeFlag ? userDetail.userId : userDetail._id,
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

  const sendRequest = (userDetail, likeFlag) => {
    user.frineds.push(userDetail)
    localStorage.setItem('userId', JSON.stringify(user))
    return axios
      .post(
        `${backendURL}/api/follow-request`,
        {
          sendersId: user._id,
          recieversId: likeFlag ? userDetail.userId : userDetail._id,
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

  const deleteBlog = (_id, index) => {
    let temp = blogArray.filter((i)=>{return i._id!==_id })
    setBlogArray(temp)

   return axios
      .delete(`${backendURL}/api/single-blog/${_id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        toast.success("deleted");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  const pre = (i) => {
    let temp = [...blogArray]
    const isFirstIndex = blogArray[i].currentIndex === 0
    const newIndex = isFirstIndex ? blogArray[i].images.length - 1 : blogArray[i].currentIndex - 1;
    temp[i] = { ...temp[i], currentIndex: newIndex }
    setBlogArray(temp)
  }

  const next = (i) => {
    let temp = [...blogArray]
    const isFirstIndex = blogArray[i].currentIndex === blogArray[i].images.length - 1
    const newIndex = isFirstIndex ? 0 : blogArray[i].currentIndex + 1;
    temp[i] = { ...temp[i], currentIndex: newIndex }
    setBlogArray(temp)
  }

  const addCommentsFunc = (value, index) => {
    let temp = [...blogArray];
    temp[index] = { ...temp[index], commentValue: value };
    setBlogArray(temp);
  };

  return (
    <div>
      <Footer/>
      <div className="signInContainer roww">
  <ToastContainer />
  <div className="blogFirstContainer1Profile">
    <div className="blogContiner1">
      <div style={{ width: "100%" }}>
        <img
          src={userFollower?.cover ? userFollower?.cover : "coverpicture.jpg"}
          className="coverImagClass"
          alt=""
        />
      </div>
      <div className="upload">
        <img
          src={userFollower?.profile ? userFollower?.profile : "profilepicture.jpg"}
          alt=""
        />
      </div>
      <form className="formContainer">
        <div className="verticalAlign" style={{ textAlign: "center", flexDirection:'row', justifyContent:'center', position:'relative' }}>
          <label htmlFor="name" style={{ fontSize: "15px" }}>
            Name: {userFollower?.name}
          </label>
         { user._id == params._id &&  <div style={{position:'absolute', right:'0', cursor:'pointer'}} onClick={()=>{navigate('/update-profile')}} > <EditIcon/></div> }
        </div>
        <div className="verticalAlign" style={{ textAlign: "center" }}>
          <label htmlFor="email" style={{ fontSize: "15px" }}>
            Email: {userFollower?.email}
          </label>
        </div>
        <div style={{ display: "flex" }}>
          <div className="following">following</div>
          <div className="following" style={{ border: "none" }}>
            followers
          </div>
        </div>
        <div style={{ display: "flex", marginTop: "-1rem" }}>
          <div className="following"> <div  onClick={()=>{setFlag(true)}}>{userFollower?.frineds?.length}</div> </div>
          <div className="following" style={{ border: "none" }}>
           <div onClick={()=>{setFollowerFlag(true)}} >{userFollower?.follower?.length}</div> 
          </div>
        </div>
      </form>
    </div>
  </div>
  <div className="blogContiner2">
        {" "}
        { blogArray.length == 0 ?<div style={{height:"40vh", justifyContent:'center', display:'flex', alignItems:"center"}} className='card-description' > no posts </div> : blogArray.map((i, index) => {
          return (
            <div class="card">
              <div
                className="friends_design"
                style={{ marginBottom: "1rem", justifyContent: "space-between", width:'100%' }}
              >
                <div style={{display:'flex', gap:"1rem"}}>
                <img
                  src={
                    i.userId.profile ? i.userId.profile : "profilepicture.jpg"
                  }
                  alt=""
                  onClick={() => {
                    navigate(`/user-profile/${i.userId._id}`);
                  }}
                />
                <div>
                 <span onClick={() => {
                    navigate(`/user-profile/${i.userId._id}`);
                  }}>{i.userId.name}</span> 
                  <div>
                    {moment(i.createdAt).format("DD/MM/YYYY hh:mm a")}
                  </div>{" "}
                </div>
                </div>
                <div>
               { i.userId._id == user._id && ( <>
                <EditIcon  onClick={() => {
                navigate(`/single-blog/${i._id}`);
              }}/>
                <DeleteIcon  onClick={() => {
                deleteBlog(i._id, index);
              }} style={{color:"red", marginLeft:"10px"}}/>
               </>)}
                </div>
              </div>
              {i.images.length>0 && <div class="swiper-container">
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
                <div
                  style={{ display: "flex", height: "200px", width: "100%" }}
                >
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
              </div>}
              <h2 className="card-title">{i.title}</h2>
              <p className="card-description">{i.description}</p>
              <div>
                {i.likes.filter((i) => {
                  return i.userId == user._id;
                }).length > 0 ? (
                  <FavoriteIcon
                    onClick={() => {
                      like(i._id, index);
                    }}
                    style={{
                      color: "red",
                      cursor: "pointer",
                      fontSize: "35px",
                    }}
                  />
                ) : (
                  <FavoriteBorderIcon
                    onClick={() => {
                      like(i._id, index);
                    }}
                    style={{ cursor: "pointer", fontSize: "35px" }}
                  />
                )}
                <CommentIcon
                  onClick={() => {
                    setCommentsArray(i);
                    setCommentFlag(true);
                    setIndexForDeleteComment(index);
                  }}
                  style={{
                    cursor: "pointer",
                    fontSize: "35px",
                    marginLeft: "10px",
                  }}
                />
              </div>
              {i.likes.length > 0 && (
                <div
                  className="card-title"
                  onClick={() => {
                    setLikesArray(i.likes);
                    setLikesFlag(true);
                  }}
                  style={{ fontSize: "12px", cursor: "pointer" }}
                >
                  {i.likes.length} people liked
                </div>
              )}
              <div style={{ display: "flex" }}>
                <input
                  value={i.commentValue}
                  onChange={(e) => {
                    addCommentsFunc(e.target.value, index);
                  }}
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                  className="inputComment"
                  placeholder="Add comment"
                />
                <SendIcon
                  onClick={() => {
                    addComment(i._id, i.commentValue, index);
                  }}
                  style={{ fontSize: "30px", cursor: "pointer" }}
                />
              </div>
            </div>
          );
        })}
        <Dialog
          open={likesFlag}
          PaperProps={{
            style: {
              width: "100%",
              height: "33rem",
            },
          }}
          onClose={() => {
            setLikesFlag(false);
          }}
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
                setLikesFlag(false);
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
            <h2>Likes</h2>
            {likesArray?.map((friend) => {
              return (
                <div className="friends_design">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <img
                      onClick={() => {
                        navigate(`/user-profile/${friend.userId}`);
                      }}
                      src={
                        friend.profile ? friend.profile : "profilepicture.jpg"
                      }
                      alt=""
                    />
                   <span  onClick={() => {
                        navigate(`/user-profile/${friend.userId}`);
                      }}>{friend.name}</span> 
                  </div>
                  {user._id !== friend.userId && (
                    <button
                      onClick={() => {
                        userList?.frineds?.some((i) => {
                          return i._id == friend.userId;
                        })
                          ? sendUnFollowRequest(friend, "likes")
                          : sendRequest(friend, "likes");
                      }}
                      className="smallButton"
                    >
                      {userList?.frineds?.some((i) => {
                        return i._id == friend.userId;
                      })
                        ? "unfollow"
                        : "follow"}
                    </button>
                  )}
                </div>
              );
            })}
          </DialogContent>
        </Dialog>
        <Dialog
          open={commentFlag}
          PaperProps={{
            style: {
              width: "100%",
              height: "33rem",
            },
          }}
          onClose={() => {
            setCommentFlag(false);
          }}
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
                setCommentFlag(false);
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
            <h2>comments</h2>
            {commentArray.comments
              ?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
              .map((comment) => {
                return (
                  <div>
                    <div className="friends_design">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <img
                          src={comment.profile}
                          style={{
                            height: "50px",
                            width: "50px",
                            borderRadius: "50%",
                          }}
                          onClick={() => {
                            navigate(`/user-profile/${comment.userId}`);
                          }}
                          alt=""
                        />{" "}
                        <div>
                         <span onClick={() => {
                            navigate(`/user-profile/${comment.userId}`);
                          }}>{comment.name}</span> 
                          <div style={{ fontWeight: "300" }}>
                            {comment.comment}
                          </div>{" "}
                        </div>
                      </div>
                      {(commentArray.userId._id == user._id ||
                        comment.userId == user._id) && (
                        <DeleteOutlineIcon
                          style={{ color: "red", fontSize: "20px" }}
                          onClick={() => {
                            deleteComment(commentArray._id, comment._id);
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </DialogContent>
        </Dialog>
      </div>
      <div className="blogFirstContainer followersDeactive">
        {  <div className="blogContiner1">
           <h2>following</h2>
          { userFollower?.frineds?.length==0 ? <div className="card-description">no following</div>: userFollower?.frineds?.slice(0.5).map((friend) => {
            return (
              <div className="friends_design">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <img
                    src={friend.profile ? friend.profile : "profilepicture.jpg"}
                    onClick={() => {
                      navigate(`/user-profile/${friend._id}`);
                    }}
                  />
                 <span  onClick={() => {
                      navigate(`/user-profile/${friend._id}`);
                    }}>{friend.name}</span> 
                </div>
                {user._id !==friend._id && <button
                      onClick={() => {
                        userList?.frineds?.some((i) => {
                          return i._id == friend._id;
                        })
                          ? sendUnFollowRequest(friend)
                          : sendRequest(friend);
                      }}
                      className="smallButton"
                    >
                      {userList?.frineds?.some((i) => {
                        return i._id == friend._id;
                      })
                        ? "unfollow"
                        : "follow"}
                    </button>}
              </div>
            );
          })}
          {userFollower?.frineds?.length > 5 && (
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
          { userFollower?.follower?.length==0 ? <div className="card-description">no followers</div>:  userFollower?.follower?.slice(0.5).map((friend) => {
            return (
              <div className="friends_design">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <img
                    onClick={() => {
                      navigate(`/user-profile/${friend._id}`);
                    }}
                    src={friend.profile ? friend.profile : "profilepicture.jpg"}
                    alt=""
                  />
                 <span  onClick={() => {
                      navigate(`/user-profile/${friend._id}`);
                    }}>{friend.name}{" "}</span> 
                </div>
               {user._id !== friend._id && <button
                      onClick={() => {
                        userList?.frineds?.some((i) => {
                          return i._id == friend._id;
                        })
                          ? sendUnFollowRequest(friend)
                          : sendRequest(friend);
                      }}
                      className="smallButton"
                    >
                      {userList?.frineds?.some((i) => {
                        return i._id == friend._id;
                      })
                        ? "unfollow"
                        : "follow"}
                    </button>}
              </div>
            );
          })}
          {userFollower?.follower?.length > 5 && (
            <div
              className="friends_design"
              onClick={() => {
                setFollowerFlag(true);
              }}
            >
              see all
            </div>
          )}
        </div>}
      </div>
      <Dialog
        open={flag}
        PaperProps={{
          style: {
            width: "100%",
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
          {userFollower?.frineds?.map((friend) => {
            return (
              <div className="friends_design">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <img
                    onClick={() => {
                      navigate(`/user-profile/${friend._id}`);
                    }}
                    src={friend.profile ? friend.profile : "profilepicture.jpg"}
                    alt=""
                  />
                <span onClick={() => {
                      navigate(`/user-profile/${friend._id}`);
                    }}>{friend.name}</span>  
                </div>
                {user._id !== friend._id && <button
                      onClick={() => {
                        userList?.frineds?.some((i) => {
                          return i._id == friend._id;
                        })
                          ? sendUnFollowRequest(friend)
                          : sendRequest(friend);
                      }}
                      className="smallButton"
                    >
                      {userList?.frineds?.some((i) => {
                        return i._id == friend._id;
                      })
                        ? "unfollow"
                        : "follow"}
                    </button>}
              </div>
            );
          })}
        </DialogContent>
      </Dialog>
      <Dialog
        open={followerFlag}
        PaperProps={{
          style: {
            width: "100%",
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
          {userFollower?.follower?.map((friend) => {
            return (
              <div className="friends_design">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <img
                    onClick={() => {
                      navigate(`/user-profile/${friend._id}`);
                    }}
                    src={friend.profile ? friend.profile : "profilepicture.jpg"}
                    alt=""
                  />
                <span  onClick={() => {
                      navigate(`/user-profile/${friend._id}`);
                    }}> {friend.name}</span> 
                </div>
                {user._id !== friend._id && <button
                      onClick={() => {
                        userList?.frineds?.some((i) => {
                          return i._id == friend._id;
                        })
                          ? sendUnFollowRequest(friend)
                          : sendRequest(friend);
                      }}
                      className="smallButton"
                    >
                      {userList?.frineds?.some((i) => {
                        return i._id == friend._id;
                      })
                        ? "unfollow"
                        : "follow"}
                    </button>}
              </div>
            );
          })}
        </DialogContent>
      </Dialog>
</div>
    </div>
  )
}
