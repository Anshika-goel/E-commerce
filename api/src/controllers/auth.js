const router = require("express").Router();
const { check , validationResult } = require("express-validator");
const { users } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

router.post('/signup' ,[
    check("email","Please provide a valid Email")
    .isEmail(),
    check("password","Please enter a password more than 5 characters ")
    .isLength({
        min:6
    })
],async (req,res) => {
    const {password , email} = req.body;
    //VALIDATION OF INPUT
    const errors = validationResult(req);
    if(!errors.isEmpty()){
           res.status(400).json({
            errors: errors.array()
           })
    }
    console.log(email,password);
    //VALIDATE IF USER ALREADY DOESNT EXIST
    let user = users.find((user) => {
        return user.email==email

    })

    if(user){
        return res.status(400).json({
            "errors" : [
                {
                    msg : "The user alreay exists"

                }
            ]
          
           })
    }

    const hashedPassword = await bcrypt.hash(password,10)
    users.push({
        email,
        password:hashedPassword
    })

    const token = await JWT.sign({
        email
    },"udshfusdhudfjvjfdivjifd",{
           expiresIn:56000000
    })

    res.json({
        token
    })
})
router.post("/login",async (req,res)=>{
    const {password,email} =req.body; 
    let user = users.find((user) => {
        return user.email==email

    })
    
    if(!user){
        return res.status(404).json({
            "errors" : [
                {
                    msg : "Invalid Credentials"

                }
            ]
          
           })
    };
    // Check if the password if valid
    let isMatch = await bcrypt.compare(password,user.password);
    
    if(!isMatch){
        return res.status(422).json({
            "errors" : [
                {
                    msg : "Invalid Credentials"

                }
            ]
          
           })
    }
    // Send JSON WEB TOKEN
    const token = await JWT.sign({
        email
    },"udshfusdhudfjvjfdivjifd",{
           expiresIn:56000000
    })

    res.json({
        token
    })

})
router.get("/all",(req,res)=>{
    res.json(users)
})
module.exports = router;