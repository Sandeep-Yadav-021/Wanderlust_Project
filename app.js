if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}


const express=require("express");
const app=express();
let Port=8080;

const mongoose=require("mongoose");

const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const ExpressError=require("./utils/ExpressError.js");
   
      
const session=require("express-session");
const flash=require("connect-flash");
   
      //  express route
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

          //  passport library     
const User=require('./models/user.js');
const passport=require('passport');
const LocalStrategy=require('passport-local');  
const passportLocalMongoose = require('passport-local-mongoose');           



const path=require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
main()
  .then(()=>{
    console.log("connected to DB");
  })
  .catch((err)=>{
      console.log(err);
  });

async function main(){
  await mongoose.connect(MONGO_URL);
};
 

// / express session
const sessionOptions={
secret:"mysupersecratekey",
resave:false,
saveUninitialized:true,

cookie:{
expires:Date.now()+7*24*60*60*1000,
maxAge:7*24*60*60*1000,
httpOnly:true,
}
}; 

app.use(session(sessionOptions));
app.use(flash());

        //  passport configuration(usese of passport)

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// connect flash
app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.user=req.user;
next();
});


      //  express route use
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


        // give errror for not exist route
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
  let{statusCode=500,message="something went wrong!"}=err;
  res.status(statusCode).render("error.ejs",{message});
});


app.listen(Port,()=>{
  console.log(`server is listing on port ${Port}`);
});
