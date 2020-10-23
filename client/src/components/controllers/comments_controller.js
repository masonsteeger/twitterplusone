const express = require('express')
const comments = express.Router()
const Comment = require('../models/comment.js')

//==================
//  INDEX ROUTE
//==================
comments.get('/', (req, res) => {
  Comment.find({}, (err, foundComment) => {
    res.json(foundComment)
  })
})

//==================
//  CREATE ROUTE
//==================
comments.post('/', (req, res) => {
  Comment.create(req.body, (err, createdComment) => {
    Comment.find({}, (err, foundComment) => {
      res.json(foundComment)
    })
  })
})

//====================
//  UPDATE ROUTE
//====================
comments.put('/:id', (req, res) => {
  Comment.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedComment) => {
    if(err) {
      res.send(err)
    } else {
      Comment.find({}, (err, foundComment) => {
        res.json(foundComment)
      })
    }
  })
})

//=======================
//  DELETE ROUTE
//=======================
comments.delete('/:id', (req, res) => {
  Comment.findByIdAndRemove(req.params.id, (err, deletedComment) => {
    Comment.find({}, (err, foundComment) => {
      res.json(foundComment)
    })
  })
})




module.exports = comments
