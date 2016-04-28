'use strict';

var Firebase = require('firebase');
var firebaseRef = new Firebase('https://lot-scraper.firebaseio.com/lots/');

function addLot(newLot, media, callback) {
    let lots = firebaseRef.child(media);

	lots.once('value', function(snapshot) {
        if (!snapshot.hasChild(newLot.id)) {
        	lots.child(newLot.id).set(newLot);
            console.log('Added new lot: ', newLot);
            callback(null, newLot);
        }
    }, function (err) {
    	callback(err, null);
    });
}

module.exports = {
	addLot : addLot
}