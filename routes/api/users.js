const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt =require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')
//Load User model
const User = require('../../models/User')

//Load input validation
const validateRegisterInput = require('../../validations/register')
const validateLoginInput = require('../../validations/login')

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public route
router.get('/test', (req, res) => res.json({msg: 'users works'}))

// @route   POST api/users/register
// @desc    Register user
// @access  Public route
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body)

  // Check Validation
  if(!isValid) {
    return res.status(400).json(errors)
  }

  User
    .findOne({ email: req.body.mail })
    .then( user => {
      if(user) {
        return res.status(400).json({ email: 'Email already exists'})
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        })
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        })

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err
            newUser.password = hash
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err))
          })
        })
      }
    })
})

// @route   POST api/users/login
// @desc    Login User / Returning JWT token
// @access  Public route
router.post('/login', (req, res) => {

  const { errors, isValid } = validateLoginInput(req.body)

  // Check Validation
  if(!isValid) {
    return res.status(400).json(errors)
  }

  const email = req.body.email
  const password = req.body.password

  //Find User by email
  User
    .findOne({email})
    .then(user => {
      //Check for user
      if(!user) {
        errors.email = 'User not found'
        res.status(404).json(errors)
      }
      //Check password
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if(isMatch) {
            //User Matched

            //Create JWT Payload
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            }
            //Sign Token
            jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: 'Bearer '+ token
                  })
            })
          } else {
              errors.password = 'Password incorrect'
              return res.status(400).json(errors)
            }
        })
    })
})

// @route   GET api/users/current
// @desc    Return current user
// @access  Private route
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
})

module.exports = router
