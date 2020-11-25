const express = require("express");
const bodyParser = require("body-parser");
var path = require('path');
var cookieParser = require('cookie-parser');
const user = require("./routes/user"); //new addition
var index = require('./routes/index');
var record = require("./routes/record");
const InitiateMongoServer = require("./config/db");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//Authenticating packages
var session = require('express-session');


// Initiate Mongo Server
InitiateMongoServer();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static('images'));
// PORT
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());
/* GET home page. */
// app.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });



//app.use(express.static(path.join(__dirname, 'public')));
/**
 * Router Middleware
 * Router - /user/*
 * Method - *
 */

app.use("/", user);
app.use('/', index);
app.use('/', record);



app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});

// Handlebars default config
const hbs = require('hbs');
const fs = require('fs');

const partialsDir = __dirname + '/views/partials';

const filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  const matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  const name = matches[1];
  const template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context, null, 2);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error =  err ;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});