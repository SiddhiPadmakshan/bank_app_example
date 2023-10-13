var express = require('express');
var connection = require('../database.js')
var router = express.Router();

router.get('/:id', function(req, res, next) {
  connection.query(`SELECT * FROM customers WHERE id='${req.params.id}'`, function (err, rows) {
    connection.query(`SELECT * FROM transactions WHERE user_id='${req.params.id}'`, function (err1, rows1) {
    if (err) {
      if (err1){
      //req.flash('error', err)
      res.render('profile', { data: '' })
    }} else {
      res.render('profile', { data: rows, data1: rows1 })
    }
  })
  })
});


module.exports = router;