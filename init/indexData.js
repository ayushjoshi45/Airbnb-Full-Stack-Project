const mongoose=require("mongoose")
const Listing=require("../models/listing.js")
const initData=require("./data.js")

const MONGO_URI = 'mongodb://127.0.0.1:27017/airbnb';

main()
    .then(() => {
        console.log("Database sucessfully connected");
    }).catch((err) => console.log(err));
async function main() {
    await mongoose.connect(MONGO_URI);
};

const initDB=async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data initialized");
}

initDB();