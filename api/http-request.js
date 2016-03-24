'use strict';
var http = require('http');
const requestType = {
  GET: "GET",
  POST: "POST"
};
var _request = function(type, path, body, cookies, callback) {
  let headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  if(!!body && body.length > 0) headers['Content-Length'] = body.length;
  if(!!cookies && cookies.length > 0) headers['Cookie'] = cookies.join('; ');
  let options = {
    hostname: 'api.vircities.com',
    port: 80,
    path: path,
    method: type,
    headers: headers
  };
  let req = http.request(options, (res) => {
    let result = {
      statusCode: res.statusCode,
      headers: res.headers,
      data: ""
    };
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      result.data += chunk;
    });
    res.on('end', () => {
      result.data = JSON.parse(result.data);
      callback(result);
    })
  });
  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });
  if(body !== undefined) {
    req.write(body);
  }
  req.end();
}
exports.get = function(path, cookiesArr, callback) {
  _request(requestType.GET, path, undefined, cookiesArr, callback);
}
exports.post = function(path, postBody, cookiesArr, callback) {
  _request(requestType.POST, path, postBody, cookiesArr, callback)
}
