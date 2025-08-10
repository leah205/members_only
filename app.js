require("dotenv").config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const passport = require("./passport")
const flash = require('connect-flash')
//get flash message working - add to errors object
//expire cookie
//access denied
//load memberhsip page after login
//add 404 page
//admins see all and error message
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const pool = require("./db/pool");

var app = express();

app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(flash())

app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen('3000', () => {
  console.log('listening')
})

module.exports = app;
