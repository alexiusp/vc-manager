'use strict';
var querystring = require('qs');

var config = require('./config.js');
var http_request = require('./http-request.js');

exports.login = function(user, callback) {
  console.log("login:", JSON.stringify(user));
  var userData = {
    data : {
      User : user
    }
  };
  var postBody = querystring.stringify(userData);
  http_request.post(`/users/app_auth.json?os=unknown&v=${config.version}`, postBody, [], callback);
}
exports.getUserInfo = function(cookiesArr, callback) {
  //console.log("getUserInfo function call", cookiesArr);
  http_request.get(`/users/short_infos.json?os=unknown&v=${config.version}`, cookiesArr, callback);
}
