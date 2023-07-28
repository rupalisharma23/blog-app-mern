import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import backendURL from './config';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

export default function Blog() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [blogArray, setBlogArray] = useState([]);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('userId'));

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
                        setImages(imageUrls);
                    }
                };
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post(
                `${backendURL}/api/create-blog`,
                { title, description, images, userId: user._id },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then((res) => {
                toast.success('Blog created successfully');
                setTitle('');
                setDescription('');
                setImages([]);
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
        <div className="signInContainer">
            <div className="loginContiner1">
                <h2>create post</h2>
            <form className="formContainer" onSubmit={handleSubmit}>
            <ToastContainer />
            <div className="verticalAlign">
                <label htmlFor="title">Title:</label>
                <input className="inputDesign" type="text" id="title" name="title" value={title} onChange={handleInputChange} required />
            </div>
            <div className="verticalAlign">
                <label htmlFor="description">Description:</label>
                <textarea className="inputDesign" style={{height:'5rem'}} id="description" name="description" value={description} onChange={handleInputChange} required />
            </div>
            <div className="verticalAlign">
                <label style={{fontSize:'15px'}} htmlFor="images"><AddPhotoAlternateIcon style={{height:'2rem', width:'2rem', cursor:'pointer'}}/> {images.length>0 && <div>{`${images.length} selected`}</div>} </label>
                <input  style={{display:'none'}}  type="file" id="images" name="images" accept="image/*" multiple onChange={handleInputChange}  />
            </div>
            <div className="horizontalAlign">
                {images.map((image, index) => (
                   <div style={{position:'relative'}}> <img key={index} src={image} alt={`Image ${index}`} /> <div style={{position:'absolute', top:'-10px', right:'-5px', cursor:'pointer'}} onClick={()=>{removeImage(index)}} > <i className='fa fa-times'></i> </div> </div>
                ))}
            </div>
            <button className="singInButton" type="submit">Submit</button>
        </form>
            </div>
           
        </div>
        
    );
}
