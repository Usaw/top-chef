/*Load HTTP module
var http = require("http");

//Create HTTP server and listen on port 8000 for requests
http.createServer(function (request, response) {

   // Set the response HTTP header with HTTP status and Content type
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body "Hello World"
   response.end('Hello World\n');
}).listen(8000);

// Print URL for accessing server
console.log('Server running at http://127.0.0.1:8000/')

//const michelin = require('michelin');
//console.log(michelin.get());
const rp = require('request-promise');
const cheerio = require('cheerio');
const options = {
  uri: `https://restaurant.michelin.fr/search-restaurants?localisation=1424&cooking_type=&gm_selection=&stars=1&bib_gourmand=&piecette=&michelin_plate=&services=&ambiance=&booking_activated=&min_price=&max_price=&number_of_offers=&prev_localisation=1424&latitude=&longitude=&bbox_ne_lat=&bbox_ne_lon=&bbox_sw_lat=&bbox_sw_lon=&page_number=0&op=Rechercher&js=true`,
  transform: function (body) {
    return cheerio.load(body);
  }
};  */
// https://restaurant.michelin.fr/search-restaurants?localisation=1424&cooking_type=&gm_selection=&stars=1&bib_gourmand=&piecette=&michelin_plate=&services=&ambiance=&booking_activated=&min_price=&max_price=&number_of_offers=&prev_localisation=1424&latitude=&longitude=&bbox_ne_lat=&bbox_ne_lon=&bbox_sw_lat=&bbox_sw_lon=&page_number=8&op=Rechercher&js=true
// modifier le num de la page pour trouver le reste des résultats

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

urlPage = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-';


for (var i = 1; i<36; i++){
    url = urlPage + String(i);
    console.log(url);
    request(url, function(error, response, html){
        if(!error){

            var $ = cheerio.load(html);
            var link;

            $('a.poi-card-link').filter(function(){
                var data = $(this); 
                link = "https://restaurant.michelin.fr"+data.attr('href');   
                console.log(link);
                request(link, function(error, response, body){
                    var $ = cheerio.load(body);
                    var json = { title : "", address:"", postCode:""};

                    $(".poi_intro-display-title").each(function() {
                        data = $(this);
                        var title = data.text().trim();
                        json.title = title;
                    });

                    $(".thoroughfare").each(function() {
                        data = $(this);
                        var address = data.text();
                        json.address = address;
                    });

                    $(".postal-code").each(function() {
                        data = $(this);
                        var postCode = data.text();
                        json.postCode = postCode;
                    });

                    fs.appendFile('output.json', JSON.stringify(json)+"\r\n", function(err){
                        console.log('copy in output.json' + ' page: ' +  String(json.title));

                    });
                });
            })
        }
    });
    console.log("It's over");
}
