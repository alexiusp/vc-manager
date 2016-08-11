'use strict';
var http = require('http');
var _requestDelay = 100;//ms
var _inProgress = false;

const requestType = {
  GET: "GET",
  POST: "POST"
};

var _request = function(conf) {//conf : type, path, body, cookies, callback
  let headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Encoding': 'deflate',
    'Accept-Language': 'ru,en-US;q=0.8,en;q=0.4',
    'Referer': 'http://api.vircities.com/app/index.html',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0'
  };
  if(!!conf.body && conf.body.length > 0) headers['Content-Length'] = conf.body.length;
  //console.log("_request cookies:", JSON.stringify(conf.cookies));
  if(!!conf.cookies && conf.cookies.length > 0) headers['Cookie'] = conf.cookies.join('; ');
  let options = {
    hostname: 'api.vircities.com',
    port: 80,
    path: conf.path,
    method: conf.type,
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
			_inProgress = false;
      conf.callback(result);
    })
  });
  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
    result.data = {
      error   : 100,
      message : e.message
    };
    result.statusCode = 400;
		_inProgress = false;
  });
  if(conf.body !== undefined) {
    req.write(conf.body);
  }
  req.end();
}
var getConfig = function(type, path, body, cookies, callback) {
	return {
		"type" : type,
		"path" : path,
		"body" : body,
		"cookies" : cookies,
		"callback" : callback
	};
}
var requestQueue = [];

var requestHandler = function() {
	if(!_inProgress) {
		if(requestQueue.length > 0) {
			_inProgress = true;
			let conf = requestQueue.shift();
			_request(conf);
		}
	} else {
		setTimeout(requestHandler, _requestDelay);
	}
}
var putRequestToQueue = function(conf) {
	requestQueue.push(conf);
	requestHandler();
}
exports.get = function(path, cookiesArr, callback) {
	let c = getConfig(requestType.GET, path, undefined, cookiesArr, callback);
  putRequestToQueue(c);
}
exports.post = function(path, postBody, cookiesArr, callback) {
	let c = getConfig(requestType.POST, path, postBody, cookiesArr, callback);
	putRequestToQueue(c);
}
