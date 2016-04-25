var Firebase = require('firebase');

var firebaseRef = new Firebase('https://lot-scraper.firebaseio.com/lots');
var lots = firebaseRef.child('lots');


function addLot(title, link, price, callback) {
	lots.once('value', function(snapshot) {
        if (!snapshot.hasChild(title)) {
            lots.child(title).set({ title: title });
        }
        else {
            alert("That lot already exists");
        }
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