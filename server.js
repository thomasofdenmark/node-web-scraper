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
        userService.addLot(title, link, price);
      });
    }
    else {
      return res.send('error in service call');
    }

    res.send('success');
    // userService.addLot(json.title, function(error) {
    //     if (error) {
    //       return res.status(500).send('Error when creating user');
        
    //     } else {      
    //       return res.status(201).send(title);
    //     }
    // });
  })
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});