var express = require('express');
var router = express.Router();
var twilio = require('helpers/twilioclient.js');

/* GET home page. */
router.get('/', function(req, res) {
  twilio.sendMessage('2019197623', 'server side message');
  res.end();
});

module.exports = router;
