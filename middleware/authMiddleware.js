const jwt = require("jsonwebtoken");

const requireSignIn = async(req,res,next) =>{
 try{

    const decode = jwt.decode(req.headers.authorization,process.env.JWT_SECRET);
    if(!decode){
        res.status(400).send('invalid token')
    }
    req.user = decode;
    next()
 }
 catch(error){
    console.log('error in requireSignIn', error);
    res.status(400).send({error:error})
 }
}

module.exports = { requireSignIn };