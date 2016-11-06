'use strict';
exports.version = "3.70";
exports.url = "http://localhost:3000";

let defaultHeaders = {
  "Content-Type": "application/x-www-form-urlencoded",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate",
  "Accept-Language": "ru,en-US;q=0.8,en;q=0.4",
  "Referer": "http://api.vircities.com/app/index.html",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:49.0) Gecko/20100101 Firefox/49.0",
	"Connection": "keep-alive"
};
let headersToCopy = [
	'User-Agent',
	'Accept',
	'Accept-Language',
	'X-Forwarded-For',
	'X-Do-Not-Track',
	'DNT'
];

// get headers of the original request
// and save it to session
exports.getHeaders = function(session, request) {
	let headers = defaultHeaders;
	// copy client headers
	for (let header of headersToCopy) {
		let reqH = request.get(header);
		if(!!reqH) headers[header] = reqH;
	}
	// save client ip to "proxy" header
	let ip = request.ip;
	// except of localhost
	if(ip != '::1')	{
		let ips = request.ips;
		ips.push(ip);
		headers['X-Forwarded-For'] = ips.join(", ");
	}
	session.headers = headers;
};
