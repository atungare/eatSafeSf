var express = require('express');
var router = express.Router();
var twilio = require('../helpers/twilioClient.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.end();
});

router.post('/', function(req, res) {
  var checkin = JSON.parse(req.body);

  var userId = checkin.user.id;

  var venue = checkin.venue;

  twilio.sendMessage('2019197623', 'foursquare post - server side checkin message');

  console.log(checkin, userId, venue);
  
  res.end();
});

module.exports = router;
