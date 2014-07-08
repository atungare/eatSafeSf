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
  var venue = checkin.venue;

  var userId = checkin.user.id;

  var userNum = userNumbersRef.child(userId);

  userNum.once('value', function(numberSnapshot) {
    if(numberSnapshot.val() !== null) {
      var phoneNumber = '+1' + numberSnapshot.val().number;
      var msg = 'You checked in to : "' + venue.name + '"';
      console.log(phoneNumber, msg);
      twilio.sendMessage(phoneNumber, msg);
    } else {
      return;
    }
  })

  console.log(venue);

  res.end();
});

module.exports = router;
