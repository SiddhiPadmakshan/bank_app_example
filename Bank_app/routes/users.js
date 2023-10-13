var express = require('express')
var connection = require('../database.js')
var router = express.Router()

router.get('/', function (req, res, next) {
  connection.query('SELECT * FROM customers', function (err, rows) {
    if (err) {
      req.flash('error', err)
      res.render('users', { data: '' })
    } else {
      res.render('users', { data: rows , title: 'Simple Banking System'})
    }
  })
})


module.exports = router