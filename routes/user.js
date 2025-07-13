const {Router} = require("express");
const {User} = require("../db/db");
const {secret} = require("../SECRET/token");
const{authMiddleware}= require("../Middlewares/veri")
const zod = require("zod");
const jwt = require("jsonwebtoken")

userSchema= zod.object({
    firstname:zod.string(),
    lastname:zod.string(),
    username:zod.string(),
    password:zod.string()
})


const router = Router();

//this route is for signup

router.post("/signup",async(req,res)=>{
    const x = req.body;
    const {success} = userSchema.safeParse(x);
    if(!success){
        res.status(400).json({
            msg:"invalid input"
        })
    }
    
    const existinguser = await User.findOne({
        username:req.body.username
    })
    if(existinguser){
        res.json({
            msg:"user already exist"
        })
    }

    const user= await User.create({
        firstname:req.body.lastname,
        lastname:req.body.lastname,
        username:req.body.username,
        password:req.body.password
    })

   const userid = user._id;

   const token = jwt.sign({userid},secret)
   
   res.json({
    msg:"user created successfully",
    token

   })

})


const signinSchema = zod.object({
    username:zod.string(),
    password:zod.string()
})


///this route is for signin
router.post("/signin",async(req,res)=>{
const y = req.body;
const {success} = signinSchema.safeParse(y);
if(!success){
    res.json({
        msg:"invalid details"
    })
}

const user = await User.findOne({
    username:req.body.username,
    passsword:req.body.password
})

if(user){
    const token = jwt.sign({userID:user._id},secret);
    res.json({
        token
    })
    return;
}
res.status(400).json({
    msg:"error while logging in"
})

})



//this route is for updating the user information like (password,firstname,lastname)

const updationSchema= zod.object({
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string()
})
router.put("/change",authMiddleware, async (req,res)=>{
 const z= req.body;
 const  {success} = updationSchema.safeParse(z);
 if(!success){
    res.json({
        msg:"invalid input"
    })
 }

await User.updateOne(z,{_id:req.userId}) 


})

//fourth route to filter the username(so that we can see the suggestion)
router.get("/bulk",async (req,res) =>{
    const filter = req.query.filter || "";
    
    const users = await User.find({
     $or: [{
        firstName: {
            "$regex": filter
        }
     },{
        lastname:{
            "$regex": filter
        }
     }]   
    })

    res.json({
        User: users.map(User => ({
            username: User.username,
            firstname: User.firstname,
            lastname: User.lastname,
            _id:User._id
        }))
    })

})



module.exports=router;
 