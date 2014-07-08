var Firebase = require('firebase');
var fbRef = new Firebase('https://eatsafesf.firebaseio.com');
var restaurantsRef = fbRef.child('restaurants');

var fs = require('fs');
var parser = require('csv-parse');

var businessesCsv = fs.readFileSync('./businesses.csv', {encoding='utf8'});

parser(businessesCsv, {}, function(err, data){
  console.log(data);
});