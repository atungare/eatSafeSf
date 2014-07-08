var express = require('express');
var router = express.Router();
var twilio = require('../helpers/twilioClient.js');

var Firebase = require('firebase');
var fbRef = new Firebase('https://eatsafesf.firebaseio.com');
var userNumbersRef = fbRef.child('userNumbers');
var restaurantsRef = fbRef.child('restaurants');

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/');
});

router.post('/', function(req, res) {
  var checkin = JSON.parse(req.body.checkin);
  checkVenueSafety(req, res, checkin);
  res.end();
});

var checkVenueSafety = function (req, res, checkin) {
  var venueId = checkin.venue.id;
  console.log(venueId);

  var venueRef = restaurantsRef.child(venueId);
  venueRef.once('value', function(venueSnapshot) {
    if(venueSnapshot.val() !== null) {
      sendAlertToUser(req, res, checkin);
    }
  });
};

var sendAlertToUser = function (req, res, checkin) {
  var userId = checkin.user.id;

  var userNum = userNumbersRef.child(userId);
  userNum.once('value', function(numberSnapshot) {
    if(numberSnapshot.val() !== null) {
      var phoneNumber = '+1' + numberSnapshot.val().number;
      var msg = 'Alert! "' + checkin.venue.name + '" starts with S';
      twilio.sendMessage(phoneNumber, msg);
    } else {
      return;
    }
  })
};

module.exports = router;
