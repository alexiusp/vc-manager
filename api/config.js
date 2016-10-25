'use strict';
exports.version = "3.51";
exports.url = "http://localhost:3000";

let defaultHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Encoding': 'deflate',
  'Accept-Language': 'ru,en-US;q=0.8,en;q=0.4',
  'Referer': 'http://api.vircities.com/app/index.html',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0'
};
let headersToCopy = ['user-agent','accept', 'accept-language'];

exports.setHeaders = function(session, headers) {

}

exports.getHeaders = function(session, headers) {

}
