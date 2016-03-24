'use strict';
var querystring = require('qs');

var config = require('./config.js');
var http_request = require('./http-request');

exports.getCorpsList = function(cookiesArr, callback) {
  //console.log("getCorpsList started");
  http_request.get(`/corporations/corporation_list.json?os=unknown&v=${config.version}`, cookiesArr, callback);
}
exports.getCorpDetail = function(corpId, cookiesArr, callback) {
  http_request.get(`/corporations/corporation_office/${corpId}.json?os=unknown&v=${config.version}`, cookiesArr, callback);
}
exports.getCorpStorage = function(corpId, cookiesArr, callback) {
  http_request.get(`/corporation_items/storage/${corpId}.json?os=unknown&v=${config.version}`, cookiesArr, callback);
}
exports.getCompanyStorage = function(corpId, cookiesArr, callback) {
  http_request.get(`/company_items/storage/${corpId}.json?os=unknown&v=${config.version}`, cookiesArr, callback);
}
exports.getCompanyDetail = function(compId, cookiesArr, callback) {
  http_request.get(`/companies/info/${compId}.json?os=unknown&v=${config.version}`, cookiesArr, callback);
}
exports.moveItemToCorporation = function(compId, itemId, amount, cookiesArr, callback) {
  console.log("inner call moveItemToCorporation",compId, itemId, amount);
  let postBody = "";
  let calcPath = `/company_items/move_items_to_corporation/${compId}/${itemId}/${amount}.json?os=unknown&v=${config.version}`;
  console.log("moveItemToCorporation request path:", calcPath);
  http_request.post(calcPath, postBody, cookiesArr, callback);
}
exports.addFundsToCompany = function(compId, amount, cookiesArr, callback) {
  console.log("add funds", compId, amount);
  let postBody = querystring.stringify({
    data : {
      Company : {
        id : compId,
        amount_add : amount
      }
    }
  });
  http_request.post(`/corporation_companies/add_funds_vd.json?os=unknown&v=${config.version}`, postBody, cookiesArr, callback);
}
