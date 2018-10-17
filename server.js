const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')
const app = express()

//MongoDB Config
const db = require('./config/keys').mongoURI

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Connect to MongoDB through mongoose
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected succesfully'))
  .catch(err => console.log(`Failed establishing connection : ${err}`))

app.get('/', (req, res) => res.send('Hello World with mongoose'))

//Passport Middleware
app.use(passport.initialize())

//Passport configuration
require('./config/passport')(passport)

//Use Routes 
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server running on Port ${port}`))
