const mongoose = require("mongoose");

const listingSchema =new mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique:true,
  },
  description: {
    type: String,
  },
  url:{
    type:String,
    default:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set:(v)=> v===""?"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
  },
  price:{
    type:Number,
    require:true,
  },
  location:{
    type:String,
    require:true
  },
  country:{
    type:String,
    require:true,
  }
});

const Listing=mongoose.model("Listing", listingSchema);
module.exports = Listing;
