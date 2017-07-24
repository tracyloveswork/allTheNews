// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Serve static content for the app from the "public" directory
app.use(express.static(__dirname + "/public"));

// Set-up port
var PORT = process.env.PORT || 3000;

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/allTheNews");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// ROUTES
app.get("/", function(req, res) {
	Article.find({}, function(error, doc){
		if (error) {
			console.log(error);
		}
		else{
			res.render("index", { articleList: doc })
		}
	});

});

// Get articles from the results array
app.get("/scrape", function(req, res) {
	// Scrape articles into page
	request("https://www.smashingmagazine.com/", function(error, response, html) {

	  var $ = cheerio.load(html);

	  var results = [];

	  $("article.post").each(function(i, element) {

	    var title = $(element).children("h2").text();
	    var description = $(element).children("p").first().text();
	    var link = $(element).children("a").attr("href");

	    // Save these results in an object for initial page listing
	    results.push({
	      title: title,
	      description: description,
	      link: link,
	      saved: false
	    });

	  });

	  // Log the results array
	  	console.log(results);

	  // Render with handlebars
  	res.render("index", { articleList: results });

	});

}); // End of route



// A POST route to save article to database

// A GET request to populate the page with articles that have been saved

// A POST to remove a saved article from the database

// A POST to create or update a note

// A POST to delete a note

// Listen on port 3000
app.listen(PORT, function() {
  console.log("Listening on port: " + PORT);
});
