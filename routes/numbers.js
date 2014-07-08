var express = require('express');
var router = express.Router();
var https = require('https');

var Firebase = require('firebase');
var fbRef = new Firebase('https://eatsafesf.firebaseio.com');
var userTokensRef = fbRef.child('userTokens');
var userNumbersRef = fbRef.child('userNumbers');


/* GET home page. */
router.get('/', function(req, res) {
  res.sendfile('public/loginredirect.html');
});

router.post('/', function(req, res) {
  var phoneNumber = req.body.phoneNumber;

  var foursquareReqPath = '/oauth2/access_token?client_id=AYP154OVBTG4OMTGE0NTSI3HGUQH3INFLXOWNIO2T0LTONHU&client_secret=JXLWSILGW5ILQAYQ1DY4FLQFKNBLN01XLRDOTI3AESQVJCN1&grant_type=authorization_code&redirect_uri=http://eat-safe-sf-app.herokuapp.com/enterNumber&code=' + req.url.slice(7);

  getUserToken(req, res, foursquareReqPath, phoneNumber);
});

var getUserToken = function(req, res, reqPath, phoneNum) {
  https.request({
    hostname: 'foursquare.com',
    path: reqPath,
    method: 'POST',
    headers: {
      'Content-Length': 0
    },
  }, function(resp) {
    var resData = "";
    resp.on('data', function (d) {
      resData += d;
    });
    resp.on('end', function() {
      var userToken = JSON.parse(resData)['access_token'];
      getUserInfoFromToken(req, res, userToken, phoneNum);
    });
  }).end();
};

var getUserInfoFromToken = function(req, res, userToken, phoneNum){
  var reqPath = '/v2/users/self?v=20140707&oauth_token=' + userToken;
  https.request({
    hostname: 'api.foursquare.com',
    path: reqPath,
    method: 'GET',
  }, function(resp) {
    var resData = "";
    resp.on('data', function (d) {
      resData += d;
    });
    resp.on('end', function() {
      var userData = JSON.parse(resData).response.user;
      var userId = userData.id;
      linkTokenToId(req, res, userId, userToken, phoneNum);
    });
  }).end();
};

var linkTokenToId = function(req, res, id, token, phoneNum) {
  var userRef = userTokensRef.child(id);
  userRef.once('value', function(userSnapshot) {
    if(userSnapshot.val() === null) {
      userRef.set({token:token});
      userNumbersRef.child(id).set({number:phoneNum});
      res.redirect('/submitted');
    } else {
      res.redirect('/submitted');
    }
  })
};

module.exports = router;
