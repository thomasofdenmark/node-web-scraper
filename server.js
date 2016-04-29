'use strict';

var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var iconv   = require('iconv-lite');
var dbService = require('./db_service');
var mailService = require('./mail_service');
var app     = express();

var dbaQueries = [
    'http://www.dba.dk/have-og-byg/vaerktoej-arbejdsredskaber-og-maskiner/elvaerktoej/produkt-dyksav/?sort=listingdate-desc',
    'http://www.dba.dk/soeg/?soeg=festool&sort=listingdate-desc',
    'http://www.dba.dk/have-og-byg/vaerktoej-arbejdsredskaber-og-maskiner/?soeg=cmt&sort=listingdate-desc'
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
                let body = iconv.decode(html, 'iso-8859-1');
                let $ = cheerio.load(body);

                $('.dbaListing').each(function(i, element){
                    let data = $(this);
                    let media = 'dba';
                    let newLot = {};

                    newLot.title = $(data).find('.mainContent .expandable-box .listingLink').text().trim() || '';
                    newLot.link = $(data).find('.mainContent .details li').first().find('a').attr('href') || '';
                    newLot.price = $(data).find('td[title="Pris"]').first().text().trim() || '';
                    newLot.imageUrl = $(data).find('.pictureColumn .thumbnailContainer .thumbnailContainerInner img.thumbnail').attr('src') || '';
                    newLot.id = newLot.link.substring(newLot.link.lastIndexOf('id-')).slice(0, -1) || ''; // slice to remove traling "/"

                    dbService.addLot(newLot, media, function(err, insertedLot) {
                        if(err) {console.log("err: ", err);}
                        else if(insertedLot) {
                            mailService.sendMail(insertedLot, media, req);
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
                let body = iconv.decode(html, 'iso-8859-1');
                let $ = cheerio.load(body);

                $('.items-list .item').each(function(i, element){
                    let data = $(this);
                    let media = 'guloggratis';
                    let newLot = {};
                    
                    newLot.title = $(data).find('.col2 .text a').text().trim() || '';
                    newLot.link = $(data).attr('data-adlink') || '';
                    newLot.price = $(data).find('.col4').text().trim() || '';
                    newLot.imageUrl = $(data).find('.col1 .large_image_container img').attr('src') || '';
                    newLot.id = newLot.link.substring(newLot.link.lastIndexOf('/')) || '';

                    dbService.addLot(newLot, media, function(err, insertedLot) {
                        if(err) {console.log("err: ", err);}
                        else if(insertedLot) {
                            mailService.sendMail(insertedLot, media, req);
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