const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./reviews.js"); 

const listingSchema=new Schema({
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
  },
  image:{
    url:String,
    filename:String,
  },
  price:{
    type:Number,
  },
  location:{
    type:String,
  },
  country:{
    type:String,
  },

  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    },
  ],

  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },

});

listingSchema.post("findOneAndDelete",async(req,res)=>{
  if(Listing){
    await Review.deleteMany({_id:{$in:Listing.reviews}});
  }
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports= Listing;