var Firebase = require('firebase');

var firebaseRef = new Firebase('https://lot-scraper.firebaseio.com/');

function addLot(title, callback) {
	firebaseRef.push({title : title}, function(error, userData) {
		callback(error);
	});
}

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