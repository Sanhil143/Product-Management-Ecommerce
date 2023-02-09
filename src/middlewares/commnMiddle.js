const jwt = require("jsonwebtoken");
const { validObjectId } = require('../validations/validator1');
const UserModel = require("../models/userModel");

const authentication = function (req, res, next) {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).send({ status:false, message:"Please login to get access."});
    }
  
    decodedToken = jwt.verify(token,"group1", (err, decode) => {
        if (err) {
          return res
            .status(400)
            .send({ status: false, message: "Token is not correct!",});
        }
        req.user_Id = decode.userId;
        next();
      })
  };

  const authorization = async function (req, res, next) {
    const userId  = req.params.userId
    if (!validObjectId(userId)) {
      return res.status(400).send({status:false,message:"Invalid user ID"});
    }
   
    if (req.user_Id !== userId) {
      return res.status(403).send({status:false,message:"You are not authorized"});
    }
    next();
  };

  
  module.exports={authentication,authorization}