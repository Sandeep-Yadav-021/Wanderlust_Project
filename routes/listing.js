const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
           
const listingController=require("../controllers/listing.js");

const multer  = require('multer')
const{storage}=require("../cloudConfig.js");
const upload = multer({storage});


  //  validation for listning
const validateListing=(req,res,next)=>{
   let{error}=listingSchema.validate(req.body);

   if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(404,result.error);
   }
   else{
    next();
   }
};

                  //  router.route
            //  Index Route && post route

router.route("/")
   .get(wrapAsync(listingController.index))
   .post(isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.creatPost));

   // .post(upload.single("listing[image]"),(req,res)=>{
   //     res.send(req.file);
   // })


//             //  index route
// router.get("/",wrapAsync(listingController.index));
//             // Post route
// router.post("/",isLoggedIn,wrapAsync(listingController.creatPost));

              // New route
router.get("/new",isLoggedIn,(listingController.createNewListing));




        //           router.route
        //  show update and delete route
router.route("/:id")
   .get((listingController.showListing))
   .put(isLoggedIn,isOwner,upload.single("listing[image]"),(listingController.updateListing))
   .delete(isLoggedIn,isOwner,(listingController.destroyListing));


                // Edit route
router.get("/:id/edit",isLoggedIn,isOwner,(listingController.editListing));


//              //  Update route
// router.put("/:id",isLoggedIn,isOwner,(listingController.updateListing));
//             //  Delete route                   
// // router.delete("/:id",isLoggedIn,isOwner,(listingController.destroyListing));
//            // Show Routes
// router.get("/:id",(listingController.showListing));


module.exports=router;