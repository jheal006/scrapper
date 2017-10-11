// Scripting Tools
var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
// Initialize Express
var app = express();

//models
var Article = require("../models/Article.js");


module.exports = function(app) {

  // Routes
  // 1. At the root path, send a simple hello world message to the browser
  app.get("/", function(req, res) {
    res.send("Hello world");
  });

  app.get("/scrape", function(req,res) {
    request("https://mwomercs.com/news", function(error, response, html) {
      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(html);

      // An empty array to save the data that we'll scrape
      var results = {};

      // With cheerio, find each p-tag with the "title" class
      // (i: iterator. element: the current element)
      $("p").each(function(i, element) {

        // Save the text of the element in a "title" variable
        results.title = $(element).parent().find('h2').text();
        // Save link to article
        results.link = "https://mwomercs.com" + $(element).parent().find('h2').children().attr("href");
        //Save article summary
        var summary = $(element).text();
        summary = summary.replace(/\r?\n|\r/g, " ");
        results.summary = summary;

        // Using the Article model, create a new entry
        // This effectively passes the result object to the entry (and the title and link)
        var entry = new Article(results);

        // Save these results in an object that we'll push into the results array we defined earlier
        entry.save(function(err, doc){
          //Log any errors
          if (err) {
            console.log(err);
          }
          // Or log the doc
          else {
            console.log(doc);
          }
        });
      });

  });
  // Tell the browser that we finisehd scraping the test
  res.send("SCRAPE COMPLETE")
});

  // 2. At the "/all" path, display every entry in the animals collection
  app.get("/all", function(req, res) {
    // Query: In our database, go to the animals collection, then "find" everything
    db.animals.find({}, function(err, found) {
      // Log any errors if the server encounters one
      if (err) {
        console.log(err);
      }
      // Otherwise, send the result of this query to the browser
      else {
        res.json(found);
      }
    });
  });

  // 3. At the "/name" path, display every entry in the animals collection, sorted by name
  app.get("/name", function(req, res) {
    // Query: In our database, go to the animals collection, then "find" everything,
    // but this time, sort it by name (1 means ascending order)
    db.animals.find().sort({ name: 1 }, function(err, found) {
      // Log any errors if the server encounters one
      if (err) {
        console.log(err);
      }
      // Otherwise, send the result of this query to the browser
      else {
        res.json(found);
      }
    });
  });

  // 4. At the "/weight" path, display every entry in the animals collection, sorted by weight
  app.get("/weight", function(req, res) {
    // Query: In our database, go to the animals collection, then "find" everything,
    // but this time, sort it by weight (-1 means descending order)
    db.animals.find().sort({ weight: -1 }, function(err, found) {
      // Log any errors if the server encounters one
      if (err) {
        console.log(err);
      }
      // Otherwise, send the result of this query to the browser
      else {
        res.json(found);
      }
    });
  });
};

// End exports