// const mongoose=require("mongoose");
// const Schema=mongoose.Schema;

// const passportLocalMongoose=require("passport-local-mongoose");

// const userSchema=({
//   email:{
//     type:String,
//     required:true,
//   }
// });

// userSchema.plugin(passportLocalMongoose);

// module.exports= mongoose.model("User",userSchema);

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String
});

// Apply the passport-local-mongoose plugin to the schema
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema); // Creating the model

module.exports = User;