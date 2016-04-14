'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
var _port = process.env.OPENSHIFT_NODEJS_PORT || 5000;
var _addr = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
app.set('port', _port);
app.set('addr', _addr);
app.use('/app', express.static(__dirname + '/app'));
app.use('/app/images', express.static(__dirname + '/app/images'));
app.use('/user_uploads/item_logos', express.static(__dirname + '/user_uploads/item_logos'));
//app.use('/app/images/avatars', express.static(__dirname + '/app/images/avatars'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({
  name:'vc-manager',
  secret: '1234567890QWERTY',
  resave: true,
  saveUninitialized: true
}));
/*
app.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});
*/
var api = require('./api/main');
api.init(app);

app.listen(app.get('port'), app.get('addr'), function () {
  console.log(`Express app listening on ${app.get('addr')}:${app.get('port')}!`);
});
