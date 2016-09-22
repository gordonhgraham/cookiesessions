var express = require('express');
var router = express.Router();
var knex = require(`../db/knex`);
var bcrypt = require(`bcrypt`);

router.get('/', function(req, res, next) {
  res.render('signup');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/private', function(req, res, next) {
  if (req.session.userInfo) {
    const userInfo = req.session.userInfo;
    res.render(`private`, {
      username: userInfo.user_name,
      firstname: userInfo.first_name,
      lastname: userInfo.last_name
    });
  } else {
    res.render(`error`, {
      message: `Yah can't see dis!`
    })
  }
});

router.get('/public', function(req, res, next) {
  res.render('public');
});

router.get('/admin', function(req, res, next) {
  if (req.session.userInfo && req.session.userInfo.is_admin) {
    res.render(`admin`);
  } else {
    res.render(`error`, {
      message: `Only de adminz!!`
    })
  }
});

router.post(`/signup`, (req, res, next) => {
  knex(`users`).where(`user_name`, req.body.username).then(results => {
    if (results.length > 0) {
      res.render('error', {
        message: 'Username unavailable, try TurdSandwich'
      });
    } else {
      const user = req.body
      const password = bcrypt.hashSync(req.body.password, 12);
      knex(`users`).insert({
          user_name: user.username,
          first_name: user.firstname,
          last_name: user.lastname,
          password: password,
          is_admin: false
        }, `*`)
        .then((results) => {
          req.session.userInfo = results[0];
          delete results.password;
          console.log(results);
          res.redirect(`/private`);
        });
    }
  })
})

router.post(`/login`, (req, res, next) => {
  knex(`users`).where(`user_name`, req.body.username)
    .then((results) => {
      if (results.length == 0) {
        res.render(`error`, {
          message: `Uzur name er passwerd iz wrong`
        })
      } else {
        const user = results[0];
        const passwordMatch = bcrypt.compareSync(req.body.password, user.password);
        if (passwordMatch === true) {
          delete user.password;
          req.session.userInfo = user;
          res.redirect(`private`)
        } else {
          res.render(`error`, {
            message: `Uzur name er passwerd iz wrong`
          })
        }
      }
    })
})

router.get(`/logout`, (req, res, next) => {
  req.session = null;
  res.redirect(`/login`);
});

module.exports = router;
