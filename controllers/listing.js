const Listing=require("../models/listing.js");
        
        // index route
module.exports.index=async(req,res)=>{
  const allListings= await Listing.find({});
  res.render("./listings/index.ejs",{allListings});
};
            //  new route
module.exports.createNewListing=(req,res)=>{
  res.render("./listings/new.ejs");
};            
              //  post route
module.exports.creatPost=async(req,res,next)=>{

       let url=req.file.path;
       let filename=req.file.filename;
    
       const newListing= new Listing(req.body.listing);
       newListing.owner=req.user._id;

       newListing.image={url,filename};

       await newListing.save();
       req.flash("success","New Listing Created");
       res.redirect("/listings"); 
  };       
                  // edit route       
module.exports.editListing=async(req,res)=>{
  let {id}=req.params;
  const listing= await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  let originalImageUrl=listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_200");

  res.render("./listings/edit.ejs",{listing});
};           
                // update Listing
module.exports.updateListing=async(req,res)=>{
  let {id}=req.params;
          
  //        code for authorization
  // let listing=await Listing.findByIdAndUpdate(id);
  // if(!listing.owner.equals(res.locals.user._id)){
  //     req.flash("error","You don't have permission to edit it");
  //     res.redirect(`/listings/${id}`);
  // }

   let listing= await Listing.findByIdAndUpdate(id,{... req.body.listing});

   if(typeof req.file !=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
   }

  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
  
};                
                  //  delete route
module.exports.destroyListing=async(req,res)=>{
  let{id}=req.params;
  let deletedListing= await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted!");
  res.redirect("/listings");
};                  
                // show Listing
module.exports.showListing=async(req,res)=>{
  let{id}=req.params;
  const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs",{listing});
};
                