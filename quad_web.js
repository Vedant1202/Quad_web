//A web log about quadcopter project

var express             = require('express'),
    app                 = express(),
    mongoose            = require('mongoose'),
    passport            = require('passport'),
    LocalStrategy       = require('passport-local'),
    bodyParser          = require('body-parser'),
    request             = require('request'),
    postquestion        = require('./models/postquestion.js'),
    admin               = require('./models/admin.js'),
    methodOverride      = require("method-override"),
    replyquestion       = require('./models/replyquestion.js'),
    router              = express.Router();

// setup bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//set default files to ejs
app.set('view engine', 'ejs');

// set express to public domain
app.use(express.static("public"));
app.use(methodOverride("_method"));

// setup mongo database for questions, comments, etc
mongoose.connect("mongodb://localhost/quad_web").catch(function (reason) {
  console.log("Error: ", reason);
});

//--------------------------PASSPORT CONFIG----------------------------//
app.use(require('express-session')({
  secret: "Shinigami love apples",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(admin.authenticate()));
passport.serializeUser(admin.serializeUser());
passport.deserializeUser(admin.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentAdmin = req.user;
  next();
});

// ---------------------------- ROUTES ---------------------------//

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

//questions section
app.get("/questions", function (req, res) {
  //get data from DB
  postquestion.find({}, function (err, allpostquestions) {
    if(err){
      console.log(err);
    } else {
      console.log("Posts retrieved from DB successfully");
      res.render("posts", {postquestions: allpostquestions});
    };
  });
});

// update Db Posts
app.post("/questions", function (req, res) {
  //Create a new post and save to Db
  postquestion.create(req.body.postcom, function (err, newPost) {
      if(err){
        console.log(err);
      } else {
        //redirect to comments page
        console.log("comment added succesfully");
        res.redirect("/questions");
      }
  });
  // replyquestion.create(req.body.replycom, function (err, newReply) {
  //   if(err){
  //     console.log(err);
  //   } else {
  //     //redirect to comments page
  //     console.log("reply added succesfully");
  //     res.redirect("/questions");
  //   }
  // });
});

//Delete comments route
app.delete("/questions/:id", isLoggedIn, function (req, res) {
   postquestion.findByIdAndRemove(req.params.id, function (err) {
     if(err){
       res.redirect("/questions");
       console.log("error in deleting comment: ", err);
     } else {
       res.redirect("/questions");
     }
   });
});

//news page
app.get("/news", function (req, res) {
  var url = "https://newsapi.org/v2/everything?q=drone&sources=engadget,techradar&sortBy=publishedAt&apiKey=3f2801d658234e13a35cad099b4570db";
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

//Admin auth route
 app.get("/admin", function (req, res) {
   res.render("adminAuth");
 });

//-------------------------------MiddleWare-----------------------------//
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/admin");
}
//-----------------------------MiddleWare Ends---------------------------//

//Admin login
app.post("/admin", passport.authenticate("local",
    {
      successRedirect: "/questions",
      failureRedirect: "/admin"
    }), function (req, res) {

});

// logout route
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/admin");
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

//------------------------------ Setup Server---------------------------//
app.listen("3500", function () {
  console.log("Quadcopter server has started on port 3500");
});
