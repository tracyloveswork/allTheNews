var cheerio = require("cheerio");
var request = require("request");

// On button press scrape site

request("https://www.smashingmagazine.com/", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  // Select each element in the HTML body from which you want information.
  // NOTE: Cheerio selectors function similarly to jQuery's selectors,
  // but be sure to visit the package's npm page to see how it works
  $("article.post").each(function(i, element) {

    var title = $(element).children("h2").text();
    var description = $(element).children("p").first().text();
    var link = $(element).children("a").attr("href");

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      description: description,
      link: link
    });
  });


  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});

// Render with handlebars

// Modal pops up with message