
var mongoose                = require('mongoose');
    passportLocalMongoose   = require('passport-local-mongoose');

//set up Admin
var adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

//Setup methods to admin model
adminSchema.plugin(passportLocalMongoose);


//One time Admin Register
//  app.get("/registerWithAWink", function (req, res) {
//    res.render("register");
//  });
//
// app.post("/registerWithAWink", function (req, res) {
//   var newAdmin = new admin({username: req.body.username});
//   admin.register(newAdmin, req.body.password, function (err, admin) {
//                            if(err){
//                              console.log("Error in admin: ", err);
//                              return res.render("register");
//                            }
//                            passport.authenticate("local")(req, res, function (){
//                              res.redirect("/admin");
//                              console.log("Admin added successfully");
//                            });
//                          });
// });

//Export model
module.exports = mongoose.model("admin", adminSchema);
