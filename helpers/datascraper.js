var Firebase = require('firebase');
var fbRef = new Firebase('https://eatsafesf.firebaseio.com');
var restaurantsRef = fbRef.child('restaurants');