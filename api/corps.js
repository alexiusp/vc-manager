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
  let postBody = "";
  let calcPath = `/company_items/move_items_to_corporation/${compId}/${itemId}/${amount}.json?os=unknown&v=${config.version}`;
  //console.log("moveItemToCorporation request path:", calcPath);
  http_request.post(calcPath, postBody, cookiesArr, callback);
}
exports.addFundsToCompany = function(compId, amount, cookiesArr, callback) {
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
exports.addFundsToCorporation = function(corpId, amount, cookiesArr, callback) {
  let postBody = querystring.stringify({
    data : {
      Corporation : {
        id : corpId,
        vd_invest : amount
      }
    }
  });
  http_request.post(`/corporations/invest_vd.json?os=unknown&v=${config.version}`, postBody, cookiesArr, callback);
}
exports.moveItemToCompany = function(compId, itemId, amount, cookiesArr, callback) {
  let postBody = "";
  let calcPath = `/corporation_items/move_items_to_company/${compId}/${itemId}/${amount}.json?os=unknown&v=${config.version}`;
  //console.log("moveItemToCorporation request path:", calcPath);
  http_request.post(calcPath, postBody, cookiesArr, callback);
}
exports.sellItemFromCorporation = function(corpId, itemId, amount, price, currency, cookiesArr, callback) {
  //console.log("sellItemFromCorporation", cookiesArr);
  let postBody = querystring.stringify({
    data : {
      Exchange : {
        corporation_id : +corpId,
        currency : currency,
        item_type_id : +itemId,
        number : +amount,
        price : `${price}.00`
      }
    }
  });
  console.log("postBody:", postBody);
  http_request.post(`/exchanges/add_corporation_exchange.json?os=unknown&v=${config.version}`, postBody, cookiesArr, callback);
}
exports.sellItemFromCompany = function(compId, itemId, amount, price, currency, cookiesArr, callback) {
  let postBody = querystring.stringify({
    data : {
      Exchange : {
        company_id : +compId,
        currency : currency,
        item_type_id : +itemId,
        number : +amount,
        price : `${price}.00`
      }
    }
  });
  console.log("postBody:", postBody);
  http_request.post(`/exchanges/add_company_exchange.json?os=unknown&v=${config.version}`, postBody, cookiesArr, callback);
}
exports.getCompanyWorkers = function(compId, cookiesArr, callback) {
	http_request.get(`/company_workers/workers_info/${compId}.json?os=unknown&v=${config.version}`, cookiesArr, callback);
}
