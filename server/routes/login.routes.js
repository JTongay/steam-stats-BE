'use strict'

const express = require('express');
const router = express.Router({
  mergeParams: true
});
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/User.model')
const bcrypt = require('bcrypt')

router.post('/signup', (req, res, next)=>{
  let reqUsername = req.body.user
  let reqPassword = req.body.pass
  User.findOne({username: reqUsername}).then((err, user)=>{
    if(err){
      console.log(err, "error");
      res.json(err)
      return
    }
    if(user){
      console.log(user, "no user");
      res.json({status: "You fucked up"})
      return
    }
    bcrypt.hash(reqPassword, 12, (err, hash)=>{
      User.create({username: reqUsername, password: hash, steamID: null}).then((usr)=>{
        res.json(usr)
      })
    })
  })

})

router.post('/login', (req, res, next)=>{
  let reqUsername = req.body.user
  let reqPassword = req.body.pass
  User.findOne({username: reqUsername}).then((user, err)=>{
    if(err){
      console.log(err, "error")
    } else {
      bcrypt.compare(reqPassword, user.password, (err, pass)=>{
        if(pass){
          let token = jwt.sign({id: user._id.toString()}, process.env.SECRET, {expiresIn: '2h'})
          res.json({
            token: token,
            steamID: "",
            id: user._id.toString()
          })
        } else {
          res.status(422).json({
            status: "password incorrect"
          })
        }
      })
    }


  })

})

router.get('/user/:id', (req, res, next)=>{

  let reqID = req.params.id
  console.log(reqID);
  console.log(req.params);
  User.findOne({_id: reqID}).then((user, err)=>{
    if(err){
      console.log(err);
      res.json(err)
    } else {
      console.log(user);
      res.json(user)
    }
  })

})

router.put('/add-steam', (req, res, next)=>{

  let reqID = req.body.userID
  let reqSteamID = req.body.steamID
  console.log(reqID)
  console.log(reqSteamID)
  User.findOneAndUpdate({_id: reqID}, {steamID: reqSteamID}).then((user, err)=>{
    if(err){
      console.log(err)
    } else {
      console.log(user)
      res.json(user)
    }

  })

})

module.exports = router
