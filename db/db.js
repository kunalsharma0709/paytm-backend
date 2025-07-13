const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://kunal_123:gunnu@cluster0.tz4y4ua.mongodb.net/paytm");

const userSchema = mongoose.Schema({
    firstname:String,
    lastname:String,
    username:String,
    password:String
})


const User= new mongoose.model("user",userSchema);

module.exports={User};

