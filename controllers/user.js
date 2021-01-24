const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const _ = require('lodash');
const mailgun = require("mailgun-js");
const DOMAIN = "sandboxe471c820dd0449c58c93042c12b237a7.mailgun.org";
const Mailgen = require('mailgen');
const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY , domain: DOMAIN});
const {sendPasswordResetMail} = require('../config/mail');


exports.userSignup = (req, res, next)=>{
    const { name, email, password} = req.body

    User.findOne({email}).exec((err, user) => {
        if(user){
            return res.status(400).json({error: 'This user already exists'})
        }
        bcrypt.hash(password, 10, (err, hash)=> {
            let newUser = new User({ name, email, password:hash})
            newUser.save((err, success) => {
            if(err){
                console.log("error in signup")
                return res.status(400).json({error: err})
            }
            res.status(200).json({
                message :"signup success",
                extra: newUser
            })
        })
        }) 
    })
}


exports.userLogin = (req,res,next)=>{
    User.find({email: req.body.email})
    .then(user =>{
        if(user.length < 1){
            return res.status(401).send({
                message: "Invalid user"
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if (err){
                return res.status(401).send({
                    message: message.err
                })
            }
            if(result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, 'secret', {
                    expiresIn: "1h"
                })
                return res.status(200).send({
                    message: 'Authentication/Login successful',
                    token: token 
                })
            }
        })
    })
}



// exports.activateAccount = (req, res) => {
//     const {token} = req.body
//      if(token){
//         jwt.verify(token, process.env.SECRET, (err, decodedToken)=>{
//             if(err){
//                 return res.send("expired link")
//             }
//             const {name,email,password} = decodedToken;

//             User.findOne({email}).exec((err, user) => {
//                 if(user){
//                     return res.status(400).json({error: 'This user already exists'})
//                 }
//                         ///you can rewrite this to reset by ffg d method of sending mail but instead of activation make it rest and then  collect the token and use it to change just the password instead of using it to register
//                 let newUser = new User({ name, email, password})
//                 newUser.save((err, success) => {
//                     if(err){
//                         console.log("error in signup")
//                         return res.status(400).json({error: err})
//                     }
//                     res.status(200).json({
//                         message :"signup success"
//                     })
//                 })
//                 })
  
//             })}
//             else {
//         return res.send("error, something went wrong")
//     }
//         }
  
exports.forgotPassword = (req,res) => {
    const {email} = req.body

    User.findOne({email}).exec((err, user) => {
        if(err || !user){
            console.log("Error or User does not exist")
            res.send("User does not exist")
        }
        const token =  jwt.sign({_id: user._id}, process.env.RESET_PASSWORD_KEY, {expiresIn: '1h'})

        user.token = token
        // const data = {
        //     from: "yemmyharry@gmail.com",
        //     to: email,
        //     subject: "Reset Password",
        //     html: `
        //         <h2> Please click to reset your password </h2>
        //         <p>  ${process.env.CLIENT_URL}/reset_password/${token}  </p>
            // `
        // };

        return user.updateOne({resetLink: token}, (err, success) => {
            if(err){
                return res.status(400).send("Link expired or invalid link")
            }
            else {
                // mg.messages().send(data, function (error, body) {
                //     if(error){
                //         return res.json({message: error.message})
                //     }
                //     return res.json({message: "Password reset mail has been sent."})
                    
                // });
                 sendPasswordResetMail(user);

                 res.status(200).send({message: 'A mail has been sent to your email address.'})
            }
        })
      

    })
}


exports.resetPassword = (req, res) => {
    const {resetLink, newPassword} = req.body
    if(resetLink){
        jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, (err, decodedData) => {
            if(err){
                return res.status(401).send("Incorrect or expired token")
            }
            User.findOne({resetLink}, (err,user)=>{
                if(err || !user){
                    res.status(400).send("User with this token does not exist")
                }
                bcrypt.hash(newPassword, 10, (err, hashReset)=>{
                  const obj = {
                    password: hashReset,
                    resetLink: ''
                }
                user = _.extend(user, obj)
                //user is destination while obj is source

                
                user.save((err, result)=>{
                    if(err){
                        return res.status(400).send("Reset password error")
                    }
                    else {
                            return res.json({message: "Your password has been successfully changed."})
                    }
                })   
                })
               
            })
        })
    }
    else {
        res.status(401).send("Authentication Error")
    }
}

