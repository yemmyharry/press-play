const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const mailgun = require("mailgun-js");
const DOMAIN = "sandboxe471c820dd0449c58c93042c12b237a7.mailgun.org";


const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY , domain: DOMAIN});



exports.user_signup = (req, res, next)=>{
    const { name, email, password} = req.body

    User.findOne({email}).exec((err, user) => {
        if(user){
            return res.status(400).json({error: 'This user already exists'})
        }

        // const token =  jwt.sign({name, email, password}, process.env.SECRET, {expiresIn: '20m'})


        // const data = {
        //     from: "yemmyharry@gmail.com",
        //     to: 'anaxagorasj@gmail.com',
        //     subject: "Activate account",
        //     html: `
        //         <h2> Please click to activate </h2>
        //         <p>  ${process.env.CLIENT_URL}/authentication/activate/${token}  </p>
        //     `
        // };
        // mg.messages().send(data, function (error, body) {
        //     if(error){
        //         return res.json({message: error.message})
        //     }
        //     return res.json({message: "Email has been sent, activate account"})
        //     console.log(body);
        // });

        
        bcrypt.hash(password, 10, (err, hash)=> {
            let newUser = new User({ name, email, password:hash})
            newUser.save((err, success) => {
            if(err){
                console.log("error in signup")
                return res.status(400).json({error: err})
            }
            res.status(200).json({
                message :"signup success"
            })
        })
        })
 
        
    })
}
 

exports.activateAccount = (req, res) => {
    const {token} = req.body
     if(token){
        jwt.verify(token, process.env.SECRET, (err, decodedToken)=>{
            if(err){
                return res.send("expired link")
            }
            const {name,email,password} = decodedToken;

            User.findOne({email}).exec((err, user) => {
                if(user){
                    return res.status(400).json({error: 'This user already exists'})
                }
                        ///you can rewrite this to reset by ffg d method of sending mail but instead of activation make it rest and then  collect the token and use it to change just the password instead of using it to register
                let newUser = new User({ name, email, password})
                newUser.save((err, success) => {
                    if(err){
                        console.log("error in signup")
                        return res.status(400).json({error: err})
                    }
                    res.status(200).json({
                        message :"signup success"
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
        
    })
}