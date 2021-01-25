const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email:{ 
        type: String, 
        required: true,
        match: /^\S+@\S+\.\S+$/
    
    },
    password: { type: String, required: true},
    resetLink: {
        data: String,
        default: ''
    }
})

module.exports = mongoose.model('User', userSchema)