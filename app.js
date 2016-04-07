'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
var _port = (process.env.PORT || 5000);
const fs = require('fs');
var http = require('http');
const config = require('./api/config');

app.set('port', _port);
app.use('/app', express.static(__dirname + '/app'));
app.use('/app/images', express.static(__dirname + '/app/images'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({
  name:'vc-manager',
  secret: '1234567890QWERTY',
  resave: true,
  saveUninitialized: true
}));
app.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  /*
  res.header('Access-Control-Allow-Origin', config.url);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  */
  next();
});
app.all('/app/*', function (req, res) {
	res.redirect('/app');
});
app.all('/api', function (req, res) {
  console.log('api root request');
  res.json({data:"battlecruiser operational"});
});
app.post('/api/login', function (req, res) {
  console.log('login request', req.body);
  var user = req.body;
  var api = require('./api/login.js');
  api.login(user, (result) => {
    var cookiesArr = result.headers['set-cookie'];
    req.session.remoteCookies = cookiesArr;
    if(result.statusCode == 200) {
      api.getUserInfo(cookiesArr, (result) => {
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
      })
    } else {
      res.json({
        error:result.data.error,
        message:result.data.setFlash[0].msg,
        data:result.data
      });
    }
  });
});
app.get('/api/corps', function (req, res) {
  let sessCookies = req.session.remoteCookies;
  console.log('corps list request', sessCookies);
  if(!!sessCookies) {
    //console.log("loading api...");
    var api = require('./api/corps.js');
    //console.log("calling getCorpsList");
    api.getCorpsList(sessCookies, (result) => {
      let answer = result.data.corporations;
      console.log("getCorpsList finished", answer);
      res.json({
        data    : answer,
        error   : (!!answer)? 0 : result.data.error,
        message : (result.data.setFlash.length > 0)? result.data.setFlash[0].msg : ""
      });
    });
  } else handleError(res, -1, "Session expired!");
});
app.get('/api/corp/:id', function (req, res) {
  console.log("corp info request", req.params);
  let id = +req.params.id;
  let sessCookies = req.session.remoteCookies;
  if(!!sessCookies) {
    let api = require('./api/corps.js');
    api.getCorpDetail(id, sessCookies, (result) => {
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
  } else handleError(res, -1, "Session expired!");
});
app.get('/api/corp/storage/:id', function(req, res) {
  console.log("corp storage request", req.params);
  let id = +req.params.id;
  let sessCookies = req.session.remoteCookies;
  if(!!sessCookies) {
    let api = require('./api/corps.js');
    api.getCorpStorage(id, sessCookies, (result) => {
      let answer = result.data.storage;
      if(!!answer) parseStorageImg(answer);
      res.json({
        data    : answer,
        error   : result.data.error,
        message : ""
      });
    });
  } else handleError(res, -1, "Session expired!");
});
app.get('/api/company/:id/storage', function(req, res) {
  let id = +req.params.id;
  console.log("company %s storage request", id, req.params);
  let sessCookies = req.session.remoteCookies;
  if(!!sessCookies) {
    let api = require('./api/corps.js');
    api.getCompanyStorage(id, sessCookies, (result) => {
      let answer = result.data.storage;
      if(!!answer) parseStorageImg(answer);
      res.json({
        data    : answer,
        error   : result.data.error,
        message : ""
      });
    });
  } else handleError(res, -1, "Session expired!");
});
app.get('/api/company/:id', function(req, res) {
  let id = +req.params.id;
  console.log("company %s detail request", id);
  let sessCookies = req.session.remoteCookies;
  if(!!sessCookies) {
    let api = require('./api/corps.js');
    api.getCompanyDetail(id, sessCookies, (result) => {
      let answer = result.data.company;
      res.json({
        data    : answer,
        error   : result.data.error,
        message : ""
      });
    });
  } else handleError(res, -1, "Session expired!");
});
app.post('/api/company/:cid/storage', function(req, res) {
  let cid = +req.params.cid;
  let data = req.body;
  console.log("company %s storage move request", cid, req.params, data);
  let sessCookies = req.session.remoteCookies;
  if(!!sessCookies) {
    let api = require('./api/corps.js');
    api.moveItemToCorporation(cid, data.item, data.amount, sessCookies, (result) => {
      let answer = result.data.setFlash;
      console.log("storage move for company %s success:", cid, answer);
      res.json({
        data    : answer,
        error   : result.data.error,
        message : ""
      });
    });
  } else handleError(res, -1, "Session expired!");
});
app.post('/api/company/:cid/funds', function(req, res) {
  let cid = +req.params.cid;
  let data = req.body;
  console.log("company %s funds change request", cid, req.params, data);
  let sessCookies = req.session.remoteCookies;
  if(!!sessCookies) {
    let api = require('./api/corps.js');
    api.addFundsToCompany(cid, data.amount, sessCookies, (result) => {
      let answer = result.data.setFlash;
      console.log("add funds for company %s success:", cid, answer);
      res.json({
        data    : answer,
        error   : result.data.error,
        message : ""
      });
    });
  } else handleError(res, -1, "Session expired!");
});
app.post('/api/corp/:id/funds', function(req, res) {
	let cid = +req.params.id;
  let data = req.body;
  console.log("corporation %s funds change request", cid, req.params, data);
  let sessCookies = req.session.remoteCookies;
  if(!!sessCookies) {
    let api = require('./api/corps.js');
    api.addFundsToCorporation(cid, data.amount, sessCookies, (result) => {
      let answer = result.data.setFlash;
      console.log("add funds for corporation %s success:", cid, answer);
      res.json({
        data    : answer,
        error   : result.data.error,
        message : ""
      });
    });
  } else handleError(res, -1, "Session expired!");
});
app.put('/api/company/:cid/storage', function(req, res) {
  let cid = +req.params.cid;
  let data = req.body;
  console.log("company %s storage move request", cid, req.params, data);
  let sessCookies = req.session.remoteCookies;
  if(!!sessCookies) {
    let api = require('./api/corps.js');
		let results = [];
		let error = 0;
		let counter = 0;
		let timeout = 0;
		if(!!data && !!data.items) data.items.forEach(elem => {
			counter++;
			api.moveItemToCompany(cid, elem.id, elem.amount, sessCookies, (result) => {
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
  } else handleError(res, -1, "Session expired!");
});
app.post('/api/company/:cid/exchange', function(req, res) {
	let cid = +req.params.cid;
  let data = req.body;
  //console.log("company %s exchange request", cid, req.params, data);
  let sessCookies = req.session.remoteCookies;
  if(!!sessCookies) {
    let api = require('./api/corps.js');
    api.sellItemFromCompany(cid, +data.itemId, +data.amount, +data.price, "vdollars", sessCookies, (result) => {
      let answer = result.data.setFlash;
      console.log("company %s exchange success:", cid, answer);
      res.json({
        data    : answer,
        error   : +result.data.error,
        message : ""
      });
    });
  } else handleError(res, -1, "Session expired!");
});
app.post('/api/corp/:id/exchange', function(req, res) {
	let cid = +req.params.id;
  let data = req.body;
  let sessCookies = req.session.remoteCookies;
  console.log("corporation %s exchange request", cid, req.params, data, sessCookies);
  if(!!sessCookies) {
    let api = require('./api/corps.js');
    //console.log("app.post", sessCookies);
    api.sellItemFromCorporation(cid, +data.itemId, +data.amount, +data.price, "vdollars", sessCookies, (result) => {
      let answer = result.data.setFlash;
      console.log("corporation %s exchange success:", cid, answer);
      res.json({
        data    : answer,
        error   : +result.data.error,
        message : ""
      });
    });
  } else handleError(res, -1, "Session expired!");
});






app.listen(app.get('port'), function () {
  console.log(`Express app listening on port ${app.get('port')}!`);
});


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
    //console.log(".");
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
