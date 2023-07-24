import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import backendURL from './config';
import './blogs.css';
import { useNavigate } from 'react-router-dom';

export default function GetAllBlogs() {
    const [blogArray, setBlogArray] = useState([]);
    const [comment, setComment] = useState('');
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('userId'));
    const navigate = useNavigate();
    useEffect(() => {
        getAllBlogController();
    }, []);

    
    const getAllBlogController = () => {
        axios
            .get(`${backendURL}/api/get-blog/${user._id}`,{
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                let temp = [];
                res.data.allBlogs.forEach((i)=>{
                    temp.push({...i, currentIndex:0, commentValue:'' })
                })
                setBlogArray(temp);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                console.log(error);
            });
    };

    const addComment = (_id, value) =>{
        let comments = {
            email:user.email,
            userId:user._id,
            comment:value
        }
        return axios.post(`${backendURL}/api/add-comments/${_id}`,comments,{
            headers:{
                Authorization: token,
            }
        }).then((res)=>{
            toast.success('comment added')
        }).catch((error)=>{
            console.log(error)
        })
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

    const pre = (i) =>{
       let temp = [...blogArray]
        const isFirstIndex = blogArray[i].currentIndex === 0
        const newIndex = isFirstIndex ? blogArray[i].images.length - 1 : blogArray[i].currentIndex -1;
       temp[i] = {...temp[i], currentIndex:newIndex}
       setBlogArray(temp)
    }

    const next = (i) =>{
        let temp = [...blogArray]
        const isFirstIndex = blogArray[i].currentIndex === blogArray[i].images.length -1
        const newIndex = isFirstIndex ? 0 : blogArray[i].currentIndex + 1;
        temp[i] = { ...temp[i], currentIndex: newIndex }
        setBlogArray(temp)
    }

    const addCommentsFunc = (value, index) =>{
        let temp = [...blogArray]
        temp[index] = {...temp[index], commentValue:value}
        setBlogArray(temp)
    }

  return (
      <div> {blogArray.map((i, index) => {
          return (
              <div class="card">
                  <div class="swiper-container">
                    {i.images.length > 1 &&  (<div onClick={() => { pre(index) }}><i class="fas fa-chevron-left" style={{ cursor: 'pointer' }} /></div> )}
                      <div style={{display:'flex'}}>
                          <img key={i._id} src={i.images[i.currentIndex]} alt="" style={{ height: 'auto', width: '100%', objectFit: 'contain'}} />
                          
                      </div>
                      {i.images.length > 1 && (<div onClick={() => { next(index) }}><i class="fas fa-chevron-right" style={{ cursor: 'pointer' }} /></div>)} 
                  </div>
                  <h2 class="card-title">{i.title}</h2>
                  <p class="card-description">{i.description}</p>
                  {i.comments.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)).map((comment)=>{
                    return(
                        <div style={{border:'1px solid'}}>
                            <div onClick={()=>{navigate(`/user-profile/${comment.userId}`)}} >{comment.email}</div>
                            <div>{comment.comment}</div>
                           {(i.userId._id == user._id || comment.userId == user._id) &&  <button onClick={()=>{deleteComment(i._id,comment._id)}} >delete</button>}
                        </div>
                    )
                  })}
                  <textarea value={i.commentValue} onChange={(e)=>{addCommentsFunc(e.target.value, index)}} name="" id="" cols="30" rows="10"/>
                  <button onClick={()=>{addComment(i._id, i.commentValue)}}>add</button>
              </div>
          )
      })} 
      </div>
  )
    
}



