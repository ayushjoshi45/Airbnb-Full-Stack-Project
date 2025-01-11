const express = require("express")
const app = express();
const mongoose =require("mongoose")
const Listing=require("./models/listing.js")
const path=require("path");

const MONGO_URI = 'mongodb://127.0.0.1:27017/airbnb';
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.set(express.urlencoded({extended:true}))

main()
    .then(() => {
        console.log("Database sucessfully connected");
    }).catch((err) => console.log(err));
async function main() {
    await mongoose.connect(MONGO_URI);
}

app.get("/",(req,res)=>{
    res.send("this is the base route for a website");
})
// app.get("/listingtest",(req,res)=>{
//     const list1=new Listing({
//         title:"my new villa",
//         description:"HEy this is my new villa",
//         url:"https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         price:8000,
//         location:"Pithoragarh",
//         country:"India",
//     });
//     list1.save().then(()=>console.log("saves successfully")).catch((err)=>console.log(err));
//     res.send("list updated in db airbnb");
// })

// Index Route 
app.get("/listings",async(req,res)=>{
    const listings = await Listing.find({})
    res.render("./listings/index.ejs",{listings})
})

// Create new listing route 
app.get("/listings/new",(req,res)=>{
    res.render("./listings/newListings.ejs");
})

// Show routes 
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const specificPost=await Listing.findById(id);
    res.render("./listings/show.ejs",{specificPost});
})
app.listen(3000, () => {
    console.log("Server listining at port 3000");
})