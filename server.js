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

      var title, release, rating;
      var json = { title : "", release : "", rating : ""};

      $('.dbaListing .listingLink').filter(function(){
        var data = $(this);
        title = data.text().trim();
        json.title = title;
      });

      // $('.title_wrapper').filter(function(){
      //   var data = $(this);
      //   title = data.children().first().text().trim();
      //   release = data.children().last().children().last().text().trim();

      //   json.title = title;
      //   json.release = release;
      // })  

      $('.ratingValue').filter(function(){
        var data = $(this);
        rating = data.text().trim();

        json.rating = rating;
      })
    }
    else {
      res.send('error in service call');
    }

    // fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
    //   console.log('File successfully written! - Check your project directory for the output.json file: ', title);
    // })

    userService.addLot(json.title, function(error) {
        if (error) {
          return res.status(500).send('Error when creating user');
        
        } else {      
          return res.status(201).send(title);
        }
    });
  })
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});