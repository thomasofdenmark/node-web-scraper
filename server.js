'use strict';

var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var dbService = require('./db_service');
var app     = express();
var sendgrid  = require('sendgrid')('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');

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res){
    res.status(201).send('success'); // do not timeout in order to satisfy CRON

    // DBA
    request('http://www.dba.dk/have-og-byg/vaerktoej-arbejdsredskaber-og-maskiner/elvaerktoej/produkt-dyksav/?sort=listingdate-desc', function(error, response, html){
        if(!error){
            let $ = cheerio.load(html);

            $('.dbaListing').each(function(i, element){
                let data = $(this);
                let title = $(data).find('.mainContent .expandable-box .listingLink').text().trim();
                let link = $(data).find('.mainContent .details li').first().find('a').attr('href');
                let price = $(data).find('td[title="Pris"]').first().text().trim();
                let id = link.substring(link.lastIndexOf('id-')).slice(0, -1); // slice to remove traling "/"
                let media = 'dba';

                dbService.addLot(id, title, link, price, media, function(err, newLot) {
                    if(err) {
                        console.log("err: ", err);
                    }
                    else if(newLot) {
                        // send succes mail
                        if(req.headers.host.lastIndexOf('localhost') == -1) {
                            sendgrid.send({
                                to:       'thomasofdenmark@gmail.com',
                                from:     'dba@example.com',
                                subject:  newLot.price+' : '+newLot.title,
                                html:     '<h3>'+newLot.title+'</h3><br><h4>'+newLot.price+'</h4><br><a href="'+newLot.link+'">'+newLot.link+'</a>'
                            }, function(err, json) {
                                if (err) { return console.error(err); }
                                console.log(json);
                            });
                        }
                    }
                });
            });
        }
    });

    // Gul og gratis
    request('http://www.guloggratis.dk/s/q-dyksav/', function(error, response, html){
        if(!error){
            let $ = cheerio.load(html);

            $('.items-list .item').each(function(i, element){
                let data = $(this);
                let title = $(data).find('.col2 .text a').text().trim();
                let link = $(data).attr('data-adlink');
                let price = $(data).find('.col4').text().trim();
                let id = link.substring(link.lastIndexOf('/'), link.lastIndexOf('-')); // slice to remove traling "/"
                let media = 'guloggratis';

                dbService.addLot(id, title, link, price, media, function(err, newLot) {
                    if(err) {
                        console.log("err: ", err);
                    }
                    else if(newLot) {
                        // send succes mail
                        if(req.headers.host.lastIndexOf('localhost') == -1) {
                            sendgrid.send({
                                to:       'thomasofdenmark@gmail.com',
                                from:     'guloggratis@example.com',
                                subject:  newLot.price+' : '+newLot.title,
                                html:     '<h3>'+newLot.title+'</h3><br><h4>'+newLot.price+'</h4><br><a href="'+newLot.link+'">'+newLot.link+'</a>'
                            }, function(err, json) {
                                if (err) { return console.error(err); }
                                console.log(json);
                            });
                        }
                    }
                });
            });
        }
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});