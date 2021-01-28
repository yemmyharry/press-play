const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const _ = require('lodash');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const { EMAIL, PASSWORD, APP_URL } = process.env;

const base = `${APP_URL}`;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
});

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Press Play',
    link: APP_URL
  }
});

const {sendPasswordResetMail} = require('../config/mail');


exports.userSignup = (req, res, next)=>{
    console.log(req.body)
    const { firstName, lastName, email, password} = req.body

    User.findOne({email}).exec((err, user) => {
        if(user){
            return res.status(400).json({error: 'This user already exists'})
        }

       
        
        const token = jwt.sign({firstName, lastName, email, password}, process.env.ACCOUNT_ACTIVATE, {expiresIn: "30m"});
        const response = {
          body: {
            name: firstName,
            intro: 'Account Activate Link',
            action: {
              instructions: 'To activate your account, click on the link below:',
              button: {
                text: 'Activate Account',
                link: `${base}/api/users/activate-account?token=${token}`
              }
            },
            outro: 'Do not share this link with anyone.'
          }
        };
      
        const mail = mailGenerator.generate(response);
      
        const message = {
          from: `Press Play <o.arigbanla@genesystechhub.com>`,
          to: email,
          subject: 'Activate your account',
          html: mail
        };
      
         transporter.sendMail(message);
        // return true
        res.status(200).send({message: 'A mail has been sent to your email address to activate your account.',
        token: token
            },
            )

        // bcrypt.hash(password, 10, (err, hash)=> {
        //     let newUser = new User({ firstName, lastName, email, password:hash})
        //     newUser.save((err, success) => {
        //     if(err){
        //         console.log("error in signup")
        //         return res.status(400).json({error: err})
        //     }
        //     res.status(200).json({
        //         message :"signup success",
        //         extra: newUser
        //     })
        // })
        // }) 
    })
}


exports.userLogin = (req,res,next)=>{
    User.find({email: req.body.email})
    .then(user =>{
        if(user.length < 1){
            return res.status(401).send({
                message: "User does not exist"
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if (err){
                return res.status(404).send({
                    message: message.err,
                    extra: "Invalid login credentials. Make sure password is not less than 7"
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



exports.activateAccount = (req, res) => {
    const {token} = req.query
     if(token){
        jwt.verify(token, process.env.ACCOUNT_ACTIVATE, (err, decodedToken)=>{
            if(err){
                return res.status(404).send("Incorrect or expired link")
            }
            const { firstName, lastName, email, password} = decodedToken;

            User.findOne({email}).exec((err, user) => {
                if(user){
                    return res.status(400).json({error: 'This user already exists'})
                }

                    bcrypt.hash(password, 10, (err, hash)=> {
                        let newUser = new User({ firstName, lastName, email, password:hash})
                        newUser.save((err, success) => {
                        if(err){
                            console.log("error in signup")
                            return res.status(400).json({error: err})
                        }
                        res.status(200).json({
                            message :"signup success",
                            extra: _.pick(newUser, ["firstName", "lastName", "email"]),
                            token: token
                        })
                    })
                    }) 
                })
  
            })}
            else {
        return res.send("error, something went wrong")
    }
        }
  
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

