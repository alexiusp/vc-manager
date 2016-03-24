'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
var _port = 3010;
const fs = require('fs');
var http = require('http');

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
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
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
  //console.log('corps list request', sessCookies);
  if(!!sessCookies) {
    //console.log("loading api...");
    var api = require('./api/corps.js');
    //console.log("calling getCorpsList");
    api.getCorpsList(sessCookies, (result) => {
      let answer = result.data.corporations;
      //console.log("getCorpsList finished", answer);
      res.json({
        data    :answer,
        error   :0,
        message :""
      });
    });
  } else {
    console.error("session cookies not found");
    res.json({
      error:1,
      message:"Session expired",
      data:[]
    });
  }
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
        error   : 0,
        message : ""
      });
    });
  } else {
    console.error("session cookies not found");
    res.json({
      error:1,
      message:"Session expired",
      data:[]
    });
  }
});
app.get('/api/corp/storage/:id', function(req, res) {
  console.log("corp storage request", req.params);
  let id = +req.params.id;
  let sessCookies = req.session.remoteCookies;
  if(!!sessCookies) {
    let api = require('./api/corps.js');
    api.getCorpStorage(id, sessCookies, (result) => {
      let answer = result.data.storage;
      parseStorageImg(answer);
      res.json({
        data    : answer,
        error   : 0,
        message : ""
      });
    });
  } else {
    console.error("session cookies not found");
    res.json({
      error:1,
      message:"Session expired",
      data:[]
    });
  }
});
app.get('/api/company/:id/storage', function(req, res) {
  let id = +req.params.id;
  console.log("company %s storage request", id, req.params);
  let sessCookies = req.session.remoteCookies;
  if(!!sessCookies) {
    let api = require('./api/corps.js');
    api.getCompanyStorage(id, sessCookies, (result) => {
      let answer = result.data.storage;
      parseStorageImg(answer);
      res.json({
        data    : answer,
        error   : 0,
        message : ""
      });
    });
  } else {
    console.error("session cookies not found");
    res.json({
      error:1,
      message:"Session expired",
      data:[]
    });
  }
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
        error   : 0,
        message : ""
      });
    });
  } else {
    console.error("session cookies not found");
    res.json({
      error:1,
      message:"Session expired",
      data:[]
    });
  }
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
        error   : 0,
        message : ""
      });
    });
  } else {
    console.error("session cookies not found");
    res.json({
      error:1,
      message:"Session expired",
      data:[]
    });
  }
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
        error   : 0,
        message : ""
      });
    });
  } else {
    console.error("session cookies not found");
    res.json({
      error:1,
      message:"Session expired",
      data:[]
    });
  }
})




app.listen(_port, function () {
  console.log(`Express app listening on port ${_port}!`);
});
var parseStorageImg = function(storage) {
  storage.forEach((item, index) => {
    let imgUrl = item.ItemType.image;
    //console.log("image file found ", imgUrl);
    let file = fs.createWriteStream("."+imgUrl, {
      flags: 'wx',
      defaultEncoding: 'binary'
    }).on('error', function(err) {
      // bypassing errors
      //console.log(".");
    });
    var request = http.get("http://api.vircities.com"+imgUrl, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(function() {
          console.log("new image file %s was saved!", imgUrl);
        });
      });
    }).on('error', function(err) {
      console.log("http error: ", err);
    });;
  });
}
