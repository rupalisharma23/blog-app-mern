const bcrypt = require('bcrypt');

const haspassword = async(password) =>{
    try{
 
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password,salt)
        return hashedPassword

    }
    catch(error){
        console.log('error in haspassword', error)
    }
}

const verifyPassword = async(password,hashedPassword) =>{
    try{

        const varifiedPassword = await bcrypt.compare(password,hashedPassword);
        return varifiedPassword

    }
    catch(error){
        console.log('error in verifyPassword', error)
    }
}

module.exports = {haspassword,verifyPassword}