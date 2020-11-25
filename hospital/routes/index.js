var express = require('express');
var router = express.Router();
const Record = require("../model/Record");
var session = require('express-session');



/* GET home page. */
router.get('/', function(req, res, next) {
  var authenticated = req.session.name;
  console.log(authenticated);
  res.render('home', {authenticated : authenticated});
});

router.get('/logout', function(req, res, next) {
    req.session.destroy(function(error){ 
      console.log("Session Destroyed") 
      var authenticated = null;
      console.log(authenticated);
      res.render('home',  {authenticated : authenticated} );
    });
    
});

router.get('/profile', function(req, res, next) {
  var authenticated = req.session.name;
  console.log(authenticated);
  res.render('profile', {authenticated : authenticated});
});

router.get('/signin', function(req, res, next) {
    var authenticated = req.session.name;
    console.log(authenticated);
    res.render('signin', {authenticated : authenticated});
});

router.get('/home', function(req, res, next) {
  var authenticated = req.session.name;
  console.log(authenticated);
  res.render('home', {authenticated : authenticated});
});

router.get('/signup', function(req, res, next) {
  var authenticated = req.session.name;
  console.log(authenticated);
  res.render('signup', {authenticated : authenticated});
});

router.get('/viewRecords', function(req, res, next) {
  Record.find((err, record) => {
    console.log(record);
    // Note that this error doesn't mean nothing was found,
    // it means the database had an error while searching, hence the 500 status
    if (err) throw err;
    
    // send the list of all people
    if(record) {
     
      res.render('profile', { record: record });
    } 
    else {
      res.render('profile', { record: record });
    }
});
  
});

// router.post('/register', function(req, res, next) {
//     console.log(req.body.username);
//     console.log(req.body.email);
//     console.log(req.body.password);
//     res.render('register', { title: 'Registration Complete' });
//   });

module.exports = router;