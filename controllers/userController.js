const User = require("../models/user");
const { haspassword, verifyPassword } = require("../helper/password");
const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');

const SignIn = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      res.status(400).send({ message: "email is already in use" });
    } else {
      const hashedPassword = await haspassword(password);
      const newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
      });
      res.status(200).send({ message: "user created", newUser });
    }
  } catch (error) {
    console.log("error in Signin", error);
    res.status(500).send({ error: error });
  }
};

const SignInGoogle = async (req, res) => {
  try {
    const { name, email, email_verified } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      console.log(userExist);
      const token = await jwt.sign(
        { _id: userExist._id },
        process.env.JWT_SECRET
      );
      res
        .status(200)
        .send({ message: "user created", newUser: userExist, token });
    } else {
      if (email_verified) {
        const newUser = await User.create({
          name: name,
          email: email,
        });
        const userExist = await User.findOne({ email });
        const token = await jwt.sign(
          { _id: userExist._id },
          process.env.JWT_SECRET
        );
        res.status(200).send({ message: "user created", newUser, token });
      } else {
        res.status(400).send({ message: "email not varified" });
      }
    }
  } catch (error) {
    console.log("error in Signin", error);
    res.status(500).send({ error: error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email }).populate({
      path: "frineds",
    });
    if (!userExist) {
      return res.status(400).send({ message: "user not found" });
    }
    const comparePassword = await verifyPassword(password, userExist.password);
    if (!comparePassword) {
      return res.status(400).send({ message: "incorrect password" });
    }
    const token = jwt.sign({ _id: userExist._id }, process.env.JWT_SECRET);

    res.status(200).send({
      userExist,
      token,
    });
  } catch (error) {
    console.log("error in login", error);
    res.status(500).send(error);
  }
};

const forgotPassword = async(req,res) =>{
  try{
    const {email} = req.body
    const userExist = await User.findOne({ email })
    if(!userExist){
     return res.status(400).send({message:'user not found'})
    }
    else{
      const token = jwt.sign({ _id: userExist._id }, process.env.JWT_SECRET,{expiresIn:"5m"});
      const link = `http://localhost:3000/#/reset-password/${userExist._id}/${token}`
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ankitjha302000@gmail.com',
          pass: 'fkcsefndbbadjnwx'
        }
      });
      
      var mailOptions = {
        from: 'ankitjha302000@gmail.com',
        to: email,
        subject: 'reset password',
        text: link
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.status(200).send({message:'link send to your email'})
    }

  }catch(error){
    console.log('error in forgotpassword',error)
  }
}

const resetPassword = async(req,res) =>{
  try{
    const {_id,token,password} = req.body;
    const userExist = await User.findOne({ _id }); 
    const decode = jwt.verify(token,process.env.JWT_SECRET);
    if(!userExist){
       res.status(400).send({message:'user not found'})
    } 
    else{  
      const newPassword = await haspassword(password)
      const updatedPassword = await User.findOneAndUpdate({_id},{$set:{password:newPassword}},{new:true})
      res.status(200).send({message:'password updated'});
    } 
  }catch(error){
    console.log('error in resetPassword', error);
    res.status(500).send({error})
  }
}

module.exports = { SignIn, login, SignInGoogle,forgotPassword,resetPassword };
