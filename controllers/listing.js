const Listing=require("../models/listing.js");

module.exports.index=async (req, res) => {
    const listings = await Listing.find({});
    res.render("./listings/index.ejs", { listings });
  }

module.exports.newForm=(req, res) => {
    res.render("./listings/newListings.ejs");
  }

  module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const specificPost = await Listing.findById(id).populate({path:"reviews",
      populate:{
        path:"createdBy",
      },
    }).populate("owner");
    if(!specificPost){
      req.flash("error","This listing does not exist");
      res.redirect("/listings");
    }
    else{
      res.render("./listings/show.ejs", { specificPost });
    }
  }

  module.exports.openEdit=async (req, res) => {
    const { id } = req.params;
    const editPost = await Listing.findById(id);
    if(!editPost){
      req.flash("error","This listing does not exist");
      res.redirect("/listings");
    }
    else{
      res.render("./listings/edit.ejs", { editPost });
    }
  }

  module.exports.addNewListing=async (req, res) => {
    const newListings = new Listing(req.body.listings);
    newListings.owner=req.user._id,
    await newListings.save();
    req.flash("success","New Listing Created Successfully");
    res.redirect("/listings");
}

module.exports.updateListing=async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    req.flash("success","Listing Edited Successfully");
    res.redirect(`/listings/${id}`);
  }

  module.exports.deleteListing=async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings");
  }