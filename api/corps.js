'use strict';
var querystring = require('qs');

var config = require('./config.js');
var http_request = require('./http-request');

function corpListRequestPage(page, session, result, callback) {
	http_request.get(`/corporations/corporation_list/page:${page}.json?os=unknown&v=${config.version}`, session, (res) => {
		if(res.statusCode != 200) corpListRequestPage(page, session, result, callback);
		else {
			let previous = (!!result && !!result.data.corporations)? result.data.corporations : [];
			let current = res.data.corporations;
			let newResult = res;
			newResult.data.corporations = previous.concat(current);
			if(res.data.paging.Corporation.pageCount > page) {
				corpListRequestPage(page+1, session, newResult, callback);
			} else callback(newResult);
		}
	});
}
exports.getCorpsList = function(session, callback) {
  //console.log("getCorpsList started");
	let page = 1;
	corpListRequestPage(page, session, null, callback);
}
function corpDetailRequestPage(corpId, page, session, result, callback) {
	http_request.get(`/corporations/corporation_office/${corpId}.json?page=${page}&limit=50&os=unknown&v=${config.version}`, session, (res) => {
		if(res.statusCode != 200) corpDetailRequestPage(corpId, page, session, result, callback);
		else {
			let previous = (!!result && !!result.data.companies)? result.data.companies : [];
			let current = res.data.companies;
			let newResult = res;
			newResult.data.companies = previous.concat(current);
			console.log("company list paging?:", res.data.paging.Company.pageCount, page);
			if(res.data.paging.Company.pageCount > page) {
				corpDetailRequestPage(corpId, page+1, session, newResult, callback);
			} else callback(newResult);
		}
	});
}
exports.getCorpDetail = function(corpId, session, callback) {
	let page = 1;
	corpDetailRequestPage(corpId, page, session, null, callback);
}
exports.getCorpStorage = function(corpId, session, callback) {
  http_request.get(`/corporation_items/storage/${corpId}.json?os=unknown&v=${config.version}`, session, callback);
}
exports.getCompanyStorage = function(corpId, session, callback) {
  http_request.get(`/company_items/storage/${corpId}.json?os=unknown&v=${config.version}`, session, callback);
}
exports.getCompanyDetail = function(compId, session, callback) {
  http_request.get(`/companies/info/${compId}.json?os=unknown&v=${config.version}`, session, callback);
}
exports.moveItemToCorporation = function(compId, itemId, amount, session, callback) {
  let postBody = "";
  let calcPath = `/company_items/move_items_to_corporation/${compId}/${itemId}/${amount}.json?os=unknown&v=${config.version}`;
  //console.log("moveItemToCorporation request path:", calcPath);
  http_request.post(calcPath, postBody, session, callback);
}
exports.addFundsToCompany = function(compId, amount, session, callback) {
  if(amount > 0) {
    let postBody = querystring.stringify({
      data : {
        Company : {
          id : compId,
          amount_add : amount
        }
      }
    });
    http_request.post(`/corporation_companies/add_funds_vd.json?os=unknown&v=${config.version}`, postBody, session, callback);
  } else {
    let postBody = querystring.stringify({
      data : {
        Company : {
          id : compId,
          amount_take : -amount
        }
      }
    });
    http_request.post(`/corporation_companies/take_funds_vd.json?os=unknown&v=${config.version}`, postBody, session, callback);
  }
}
exports.addFundsToCorporation = function(corpId, amount, session, callback) {
  let postBody = querystring.stringify({
    data : {
      Corporation : {
        id : corpId,
        vd_invest : amount
      }
    }
  });
  http_request.post(`/corporations/invest_vd.json?os=unknown&v=${config.version}`, postBody, session, callback);
}
exports.moveItemToCompany = function(compId, itemId, amount, session, callback) {
  let postBody = "";
  let calcPath = `/corporation_items/move_items_to_company/${compId}/${itemId}/${amount}.json?os=unknown&v=${config.version}`;
  //console.log("moveItemToCorporation request path:", calcPath);
  http_request.post(calcPath, postBody, session, callback);
}
exports.sellItemFromCorporation = function(corpId, itemId, amount, price, currency, session, callback) {
  //console.log("sellItemFromCorporation", session);
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
  http_request.post(`/exchanges/add_corporation_exchange.json?os=unknown&v=${config.version}`, postBody, session, callback);
}
exports.sellItemFromCompany = function(compId, itemId, amount, price, currency, session, callback) {
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
  //console.log("postBody:", postBody);
  http_request.post(`/exchanges/add_company_exchange.json?os=unknown&v=${config.version}`, postBody, session, callback);
}
exports.getCompanyWorkers = function(compId, session, callback) {
	http_request.get(`/company_workers/workers_info/${compId}.json?os=unknown&v=${config.version}`, session, callback);
}
exports.getProductionList = function(compId, session, callback) {
	http_request.get(`/companies/production_list/${compId}.json?os=unknown&v=${config.version}`, session, callback);
}
exports.setProduction = function(compId, itemId, session, callback) {
	let postBody = querystring.stringify({
    data : {
      Company : {
        id : +compId,
        current_production : +itemId
      }
    }
  });
	http_request.post(`/companies/set_production.json?os=unknown&v=${config.version}`, postBody, session, callback);
}
