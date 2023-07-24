import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import backendURL from './config';
import './blogs.css';
import { useNavigate } from 'react-router-dom';

export default function PersonalBlogs() {
  const [blogArray, setBlogArray] = useState([]);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('userId'));
  const navigate = useNavigate();
  useEffect(() => {
    getAllBlogController();
  }, []);


  const getAllBlogController = () => {
    axios
      .get(`${backendURL}/api/personal-blog/${user._id}`, {
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

  const deleteBlog = (_id) => {
    axios
      .delete(
        `${backendURL}/api/single-blog/${_id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        toast.success('deleted');
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  }
  
  const deleteComment = (blogId, _id) =>{
    return axios.post(`${backendURL}/api/delete-comments`,{
        blogId, _id
    },{
        headers:{
            Authorization: token,
        }
    }).then((res)=>{
        toast.success('comment added')
    }).catch((error)=>{
        console.log(error)
    })
}
  return (
    <div>
      <ToastContainer />
       {blogArray.map((i, index) => {
      return (
        <div class="card">
          <div class="swiper-container">
            {i.images.length > 1 && ( <div onClick={() => { pre(index) }}><i class="fas fa-chevron-left" style={{ cursor: 'pointer' }} /></div>)}
            <div style={{ display: 'flex' }}>
              <img key={i._id} src={i.images[i.currentIndex]} alt="" style={{ height: 'auto', width: '100%', objectFit: 'contain' }} />

            </div>
            {i.images.length > 1 && ( <div onClick={() => { next(index) }}><i class="fas fa-chevron-right" style={{ cursor: 'pointer' }} /></div>)}
          </div>
          <h2 class="card-title">{i.title}</h2>
          <p class="card-description">{i.description}</p>
          <p class="card-description" onClick={() => { navigate(`/single-blog/${i._id}`) }} >edit</p>
          <p class="card-description" onClick={() => { deleteBlog(i._id) }} >delete</p>
          {i.comments.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)).map((comment)=>{
                    return(
                        <div style={{border:'1px solid'}}>
                            <div onClick={()=>{navigate(`/user-profile/${comment.userId}`)}} >{comment.email}</div>
                            <div>{comment.comment}</div>
                           {(i.userId._id == user._id || comment.userId == user._id) &&  <button onClick={()=>{deleteComment(i._id,comment._id)}} >delete</button>}
                        </div>
                    )
                  })}
        </div>
      )
    })}
    </div>
  )
}
