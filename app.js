var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var api = require('./routes/api');
var app = express();

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('./config');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('superSecret', config.secret); // secret variable

// Use favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// Use debug logger
app.use(logger('dev'));

// https://stackoverflow.com/a/12008719
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  'extended': 'true'
}));

app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));

// set to use the public folder
app.use(express.static(path.join(__dirname, 'public')));

// index.html traffic
// unauthenticated 
app.use('/', routes);

app.use('/api', expressJwt({
  secret: config.secret
}));
// forward /api traffic to api.js
// authenticated addressses
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// Set to print output html from jade prettily 
// https://stackoverflow.com/a/11812841
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

// Error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
