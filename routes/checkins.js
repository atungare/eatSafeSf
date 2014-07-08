var express = require('express');
var router = express.Router();
var twilio = require('../helpers/twilioClient.js');

var Firebase = require('firebase');
var fbRef = new Firebase('https://eatsafesf.firebaseio.com');
var userNumbersRef = fbRef.child('userNumbers');

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/');
});

router.post('/', function(req, res) {
  var checkin = JSON.parse(req.body.checkin);
  checkVenueSafety(checkin);
  res.end();
});

var checkVenueSafety = function (req, res, checkin) {
  var venue = checkin.venue;
  console.log(venue);

  if(checkin.venue.name[0] === 'S') {
    sendAlertToUser(req, res, checkin);
  }

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
