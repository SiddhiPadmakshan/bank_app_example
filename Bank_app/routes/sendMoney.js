var express = require('express');
var connection = require('../database.js')
var router = express.Router();

router.get('/:id', function(req, res, next) {
    connection.query(`SELECT * FROM customers WHERE id<>'${req.params.id}'`, function (err, rows) {
      if (err) {
        req.flash('error', err)
        res.render('sendMoney', { data: '' })
      } else {
        res.render('sendMoney', { data: rows , from: req.params.id})
      }
    })
  });

  router.get('/:from/:to', function(req, res, next) {
    connection.query(`SELECT * FROM customers WHERE id='${req.params.from}' or id ='${req.params.to}'`, function (err, rows) {
      if (err) {
        req.flash('error', err)
        res.render('amountToSend', { data: '' })
      } else {
        res.render('amountToSend', { data: rows, data1: req.params.from, data2: req.params.to });
      }
    })
  });

  router.post('/', function(req, res, next){
    let sender = JSON.parse(req.body.sender);
    let receiver = JSON.parse(req.body.receiver);
    if(sender.amount >= req.body.amount && Number(req.body.amount) > 0 && req.body.amount != ''){
      let senderAmount = Number(sender.amount) - Number(req.body.amount);
      let receiverAmount = Number(receiver.amount) + Number(req.body.amount);
      connection.query(`UPDATE customers SET amount = ${senderAmount} WHERE id='${sender.id}'`, function (err, rows) {
        connection.query(`UPDATE customers SET amount = ${receiverAmount} WHERE id='${receiver.id}'`)
        connection.query(`INSERT INTO transactions(transfered_from,transfered_to,amount,user_id) 
        VALUES ('${sender.full_name}','${receiver.full_name}',${req.body.amount},${sender.id});`)
      if (err) {
        req.flash('error', err)
        res.render('paymentError', { sender: sender, receiver: receiver })
      } else {
        res.render('paymentSuccess', { sender: sender, receiver: receiver, amountSent: req.body.amount });
      }
    })
    }
    else{
      res.render('paymentFailed', { amountSent: req.body.amount, sender: sender, receiver: receiver, })
    }
  })

  module.exports = router;