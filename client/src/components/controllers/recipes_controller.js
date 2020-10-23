const express = require('express')
const recipes = express.Router()
const Recipe = require('../models/recipe.js')

//==================
//  INDEX ROUTE
//==================
recipes.get('/', (req, res) => {
  Recipe.find({}, (err, foundRecipe) => {
    res.json(foundRecipe)
  })
})

//==================
//  CREATE ROUTE
//==================
recipes.post('/', (req, res) => {
  Recipe.create(req.body, (err, createdRecipe) => {
    Recipe.find({}, (err, foundRecipe) => {
      res.json(foundRecipe)
    })
  })
})

//====================
//  UPDATE ROUTE
//====================
recipes.put('/:id', (req, res) => {
  Recipe.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedRecipe) => {
    if(err) {
      res.send(err)
    } else {
      Recipe.find({}, (err, foundRecipe) => {
        res.json(foundRecipe)
      })
    }
  })
})

//=======================
//  DELETE ROUTE
//=======================
recipes.delete('/:id', (req, res) => {
  Recipe.findByIdAndRemove(req.params.id, (err, deletedRecipe) => {
    Recipe.find({}, (err, foundRecipe) => {
      res.json(foundRecipe)
    })
  })
})

//=======================
//  SEED ROUTE
//=======================


//=======================
//  DROP ROUTE
//=======================


recipes.get('/dropcollection', (req, res) => {
  Recipe.collection.drop()
  res.redirect('/')
})



module.exports = recipes
