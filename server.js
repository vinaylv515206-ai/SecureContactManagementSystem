const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
const bcrypt=require('bcrypt')
const authmiddleware=require('./middlewares/usermiddleware')
const adminmiddleware=require('./middlewares/adminmiddleware')
const jwt=require('jsonwebtoken')
const cors =require('cors')
const app=express()
app.use(cors())
app.use(express.json())
mongoose.connect(process.env.MONGODB_URI,{
    dbName:"SecureContactManagementSystem"
})
.then(()=>{
    console.log('mongodb connected succesfully')
})
.catch((error)=>{
    console.log(error)
})

const cschema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phoneNo:{
        type:String,
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
    
})

const C=mongoose.model("C",cschema)

//user signup schema 
const usersignupschema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    }

})
const User=mongoose.model("User",usersignupschema)
app.post('/signup',async(req,res)=>{
    try{
    const {username,password}=req.body
    const hasedpassword=await bcrypt.hash(password,10)
    await User.create({
        username:username,
        password:hasedpassword

    })
    return res.status(200).send({
        message:"user created succesfully"
    })}
    catch(error){
        return res.status(500).send({
            message:"unable to create user"
        })
    }
})
app.post('/login',async(req,res)=>{
    try{
    const{username,password}=req.body
    const user = await User.findOne({username})
    if(!user){
        return res.status(200).send({
            message:"username not found"
        })

    }
    const ismatch = await bcrypt.compare(
        password,
        user.password
    )
    if(!ismatch){
        return res.status(200).send({
            message:"password incorrect"
        })
    }
    const token = jwt.sign(
        {
        userId: user._id,
        username:user.username,
        role:"user"
        },
        process.env.jwttoken     
)
    return res.status(200).send({
        message:"login succsfull",
        token
    })}
    catch(error){
        return res.status(500).send({
            message:"unable to login"
        })
    }
})
app.post('/create',authmiddleware,async(req,res)=>{
    try{
    const {name,phoneNo}=req.body
  await C.create({
    name:name,
    phoneNo:phoneNo,
    userId: req.user.userId

  })

  return res.status(200).send("contact created succesfully")
}
catch(error){
    return res.status(500).send({
        message:"unable to create contact"
    })
}
})

app.get('/contacts',authmiddleware,async(req,res)=>{
    try{
    const contacts = await C.find({
        userId: req.user.userId
    })
    return res.status(200).send(contacts)
    }
    catch(error){
        return res.status(500).send({
            message:"unable to get contacts"
        })
    }
})
app.put('/update/:id',authmiddleware,async(req,res)=>{
    try{
    
    const contact=await C.findByIdAndUpdate(  {
                _id: req.params.id,
                userId: req.user.userId
            },
            req.body)
    if(!contact){
        return res.status(404).send({
            message:"contact not found"
        })
    }
    return res.status(200).send({
        message:"contact updated",
        contact

    })}
    catch(error){
        return res.status(500).send({
            message:"unable to update contact"
        })
    }
})
app.delete('/delete/:id',authmiddleware,async(req,res)=>{
    try{
    const deletec=await C.findByIdAndDelete({
        _id: req.params.id,
        userId: req.user.userId
        })
    if(!deletec){
        return res.send("contact not found")
    }
    return res.send("contact deleted")}
    catch(error){
        return res.status(500).send({
            message:"unable to delete"
        })
    }
})
/// admin schema 
const adminschema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    type:{
        type:String,
        role:"admin"
    }
   
})
const Admin = mongoose.model("Admin",adminschema)
app.post('/admin/login',async(req,res)=>{
    try{
    const{username,password}=req.body
    const user1 = await Admin.findOne({username})
    if(!user1){
        return res.status(200).send({
            message:"username not found"
        })

    }
    const ismatch = await bcrypt.compare(
        password,
        user1.password
    )
    if(!ismatch){
        return res.status(200).send({
            message:"password incorrect"
        })
    }
    const token = jwt.sign(
        {
        username:user1.username,
        role:"admin"

        },
        process.env.jwttoken     
)
    return res.status(200).send({
        message:"login succsfull",
        token
    })}
    catch(error){
        return res.status(500).send({
            message:"unable to login"
        })
    }
})
app.get('/admin/contacts',authmiddleware,adminmiddleware,async(req,res)=>{
    try{
    const contact2=await C.find()
    return res.send(contact2)}
    catch(error){
        return res.send("unable to fetch the contacts")
    }
})
app.delete('/admin/delete/:id',authmiddleware,adminmiddleware,async(req,res)=>{
    const deletecontacts = await C.findByIdAndDelete(req.params.id)
    return res.send("contact deleted")
})
app.listen(process.env.port,()=>{
    console.log("server running succesfully")
})
