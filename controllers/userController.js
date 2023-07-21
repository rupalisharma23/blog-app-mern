const User = require('../models/user');
const { haspassword, verifyPassword } = require("../helper/password");
const jwt = require('jsonwebtoken')

const SignIn = async(req,res) =>{
    try{
        const {name, email, password} = req.body
        const userExist = await User.findOne({email})

        if(userExist){
            res.status(400).send({message:'email is already in use'})
        }

        else{
            const hashedPassword = await haspassword(password);
            const newUser = await User.create({
              name: name,
              email: email,
              password: hashedPassword,
            });
            res.status(200).send({message:'user created', newUser})
        }

    }
    catch(error){
        console.log('error in Signin', error)
        res.status(500).send({error:error})
    }
}

const login = async(req,res) =>{
    try{
          const {email, password} = req.body
          const userExist = await User.findOne({ email }).populate({
            path: "frineds",
          });
          if(!userExist){
            return res.status(400).send({message:'user not found'})
          }
          const comparePassword = await verifyPassword(password,userExist.password)
          if(!comparePassword){
            return res.status(400).send({ message: "incorrect password" });
          }
          const token = jwt.sign({_id:userExist._id},process.env.JWT_SECRET)

          res.status(200).send({
            userExist,
            token
          })

    }
    catch(error){
        console.log('error in login', error);
        res.status(500).send(error)
    }
}

module.exports ={SignIn,login}