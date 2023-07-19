const blog = require('../models/blogModel');

const createBlogController = async(req,res) =>{
    try{

        const {title,discription,image,userId} = req.body
        const newBlog = await blog.create(req.body)
        res.status(200).send({ message: "blog created", newBlog });

    }
    catch(error){
        console.log('error in createBlogController', error);
        res.status(400).send({error:error})
    }
}

const getAllBlogController = async(req,res) =>{
    try{

        const allBlogs = await blog.find({}).populate({ path: "userId" , select:{password:0}});
        res.status(200).send({allBlogs})

    }catch(error){
        console.log("error in getAllBlogController", error);
        res.status(400).send({ error: error });
    }
}

module.exports = { createBlogController, getAllBlogController };