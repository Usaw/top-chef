var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

urlPage = 'https://www.lafourchette.com/recherche/autocomplete?searchText=paul%20bocuse&localeCode=fr';
headers = requests.utils.default_headers()
headers.update(
    {
        'User-Agent': 'My User Agent 1.0',
    }
)
//headers = 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; …) Gecko/20100101 Firefox/58.0';
console.log("first step");
request(urlPage, headers=headers, function(error, response, html){
    if(!error){
        console.log("no error");

        var $ = cheerio.load(html);
        $('.resultItem-information').each(function(){

            var address = $(this).find(".resultItem-address").text();
            console.log(address);

            if(address.includes("94000")){
                console.log("Enter if");
                var link = $(this).find(".resultItem-name > a");
                var urlEnd = link.attr("href");
                var newUrl = "https://www.lafourchette.com"+String(urlEnd);

                request(newUrl, function(error, response, html){
                    if(!error){
                        
                        var $ = cheerio.load(html);
                        console.log("Href recup");
                        var name, promotion;
                        var json = new Object;

                        $('.restaurantSummary-name').each(function(){
                            var data = $(this);
                            name = data.text();
                            json.name = name.trim();
                        })

                        $('.saleType--specialOffer > h3').each(function(){
                            var data = $(this);
                            promotion = data.text();
                            json.promotion = promotion;
                        })

                        fs.writeFile('data-lafourchette.json', JSON.stringify(json, null, 4), function(err){
                            console.log('Success.');
                        })
                    }
                })
            }
            else console.log("address doesn't include 94000");
        })
    }
})