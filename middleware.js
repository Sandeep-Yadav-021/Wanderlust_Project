const Listing=require("./models/listing.js");
const Review=require("./models/reviews.js");

module.exports.isLoggedIn=(req,res,next)=>{
 if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","You musy be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner=async(req,res,next)=>{
  let{id}=req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner.equals(res.locals.user._id)){
    req.flash("error","You are not the owner of this listing");
    res.redirect(`/listings/${id}`);
  }
  next();
};

// module.exports.isReviewAuthor=async(req,res,next)=>{
//   let{id,reviewId}=req.params;
//   let review=await Review.findById(reviewId);
//   if(!review.author.equals(res.locals.user._id)){
//     req.flash("error","You are not the author of this review");
//     res.redirect(`/listings/${id}`);
//   }
//   next();
// };
