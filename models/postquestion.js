
var mongoose = require('mongoose');
// set up schema of database entries
var questionSchema = new mongoose.Schema({
  name: String,
  body: String,
  posted: {type: Date, default: Date.now},
  // replies: [{
  //             replyName: String,
  //             replyBody: String,
  //             replyPosted: {type: Date, default: Date.now},
  //             replyId: String,
  //           }]
});

// create the database variable
module.exports = mongoose.model("postquestion", questionSchema);
