import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import backendURL from './config';
import { useNavigate, useParams } from 'react-router-dom';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Footer from './Footer';

export default function UpdateBlog() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [blogArray, setBlogArray] = useState([]);
    const token = localStorage.getItem('token');
    const params = useParams();
    const user = JSON.parse(localStorage.getItem('userId'));

    useEffect(() => {
        getsingleBlogController();
    }, []);

    const handleInputChange = (e) => {
        if (e.target.name === 'title') {
            setTitle(e.target.value);
        } else if (e.target.name === 'description') {
            setDescription(e.target.value);
        } else if (e.target.name === 'images') {
            const selectedImages = Array.from(e.target.files);
            const imageUrls = [];

            selectedImages.forEach((image) => {
                const reader = new FileReader();
                reader.readAsDataURL(image);
                reader.onload = () => {
                    imageUrls.push(reader.result);
                    if (imageUrls.length === selectedImages.length) {
                        setImages((prevImages) => [...prevImages, ...imageUrls]);
                    }
                };
            });
        }
    };
    const getsingleBlogController = () => {
        axios
            .get(`${backendURL}/api/single-blog/${params._id}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
               
                setBlogArray(res.data.singleBlog);
                setTitle(res.data.singleBlog[0].title)
                setDescription(res.data.singleBlog[0].description)
                setImages(res.data.singleBlog[0].images)
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                console.log(error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post(
                `${backendURL}/api/single-blog/${params._id}`,
                { title, description, images},
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then((res) => {
                toast.success('updated');
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                console.log(error);
            });
    };

    const removeImage = (index) =>{
        setImages(images.filter((i,index1)=>{ return index1!==index}))
    }

  return (
    <div>
        <Footer/>
            <div className="signInContainer">
        <div className="loginContiner1">
        <h2>edit post</h2>
        <form className="formContainer" onSubmit={handleSubmit} >
          <ToastContainer />
          <div className="verticalAlign">
              <label htmlFor="title">Title:</label>
              <input className="inputDesign" type="text" id="title" name="title" value={title} onChange={handleInputChange} required />
          </div>
          <div className="verticalAlign">
              <label htmlFor="description">Description:</label>
              <input className="inputDesign" id="description" name="description" value={description} onChange={handleInputChange} required />
          </div>
          <div className="verticalAlign">
              {/* <label htmlFor="images">Images:</label>
              <input type="file" id="images" name="images" accept="image/*" multiple onChange={handleInputChange} /> */}
               <label style={{fontSize:'15px'}} htmlFor="images"><AddPhotoAlternateIcon style={{height:'2rem', width:'2rem', cursor:'pointer'}}/> {images.length>0 && <div>{`${images.length} selected`}</div>} </label>
                <input  style={{display:'none'}}  type="file" id="images" name="images" accept="image/*" multiple onChange={handleInputChange}  />
          </div>
          <div className="horizontalAlign">
              {images.map((image, index) => (
                  <div style={{position:'relative'}}> <img key={index} src={image} alt={`Image ${index}`} /> <div style={{position:'absolute', top:'-10px', right:'-5px', cursor:'pointer'}} onClick={()=>{removeImage(index)}} > <i className='fa fa-times'></i> </div> </div>
              ))}
          </div>
          <button  className="singInButton" type="submit">Submit</button>
      </form>
        </div>
    </div>
    </div>
  )
}
