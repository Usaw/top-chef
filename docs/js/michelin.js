const fetch = require ('node-fetch');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

urlPage = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-';

var HRTab = new Array();

async function ScrapHRef()
{
  var page = 1;
  var anno = 0;
  var verif = true;
  while (verif)
  {
    var data = await fetch(urlPage+page.toString());
    var html = await data.text();
    var $ = await cheerio.load(html);
    anno--;
    if($ ('.srp-no-results-text').text().length > 10)
    {
      verif = false;
    }
    else
    {
      $('.poi-card-link').each(
        function()
        {
          HRTab[page-1+anno]=$(this).attr('href');
          console.log(HRTab[page-1+anno]);
          anno++;
        }
      )
      page++;
    }
  }
  console.log(HRTab.length);
  WriteJSON();
}

async function WriteJSON()
{
  var json = { title : "", address:"", postCode:""};

  for(var i=0; i<HRTab.length; i++)
  {
    var data = await fetch("https://restaurant.michelin.fr"+HRTab[i]);
    var html = await data.text();
    var $ = await cheerio.load(html);

    var title = $(".poi_intro-display-title").text().trim();
    json.title = title;

    var address = $(".thoroughfare").text().trim();
    json.address = address;

    var postCode = $(".postal-code").text().trim();
    json.postCode = postCode;

    fs.appendFile('output.json', JSON.stringify(json)+"\r\n", function(err){
        console.log('copy in output.json' + ' page: ' +  String(json.title));
      });
  }
}

ScrapHRef();
