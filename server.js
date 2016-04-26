var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var dbService = require('./db_service');
var app     = express();
var sendgrid  = require('sendgrid')('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');

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res){
    res.status(201).send('success'); // do not timeout in order to satisfy CRON

    url = 'http://www.dba.dk/have-og-byg/vaerktoej-arbejdsredskaber-og-maskiner/elvaerktoej/produkt-dyksav/?sort=listingdate-desc';

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            $('.dbaListing').each(function(i, element){
                var data = $(this);
                var title = $(data).find('.mainContent .expandable-box .listingLink').text().trim();
                var link = $(data).find('.mainContent .details li').first().find('a').attr('href');
                var price = $(data).find('td[title="Pris"]').first().text().trim();
                var id = link.substring(link.lastIndexOf('id-')).slice(0, -1); // slice to remove traling "/"

                dbService.addLot(id, title, link, price, function(err, newLot) {
                    if(err) {
                        console.log("err: ", err);
                    }
                    else if(newLot) {
                        console.log("yippiieeee", newLot);
                        // send succes mail
                        sendgrid.send({
                          to:       'thomasofdenmark@gmail.com',
                          from:     'other@example.com',
                          subject:  'DBA: '+newLot.price+' : '+newLot.title,
                          html:     '<h3>'+newLot.title+'</h3><br><h4>'+newLot.price+'</h4><br><a href="'+newLot.link+'">'+newLot.link+'</a>'
                        }, function(err, json) {
                          if (err) { return console.error(err); }
                          console.log(json);
                        });
                    }
                });
            });
        }
        else {
          // send error mail
        }
    })
})

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});