require("dotenv").config()
const express = require("express")
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const userRouter = require('./routes/users')
const podcastsRouter = require('./routes/podcasts')
// const User = require('./models/user')

// mongoose.connect("mongodb://localhost:27017/pressTest",{ useNewUrlParser: true ,useUnifiedTopology: true })
// .then(()=>{
//     console.log('Connected to mongodb')
// })
// .catch((err)=> {
//     return err.message
// })

 mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true ,'useFindAndModify': false, 'useCreateIndex': true, useUnifiedTopology: true})
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err));


//middlewares

app.use(express.json())



//to prevent cors errors
app.use(cors())


app.get('/', (req,res,next)=>{
    res.send(`Welcome to Press Play API`)
})

app.use('/user', userRouter)

app.use('/api/podcasts', podcastsRouter)

app.use((req,res,next)=>{
    res.status(404).send(new Error)
})


app.listen(process.env.PORT || 4000,()=>{
    console.log("app listening at port 4000")
})