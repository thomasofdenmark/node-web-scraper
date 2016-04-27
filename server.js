'use strict';

var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var dbService = require('./db_service');
var mailService = require('./mail_service');
var app     = express();

var dbaQueries = [
    'http://www.dba.dk/have-og-byg/vaerktoej-arbejdsredskaber-og-maskiner/elvaerktoej/produkt-dyksav/?sort=listingdate-desc',
    'http://www.dba.dk/soeg/?soeg=festool&sort=listingdate-desc'
];
var guloggratisQueries = [
    'http://www.guloggratis.dk/s/q-dyksav/',
    'http://www.guloggratis.dk/s/q-festool/'
];

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res){
    res.status(201).send('success'); // do not timeout in order to satisfy CRON

    // DBA
    for (let i = 0; i < dbaQueries.length; i++) {
        request(dbaQueries[i], function(error, response, html){
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
                        if(err) {console.log("err: ", err);}
                        else if(newLot) {
                            mailService.sendMail(newLot, media, req);
                        }
                    });
                });
            }
        });
    }

    // Gul og gratis
    for (let i = 0; i < guloggratisQueries.length; i++) {
        request(guloggratisQueries[i], function(error, response, html){
            if(!error){
                let $ = cheerio.load(html);

                $('.items-list .item').each(function(i, element){
                    let data = $(this);
                    let title = $(data).find('.col2 .text a').text().trim();
                    let link = $(data).attr('data-adlink');
                    let price = $(data).find('.col4').text().trim();
                    let id = link.substring(link.lastIndexOf('/'));
                    let media = 'guloggratis';

                    dbService.addLot(id, title, link, price, media, function(err, newLot) {
                        if(err) {console.log("err: ", err);}
                        else if(newLot) {
                            mailService.sendMail(newLot, media, req);
                        }
                    });
                });
            }
        });
    }
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});