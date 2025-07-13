const {secret} = require("../SECRET/token");

const jwt = require("jsonwebtoken");

function authMiddleware(req,res,next){
    const authHeader = req.headers.authHeader;
    
    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(403).json({});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, secret);
        next();}

    catch(err){
        return res.status(403).json({});
    }     
}


module.exports = {
    authMiddleware
}


