'use strict';

var Firebase = require('firebase');
var firebaseRef = new Firebase('https://lot-scraper.firebaseio.com/');
var lots = firebaseRef.child('lots');

function addLot(id, title, link, price, callback) {
	lots.once('value', function(snapshot) {
        if (!snapshot.hasChild(id)) {
        	let newLot = { id: id, title: title, link: link, price: price };
            lots.child(id).set(newLot);
            console.log('Added new lot: ', id);
            callback(null, newLot);
        }
        else {
            console.log('That lot already exists');
        }
    }, function (err) {
    	callback(err, null);
    });
}

module.exports = {
	addLot : addLot
}