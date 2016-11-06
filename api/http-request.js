'use strict';
var http = require('http');
var config = require('./config');
const zlib = require('zlib');
var _requestDelay = 200;//ms
var _inProgress = false;

const requestType = {
  GET: "GET",
  POST: "POST"
};

var _request = function(conf) {//conf : type, path, body, cookies, callback
  console.log("making request", conf.path);
	let headers = conf.session.headers;
  if(!!conf.body && conf.body.length > 0) headers['Content-Length'] = Buffer.byteLength(conf.body);
	else delete headers['Content-Length'];
  //console.log("_request cookies:", JSON.stringify(conf.session.remoteCookies));
  if(!!conf.session.remoteCookies && !!conf.session.remoteCookies.length) headers['Cookie'] = conf.session.remoteCookies.join('; ');
	//console.log("headers:", JSON.stringify(headers));
  let options = {
    hostname: 'api.vircities.com',
    port: 80,
    path: conf.path,
    method: conf.type,
    headers: headers
  };
	let callback = (resObj) => {
		_inProgress = false;
		conf.callback(resObj);
	}
	let errorCallback = (errorMessage) => {
		let r = {
			statusCode: 400,
      data: {
	      error   : 1,
	      message : errorMessage
	    }
		}
		callback(r);
	}
  let req = http.request(options, (res) => {
    let result = {
      statusCode: res.statusCode,
      headers: res.headers,
      data: []
    };
    res.on('data', (chunk) => {
      result.data.push(chunk);
    });
    res.on('end', () => {
			var encoding = res.headers['content-encoding'];
			var buffer = Buffer.concat(result.data);
      let dataString = "";
      try {
				if (encoding == 'gzip') {
	        zlib.gunzip(buffer, function(err, decoded) {
						if(!err) {
							dataString = decoded && decoded.toString('utf8');
							result.data = JSON.parse(dataString);
							callback(result);
						} else errorCallback(decoded && decoded.toString('utf8'));
	        });
	      } else if (encoding == 'deflate') {
	        zlib.inflate(buffer, function(err, decoded) {
						if(!err) {
							dataString = decoded && decoded.toString('utf8');
							result.data = JSON.parse(dataString);
							callback(result);
						} else errorCallback(decoded && decoded.toString('utf8'));
	        })
	      } else {
					dataString = buffer.toString('utf8');
					result.data = JSON.parse(dataString);
					callback(result);
	      }
      } catch (e) {
				errorCallback(`problem with request: ${e.message}`);
      }
    })
  });
  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
		errorCallback(`problem with request: ${e.message}`);
  });
  if(conf.body !== undefined) {
    req.write(conf.body);
  }
  req.end();
}
var getConfig = function(type, path, body, session, callback) {
	return {
		"type" : type,
		"path" : path,
		"body" : body,
		"session" : session,
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
		setTimeout(function() {
      //console.log("http-request.requestHandler timeout. is in progress:", _inProgress);
      requestHandler();
    }, _requestDelay);
	}
}
var putRequestToQueue = function(conf) {
  console.log("http-request.putRequestToQueue:", conf.path);
	requestQueue.push(conf);
	requestHandler();
}
exports.get = function(path, session, callback) {
	let c = getConfig(requestType.GET, path, undefined, session, callback);
  putRequestToQueue(c);
}
exports.post = function(path, postBody, session, callback) {
	let c = getConfig(requestType.POST, path, postBody, session, callback);
	putRequestToQueue(c);
}
