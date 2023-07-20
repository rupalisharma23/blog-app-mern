const blog = require('../models/blogModel');

const createBlogController = async(req,res) =>{
    try{
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

        const allBlogs = await blog.find({}).populate({ path: "userId" , select:{password:0}}).sort({createdAt:-1});
        res.status(200).send({allBlogs})

    }catch(error){
        console.log("error in getAllBlogController", error);
        res.status(400).send({ error: error });
    }
}

const getSingleBlog = async(req, res) =>{
    try {
        const singleBlog = await blog.find({_id:req.params._id}).populate({ path: "userId" , select:{password:0}})
        res.status(200).send({ singleBlog });
    } catch (error) {
      console.log("error in getSingleBlog", error);
      res.status(400).send({ error: error });
    }
}

const editSingleBlog = async(req,res) =>{
    try {

        const existingBlog = await blog.findOneAndUpdate({_id:req.params._id},{...req.body},{new:true});
        res.status(200).send({message:'updated', existingBlog})

    } catch (error) {
      console.log("error in getSingleBlog", error);
      res.status(400).send({ error: error });
    }
}

const deleteSingleBlog = async(req,res) =>{
    try {
        const deletedBlog = await blog.findOneAndDelete({_id:req.params._id},{new:true})
        res.status(200).send({message:'deleted', deletedBlog})
    } catch (error) {
      console.log("error in getSingleBlog", error);
      res.status(400).send({ error: error });
    }
}

const getPersonalBlogController = async (req, res) => {
  try {
    const allBlogs = await blog
      .find({ })
      .populate({ path: "userId", select: { password: 0 } })
      .find({ userId: { _id: req.params._id } })
      .sort({ createdAt: -1 });
    res.status(200).send({ allBlogs });
  } catch (error) {
    console.log("error in getAllBlogController", error);
    res.status(400).send({ error: error });
  }
};

module.exports = { createBlogController, getAllBlogController, getSingleBlog,editSingleBlog,deleteSingleBlog,getPersonalBlogController };