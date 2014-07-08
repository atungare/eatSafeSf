var Firebase = require('firebase');
var fbRef = new Firebase('https://eatsafesf.firebaseio.com');
var restaurantsRef = fbRef.child('restaurants');

var fs = require('fs');
var parser = require('csv-parse');

var https = require('https');
var querystring = require('querystring');

fs.readFile('./businesses.csv', {encoding:'utf8'}, function(err, businessesCsv) {
  parser(businessesCsv, {columns:true, objname:'business_id'}, function(err, businessesObj){
    fs.readFile('./inspections.csv', {encoding:'utf8'}, function(err, inspectionsCsv) {
      parser(inspectionsCsv, {columns:true, objname:'business_id'}, function(err, inspectionsObj){
        for (var k in inspectionsObj) {
          var business = businessesObj[k];
          requestVenueId(business);
        }
      });
    });
  });
});

var requestVenueId = function (business) {

  var query = {
    client_id: 'AYP154OVBTG4OMTGE0NTSI3HGUQH3INFLXOWNIO2T0LTONHU',
    client_secret: 'JXLWSILGW5ILQAYQ1DY4FLQFKNBLN01XLRDOTI3AESQVJCN1',
    v: '20140707',
    limit: '1',
    query: business.name
  };

  if (business.longitude != "") {
    query['ll'] = business.latitude + ',' + business.longitude;
  } else {
    query['near'] = 'San Francisco, CA';
  }

  var reqPath = '/v2/venues/search?' + querystring.stringify(query);

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
      var likelyVenue = JSON.parse(resData).response.venues;
      if (likelyVenue && likelyVenue.length > 0) {
        var venueId = likelyVenue[0].id;
        linkVenueToFirebase(venueId);
      }
    });
  }).end();

};

var linkVenueToFirebase = function(venueId) {
  restaurantsRef.child(venueId).set('true');
};