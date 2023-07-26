import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import backendURL from './config';

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

    return (
        <form onSubmit={handleSubmit}>
            <ToastContainer />
            <div>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" name="title" value={title} onChange={handleInputChange} required />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" value={description} onChange={handleInputChange} required />
            </div>
            <div>
                <label htmlFor="images">Images:</label>
                <input type="file" id="images" name="images" accept="image/*" multiple onChange={handleInputChange} required />
            </div>
            <div>
                {images.map((image, index) => (
                    <img key={index} src={image} alt={`Image ${index}`} />
                ))}
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}
