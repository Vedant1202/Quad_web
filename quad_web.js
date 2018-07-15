//A web log about quadcopter project

var express       = require('express'),
    app           = express(),
    mongoose      = require('mongoose'),
    bodyParser    = require('body-parser');
    request       = require('request');

// setup bodyParser
app.use(bodyParser.urlencoded({extended: true}));
//set default files to ejs
app.set('view engine', 'ejs');

//landing page
app.get("/", function (req, res) {
  res.render("landing");
});

//components page
app.get("/components", function (req, res) {
  res.render("components");
});

//logs page
app.get("/logs", function (req, res) {
  res.render("logs");
});

//resources page
app.get("/resources", function (req, res) {
  res.render("resources");
});

//news page
app.get("/news", function (req, res) {
  var url = "https://newsapi.org/v2/everything?q=drone&sources=engadget&sortBy=publishedAt&apiKey=3f2801d658234e13a35cad099b4570db";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var newsData = JSON.parse(body);
      res.render("news", {newsData: newsData});
      console.log("News api integration successful!");
    } else {
      console.log("Error in news api integration!");
    }
  });
});

//'what is quadcopter page'
app.get("/whatIs", function (req, res) {
  res.render("whatIs");
});

//why did we select a quadcopter page
app.get("/whyIs", function (req, res) {
  res.render("whyIs");
});

//error page
app.get("*", function (req, res) {
  res.send("Error page not found!!");
});

//setup server
app.listen("3500", function () {
  console.log("Quadcopter server has started on port 3500");
});
