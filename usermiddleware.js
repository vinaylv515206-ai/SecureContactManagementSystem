const jwt = require('jsonwebtoken')
const authmiddleware=(req,res,next)=>{
    
    const authheader = req.headers.authorization
    const token =authheader.split(" ")[1]
    if(!token){
        return res.send("un authorized user")

    }
    try{
    const decoded=jwt.verify(
        token,
        process.env.jwttoken

    )
    req.user=decoded
    next()}
    catch(error){
        res.send("un authorized user")
    }

}
module.exports=authmiddleware