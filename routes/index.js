var express = require('express');
var router = express.Router();
var knex = require('../db/knex')
var bcrypt = require('bcrypt')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signup', {
    title: 'Express'
  });
});

router.get('/public', function(req, res, next){
  res.render('public')
})

router.get('/private', function(req, res, next){
  if (!req.session.userInfo){
    res.render('error', {message: 'Unauthorized. For users only.'})
  } else {
    var userInfo = req.session.userInfo
    res.render('private', {username: userInfo.user_name, firstname: userInfo.first_name, lastname: userInfo.last_name})
  }
})

router.get('/admin', function(req, res, next){
  if (!req.session.userInfo || !req.session.userInfo.is_admin){
    res.render('error', {message: 'Unauthorized. For admin only.'})
  } else {
    res.render('admin')
  }
})

router.get('/logout', function(req, res, next){
  req.session = null;
  res.redirect('/')
})

router.get('/login', function(req, res, next){
  res.render('login')
})

router.post('/login', function(req, res, next){
  knex('users').where('user_name', req.body.username).then(function(results){
    let passwordMatch = bcrypt.compareSync(req.body.password, results[0].password)
    if (passwordMatch) {
      let userInfo = results[0]
      delete userInfo.password
      req.session.userInfo = userInfo
      res.redirect('/private')
    } else {
      res.redirect('/')
    }
  })
})

router.post('/signup', function(req, res, next) {
  knex('users').where('user_name', req.body.username).then(function(results) {
    if (results.length >= 1) {
      res.render('error', {
        message: 'Username already taken.'
      })
    } else {
    var hash = bcrypt.hashSync(req.body.password, 12)
    console.log('hash: ', hash)
    knex('users')
      .returning('*')
      .insert({
        user_name: req.body.username,
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        password: hash,
        is_admin: false
      })
      .then(function(results) {
        res.send(results)
      })
    }
  })
})

module.exports = router;
