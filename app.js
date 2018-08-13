const debug = require('debug')('ftlabs-connected:app');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {

  debug('ORIGIN', req.get('origin'));

  if(req.get('origin') !== undefined){

    if(req.get('origin').endsWith('cinelist.co.uk') || process.env.NODE_ENV === 'development'){
      res.header("Access-Control-Allow-Origin", req.get('origin'));
      res.header("Access-Control-Allow-Credentials", 'true');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }

  }

  next();
});

app.use('^/__gtg', function(req, res){ res.end();});
app.use('/notifications', require('./routes/notifications'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
