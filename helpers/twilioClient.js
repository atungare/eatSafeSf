var ACCOUNT_SID = 'AC3d7987fed8ed92b8cae25f1ca3bc2aa1';
var AUTH_TOKEN = 'b2f2c4d3eba14ced72ebbcea19b766a0';

var client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

module.exports.sendMessage = function(messageBody){
  client.sendMessage({
    to: '+12019197623',
    from: '+19738137471',
    body: messageBody
  }, function(err, resp) {
    if (!err) {
      console.log('successfully sent to : ' + resp.from);
    }
  });
};