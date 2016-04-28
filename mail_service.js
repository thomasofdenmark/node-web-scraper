'use strict';

/*var sendgrid  = require('sendgrid')('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');

function sendMail(newLot, media, req) {
    //if(req.headers.host.lastIndexOf('localhost') == -1) {
    if(true) {
        sendgrid.send({
            to:     'thomasofdenmark@gmail.com',
            from:   media+'@example.com',
            subject:newLot.price+' '+newLot.title,
            html:   '<p>'+newLot.title+'<p><p>'+newLot.price+'</p><br><a href="'+newLot.link+'">'+newLot.link+'</a>'
        }, function(err, json) {
            if (err) { return console.error(err); }
            console.log(json);
        });
    }
}*/

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: 'app49930721@heroku.com',
        pass: 'yjmurpvg9576'
    }
});

function sendMail(newLot, media, req) {
    //if(req.headers.host.lastIndexOf('localhost') == -1) {
    if(true) {
        var mailOptions = {
            to:     'thomasofdenmark@gmail.com',
            from:   media+'@example.com',
            subject:newLot.price+' '+newLot.title,
            html:   '<p>'+newLot.title+'<p><p>'+newLot.price+'</p><br><a href="'+newLot.link+'">'+newLot.link+'</a>',
            attachments: [
                {   
                    filename: 'download.jpg',
                    path: newLot.imageUrl
                }
            ]
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
   }
}

module.exports = {
	sendMail : sendMail
}