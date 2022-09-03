const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req,res,next) => {

    let token = req.body.token || req.query.token || req.headers['authorization'];

    if(!token)
      return res.status(403).send("Requires a token for authentication.");

    try{
        token = token.replace(/^Bearer\s+/,"");
        const decoded = jwt.verify(token,process.env.PRIVATE_KEY);
        req.user = decoded;
    }
    catch(err){
       return res.status(401).send(`Invalid token.`);
    }
    return next();
};