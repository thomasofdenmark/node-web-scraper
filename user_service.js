"use strict";

var Firebase = require('firebase');

var firebaseRef = new Firebase('https://lot-scraper.firebaseio.com/');
var lots = firebaseRef.child('lots');


function addLot(id, title, link, price, callback) {
	lots.once('value', function(snapshot) {
        if (!snapshot.hasChild(id)) {
        	let newLot = { id: id, title: title, link: link, price: price };
            lots.child(id).set(newLot);
            console.log("Added new lot: ", id);
            callback(null, newLot);
        }
        else {
            console.log("That lot already exists");
        }
    }, function (err) {
    	callback(err, null);
    });
}




// function addLot(title, link, price, callback) {
// 	firebaseRef.push(
// 		{
// 			link : link,
// 			title : title,
// 			price : price,
// 			date : Firebase.ServerValue.TIMESTAMP
// 		}, 
// 		function(error) {
// 			callback(error);
// 		}
// 	);
// }

function addUser(email, password, callback) {

	firebaseRef.createUser({

		email : email,
		password : password
	
	}, function(error, userData) {
		
		callback(error, userData.uid);

	});
}


function authenticate(email, password, callback) {

	firebaseRef.authWithPassword({
	
		email : email, 
		password : password
	
	}, function(error, authData) {
	
		callback(error, authData);

	});
}

module.exports = {

	addLot : addLot,
	addUser : addUser,
	authenticate : authenticate

}