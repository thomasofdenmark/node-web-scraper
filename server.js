var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var userService = require('./user_service');
var app     = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res){
  url = 'http://www.dba.dk/have-og-byg/vaerktoej-arbejdsredskaber-og-maskiner/elvaerktoej/produkt-dyksav/?sort=listingdate-desc';

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      $('.dbaListing').each(function(i, element){
        var data = $(this);
        var title = $(data).find('.mainContent .expandable-box .listingLink').text().trim();
        var link = $(data).find('.mainContent .details li').first().find('a').attr('href');
        var price = $(data).find('td[title="Pris"]').first().text().trim();
        var id = link.substring(link.lastIndexOf('id-')).slice(0, -1); // slice for removing traling /

        userService.addLot(id, title, link, price, function(err, newLot) {
          if(err) {
            console.log("err: ", err);
          }
          else if(newLot) {
            console.log("yippiieeee", newLot);
          }
        });

      });
    }
    else {
      return res.status(500).send('error in call to dba');
    }

    res.status(201).send('success');
  })
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});