'use strict';
var http = require('http');

const requestType = {
  GET: "GET",
  POST: "POST"
};
var _request = function(type, path, body, cookies, callback) {
  let headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Encoding': 'deflate',
    'Accept-Language': 'ru,en-US;q=0.8,en;q=0.4',
    'Referer': 'http://api.vircities.com/app/index.html',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0'
  };
  if(!!body && body.length > 0) headers['Content-Length'] = body.length;
  //console.log("_request cookies:", JSON.stringify(cookies));
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
      let dataString = result.data;
      try {
        result.data = JSON.parse(dataString);
      } catch (e) {
        result.data = `problem with request: ${e.message}`;
        result.debug = dataString;
        result.statusCode = 8;
      }
      callback(result);
    })
  });
  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
    result.data = {
      error   : 100,
      message : e.message
    };
    result.statusCode = 400;
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
  _request(requestType.POST, path, postBody, cookiesArr, callback);
}
