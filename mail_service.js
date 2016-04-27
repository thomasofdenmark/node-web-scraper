'use strict';

var sendgrid  = require('sendgrid')('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');

function sendMail(newLot, media, req) {
   if(req.headers.host.lastIndexOf('localhost') == -1) {
        sendgrid.send({
            to:       'thomasofdenmark@gmail.com',
            from:     media+'@example.com',
            subject:  newLot.price+' : '+newLot.title,
            html:     '<h3>'+newLot.title+'</h3><br><h4>'+newLot.price+'</h4><br><a href="'+newLot.link+'">'+newLot.link+'</a>'
        }, function(err, json) {
            if (err) { return console.error(err); }
            console.log(json);
        });
    }
}

module.exports = {
	sendMail : sendMail
}