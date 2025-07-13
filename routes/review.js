const express=require("express");
const router=express.Router({mergeParams:true});

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");

const reviewController=require("../controllers/review.js");

// const {isReviewAuthor}=require("../middleware.js");

                //  validation for reviews      
const validateReview=(req,res,next)=>{
  let{error}=reviewSchema.validate(req.body);

  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
};

               // Review
                // Post Route
router.post("/", validateReview,isLoggedIn,(reviewController.createReview));

            // Delete Reviews Route
router.delete("/:reviewId",isLoggedIn,(reviewController.destroyReview));

module.exports=router;

