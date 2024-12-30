const Joi = require("joi");
const userModel = require("../models/user-model");
const bcrypt = require('bcrypt');
const { generateToken } = require("../utils/generateTokens");

const registrationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required"
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required"
  }),
  fullname: Joi.string().min(3).max(30).required().messages({
    "string.min": "Full name must be at least 3 characters long",
    "string.max": "Full name must not exceed 30 characters",
    "any.required": "Full name is required"
  })
});

module.exports.registerUser = async function (req, res) {
  try {
    const { error, value } = registrationSchema.validate(req.body);

    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const { email, password, fullname } = value;
    let user=await userModel.findOne({email:email});
    if(user)return res.status(401).send("you arleady have an account,pls login");

    // Generate salt and hash password
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return res.send(err.message);

      bcrypt.hash(password, salt, async function (err, hashedPassword) {
        if (err) return res.send(err.message);

        try {
          let user = await userModel.create({
            email,
            password: hashedPassword, // Save hashed password
            fullname
          });

          let token = generateToken(user);
          res.cookie("token", token);
          res.send("User created successfully");
        } catch (err) {
          res.status(500).send("Error creating user: " + err.message);
        }
      });
    });

  } catch (err) {
    res.status(500).send("Internal Server Error: " + err.message);
  }
};

module.exports.loginUser=async function(req,res) {
  let {email,password}=req.body;
  let user=await userModel.findOne({email:email});
  if(!user)return res.send("email or password incorrect");
bcrypt.compare(password,user.password,function(err,result){
  if(result){
    let token=generateToken(user);
    res.cookie("token",token);
    res.redirect("/shop");
 }else{
  return res.send("email or password incorrect");
}

})
  
  
}
module.exports.logout=function(req,res){
  res.cookie("token"," ");
  res.redirect("/");
};



