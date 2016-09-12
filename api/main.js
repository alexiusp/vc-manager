'use strict';

const fs = require('fs');
var http = require('http');
var config = require('./config.js');

exports.init = function(xpress) {
  let app = xpress;
  //app.set('trust proxy', 1);
  app.get('/', function(req, res) {
  	res.redirect('/app');
  })
  app.all('/app/*', function (req, res) {
  	res.redirect('/app');
  });
  app.all('/api', function (req, res) {
    //console.log('api root request');
    res.json({data:"battlecruiser operational"});
  });
  app.post('/api/login', function (req, res) {
    console.log("request ip:", req.connection.remoteAddress);
    console.log('login request', req.headers);
    console.log('sess', req.session);
    var user = req.body;
    var api = require('./login');
    api.login(user, (result) => {
			console.log("login result:", result);
      var cookiesArr = result.headers['set-cookie'];
      req.session.remoteCookies = cookiesArr;
			handleRequestError(result, res, (result, res) => {
				api.getUserInfo(cookiesArr, (result) => {
					handleRequestError(result, res, (result, res) => {
						let a = result.data;
	          let b = a.user.User;
	          let c = a.user.UserLevel;
	          if(!!b.avatar_img) parseAvatar(b.avatar_img);
	          let answer = {
	            id          : b.id,
	            avatar      : b.avatar,
	            avatar_img  : b.avatar_img,
	            username    : b.username,
	            vd_balance  : b.vd_balance,
	            vg_balance  : b.vg_balance,
	            max_health  : b.max_health,
	            health      : b.health,
	            energy      : b.energy,
	            max_energy  : b.max_energy,
	            prestige    : b.prestige,
	            city_id     : b.city_id,
	            last_up_energy        : b.last_up_energy,
	            delta_recovery_energy : b.delta_recovery_energy,
	            military_rank         : b.military_rank,
	            military_rank_img     : b.military_rank_img,
	            level               : c.level,
	            xp                  : c.xp,
	            nextLevelExperience : c.nextLevelExperience
	          };
	          res.json({
	            data    :answer,
	            error   :0,
	            message :""
	          });
					});
				});
      });
    });
  });
  app.get('/api/corps', function (req, res) {
    let sessCookies = req.session.remoteCookies;
    //console.log('corps list request', sessCookies);
    if(!!sessCookies) {
      //console.log("loading api...");
      var api = require('./corps');
      //console.log("calling getCorpsList");
      api.getCorpsList(sessCookies, (result) => {
				handleRequestError(result, res, (result, res) => {
					let answer = result.data.corporations;
	        //console.log("getCorpsList finished", answer);
	        res.json({
	          data    : answer,
	          error   : (!!answer)? 0 : result.data.error,
	          message : (result.data.setFlash.length > 0)? result.data.setFlash[0].msg : ""
	        });
				});
      });
    } else handleError(res, -1, "Session expired!");
  });
  app.get('/api/corp/:id', function (req, res) {
    //console.log("corp info request", req.params);
    let id = +req.params.id;
    let sessCookies = req.session.remoteCookies;
    if(!!sessCookies) {
      let api = require('./corps');
      api.getCorpDetail(id, sessCookies, (result) => {
				handleRequestError(result, res, (result, res) => {
					let answer = {
	          is_manager:result.data.is_manager,
	          corporation:result.data.currentCorporation,
	          companies:result.data.companies
	        };
	        res.json({
	          data    : answer,
	          error   : result.data.error,
	          message : ""
	        });
				});
      });
    } else handleError(res, -1, "Session expired!");
  });
  app.get('/api/corp/storage/:id', function(req, res) {
    //console.log("corp storage request", req.params);
    let id = +req.params.id;
    let sessCookies = req.session.remoteCookies;
    if(!!sessCookies) {
      let api = require('./corps');
      api.getCorpStorage(id, sessCookies, (result) => {
				handleRequestError(result, res, (result, res) => {
					let answer = result.data.storage;
	        if(!!answer) parseStorageImg(answer);
	        res.json({
	          data    : answer,
	          error   : result.data.error,
	          message : ""
	        });
				});
      });
    } else handleError(res, -1, "Session expired!");
  });
  app.get('/api/company/:id/storage', function(req, res) {
    let id = +req.params.id;
    //console.log("company %s storage request", id, req.params);
    let sessCookies = req.session.remoteCookies;
    if(!!sessCookies) {
      let api = require('./corps');
      api.getCompanyStorage(id, sessCookies, (result) => {
				handleRequestError(result, res, (result, res) => {
					let answer = result.data.storage;
	        if(!!answer) parseStorageImg(answer);
	        res.json({
	          data    : answer,
	          error   : result.data.error,
	          message : ""
	        });
				});
      });
    } else handleError(res, -1, "Session expired!");
  });
  app.get('/api/company/:id', function(req, res) {
    let id = +req.params.id;
    //console.log("company %s detail request", id);
    let sessCookies = req.session.remoteCookies;
    if(!!sessCookies) {
      let api = require('./corps');
      api.getCompanyDetail(id, sessCookies, (result) => {
				handleRequestError(result, res, (result, res) => {
					let answer = result.data.company;
					if(!!answer.img) getFile(answer.img);
					res.json({
						data    : answer,
						error   : result.data.error,
						message : ""
					});
				});
      });
    } else handleError(res, -1, "Session expired!");
  });
  app.post('/api/company/:cid/storage', function(req, res) {
    let cid = +req.params.cid;
    let data = req.body;
    //console.log("company %s storage move request", cid, req.params, data);
    let sessCookies = req.session.remoteCookies;
    if(!!sessCookies) {
      let api = require('./corps');
      api.moveItemToCorporation(cid, data.item, data.amount, sessCookies, (result) => {
				handleRequestError(result, res, (result, res) => {
					let answer = result.data.setFlash;
					//console.log("storage move for company %s success:", cid, answer);
					res.json({
						data    : answer,
						error   : result.data.error,
						message : ""
					});
				});
      });
    } else handleError(res, -1, "Session expired!");
  });
  app.post('/api/company/:cid/funds', function(req, res) {
    let cid = +req.params.cid;
    let data = req.body;
    //console.log("company %s funds change request", cid, req.params, data);
    let sessCookies = req.session.remoteCookies;
    if(!!sessCookies) {
      let api = require('./corps');
      api.addFundsToCompany(cid, data.amount, sessCookies, (result) => {
				handleRequestError(result, res, (result, res) => {
					let answer = result.data.setFlash;
					//console.log("add funds for company %s success:", cid, answer);
					res.json({
						data    : answer,
						error   : result.data.error,
						message : ""
					});
				});
      });
    } else handleError(res, -1, "Session expired!");
  });
  app.post('/api/corp/:id/funds', function(req, res) {
  	let cid = +req.params.id;
    let data = req.body;
    //console.log("corporation %s funds change request", cid, req.params, data);
    let sessCookies = req.session.remoteCookies;
    if(!!sessCookies) {
      let api = require('./corps');
      api.addFundsToCorporation(cid, data.amount, sessCookies, (result) => {
				handleRequestError(result, res, (result, res) => {
					let answer = result.data.setFlash;
					//console.log("add funds for corporation %s success:", cid, answer);
					res.json({
						data    : answer,
						error   : result.data.error,
						message : ""
					});
				});
      });
    } else handleError(res, -1, "Session expired!");
  });
  app.put('/api/company/:cid/storage', function(req, res) {
    let cid = +req.params.cid;
    let data = req.body;
    //console.log("company %s storage move request", cid, req.params, data);
    let sessCookies = req.session.remoteCookies;
    if(!!sessCookies) {
      let api = require('./corps');
  		let results = [];
  		let error = 0;
  		let counter = 0;
  		let timeout = 0;
  		if(!!data && !!data.items) data.items.forEach(elem => {
  			counter++;
  			api.moveItemToCompany(cid, elem.id, elem.amount, sessCookies, (result) => {
					handleRequestError(result, res, (result, res) => {
						let answer = result.data.setFlash;
						results = results.concat(answer);
						error += result.data.error;
						timeout = setTimeout(()=>{
							counter--;
							if(counter == 0) {
								clearTimeout(timeout);
								res.json({
									data    : results,
									error   : error,
									message : ""
								});
							}
						},10);
					});
  			});
  		});
    } else handleError(res, -1, "Session expired!");
  });
  app.post('/api/company/:cid/exchange', function(req, res) {
  	let cid = +req.params.cid;
    let data = req.body;
    //console.log("company %s exchange request", cid, req.params, data);
    let sessCookies = req.session.remoteCookies;
    if(!!sessCookies) {
      let api = require('./corps');
      api.sellItemFromCompany(cid, +data.itemId, +data.amount, +data.price, "vdollars", sessCookies, (result) => {
				handleRequestError(result, res, (result, res) => {
					let answer = result.data.setFlash;
					//console.log("company %s exchange success:", cid, answer);
					res.json({
						data    : answer,
						error   : +result.data.error,
						message : ""
					});
				});
      });
    } else handleError(res, -1, "Session expired!");
  });
  app.post('/api/corp/:id/exchange', function(req, res) {
  	let cid = +req.params.id;
    let data = req.body;
    let sessCookies = req.session.remoteCookies;
    //console.log("corporation %s exchange request", cid, req.params, data, sessCookies);
    if(!!sessCookies) {
      let api = require('./corps');
      //console.log("app.post", sessCookies);
      api.sellItemFromCorporation(cid, +data.itemId, +data.amount, +data.price, "vdollars", sessCookies, (result) => {
				handleRequestError(result, res, (result, res) => {
					let answer = result.data.setFlash;
	        //console.log("corporation %s exchange success:", cid, answer);
	        res.json({
	          data    : answer,
	          error   : +result.data.error,
	          message : ""
	        });
				});
      });
    } else handleError(res, -1, "Session expired!");
  });
  app.get('/api/company/:id/workers', function(req, res) {
    let id = +req.params.id;
    //console.log("company %s workers request", id);
    let sessCookies = req.session.remoteCookies;
    if(!!sessCookies) {
      let api = require('./corps');
      api.getCompanyWorkers(id, sessCookies, (result) => {
				handleRequestError(result, res, (result, res) => {
					let answer = {
						employees : +result.data.employees,
						employees_possible : +result.data.employees_possible,
						foreign_employees : +result.data.foreign_employees,
						foreign_employees_possible : +result.data.foreign_employees_possible,
						manager : result.data.manager,
						employment : result.data.employment,
						expansion : result.data.expansion
					};
					if(!!answer.manager && !!answer.manager.avatar) parseAvatar(answer.manager.avatar);
					res.json({
						data    : answer,
						error   : result.data.error,
						message : ""
					});
				});
      });
    } else handleError(res, -1, "Session expired!");
  });
  app.get('/api/company/:id/production', function(req, res) {
    let id = +req.params.id;
    //console.log("company %s production list request", id);
    let sessCookies = req.session.remoteCookies;
    if(!!sessCookies) {
      let api = require('./corps');
      api.getProductionList(id, sessCookies, (result) => {
				handleRequestError(result, res, (result, res) => {
					let answer = result.data.company_productions;
					// parse production items and components images
					for(let item of answer) {
						if(!!item.item_type.image) getFile(item.item_type.image);
						if(!!item.item_type.ItemTypeResource) for(let resource of item.item_type.ItemTypeResource) {
							if(!!resource.ItemTypeMain) getFile(resource.ItemTypeMain.image);
						}
					}
					res.json({
						data    : answer,
						error   : result.data.error,
						message : ""
					});
				});
      });
    } else handleError(res, -1, "Session expired!");
  });
  app.post('/api/company/:id/production', function(req, res) {
  	let cid = +req.params.id;
    let data = req.body;
    let sessCookies = req.session.remoteCookies;
    //console.log("corporation %s production change request", cid, req.params, data, sessCookies);
    if(!!sessCookies) {
      let api = require('./corps');
      api.setProduction(cid, +data.itemId, sessCookies, (result) => {
				handleRequestError(result, res, (result, res) => {
					let answer = result.data.setFlash;
					//console.log("corporation %s production change result:", cid, answer);
					res.json({
						data    : answer,
						error   : +result.data.error,
						message : ""
					});
				});
      });
    } else handleError(res, -1, "Session expired!");
  });

}
function handleRequestError(result, response, callback) {
	if(result.statusCode == 200) callback(result, response);
	else response.json({
		error:result.statusCode,
		message:result.data,
		data:JSON.stringify(result)
	});
}
var handleError = function(res, errCode, errMessage) {
	console.error("Error:", errCode, errMessage);
	res.json({
		error		: errCode,
		message	: errMessage,
		data		: []
	});
}
var getFile = function(url) {
  let file = fs.createWriteStream("."+url, {
    flags: 'wx',
    defaultEncoding: 'binary'
  }).on('error', function(err) {
    // bypassing errors
    //console.log("image creating error:", err.message);
  });
  var request = http.get("http://api.vircities.com"+url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(function() {
        console.log("new image file %s was saved!", url);
      });
    });
  }).on('error', function(err) {
    console.error("http error: ", err);
  });;
}
var parseStorageImg = function(storage) {
  storage.forEach((item, index) => {
    let imgUrl = item.ItemType.image;
    //console.log("image file found ", imgUrl);
    getFile(imgUrl);
  });
}
var parseAvatar = function(url) {
  let imgUrl = "/app/images/avatars/" + url;
  getFile(imgUrl);
}
