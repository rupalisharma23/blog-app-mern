import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import backendURL from './config';
import './blogs.css'

export default function GetAllBlogs() {
    const [blogArray, setBlogArray] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0)
    const token = localStorage.getItem('token');
    useEffect(() => {
        getAllBlogController();
    }, []);

    
    const getAllBlogController = () => {
        axios
            .get(`${backendURL}/api/get-blog`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                console.log(res.data);
                setBlogArray(res.data.allBlogs);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                console.log(error);
            });
    };

    const ali = (i) =>{
       console.log('jo')
    }


  return (
      <div> {blogArray.map((i, index1) => {
          return (
              <div class="card">
                  <div class="swiper-container">
                      <i class="fas fa-chevron-left" style={{ cursor: 'pointer' }}></i>
                      <div style={{display:'flex'}}>
                          {i.images.map((t, index) => {
                              return (<img key={i._id} src={t} alt="" style={{ height: 'auto', width: '100%', objectFit: 'contain', display: currentIndex==index?'block':'none' }} />)
                          })}
                      </div>
                      <i class="fas fa-chevron-right" style={{cursor:'pointer'}} ></i>
                  </div>
                  <h2 class="card-title">{i.title}</h2>
                  <p class="card-description">{i.description}</p>
              </div>
          )
      })} 
      </div>
  )
    
}



