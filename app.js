'use strict';
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var _port = (process.env.PORT || 5000);
var _dbURI = process.env.MONGODB_URI || 'mongodb://localhost/test';
mongoose.connect(_dbURI);

app.set('port', _port);
app.use('/app', express.static(__dirname + '/app'));
app.use('/app/images', express.static(__dirname + '/app/images'));
app.use('/user_uploads/item_logos', express.static(__dirname + '/user_uploads/item_logos'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({
  name:'vc-manager',
  secret: '1234567890QWERTY',
  resave: true,
  saveUninitialized: true,
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
/*
// request logging function
app.use(function(req, res, next) {
  //console.log('%s %s %s', req.method, req.url, req.path);
  next();
});
*/
var api = require('./api/main');
api.init(app);

app.listen(app.get('port'), function () {
  console.log(`Express app listening on port ${app.get('port')}!`);
});
